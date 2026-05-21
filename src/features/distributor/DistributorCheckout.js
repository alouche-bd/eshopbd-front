import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
    Container,
    Grid,
    Button,
    CircularProgress,
    Paper,
    Box,
    Stack,
    Alert,
    Chip,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {cartSelector, clearCart, getTotals} from "../cart/cartSlice";
import {authSelector} from "../auth/authSlice";
import {isDistributor} from "../../common/constants/userTypes";
import {useGetAllAddressesQuery} from "../../app/services/x3Api";
import {usePostDistributorOrderMutation} from "../../app/services/lumenApi";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";

const currencySymbol = (code) => {
    switch ((code || "EUR").toUpperCase()) {
        case "EUR": return "€";
        case "USD": return "$";
        case "GBP": return "£";
        case "CHF": return "CHF";
        default:    return code;
    }
};

/**
 * Distributor checkout — spec §6, §7, §8.
 *
 * Mirrors the regular Recap layout (no Smileys / no labClient credit case):
 *   - Recap table: image · ref+designation · remise · PU TTC · qty · subtotal
 *   - Order total row
 *   - Delivery address dropdown
 *   - Submit button
 *
 * Cart prices/discounts come from postGetRepartition (fired on the previous
 * page); this page just renders what the cart already holds.
 */
const DistributorCheckout = () => {
    const {push} = useHistory();
    const dispatch = useDispatch();
    const cart = useSelector(cartSelector);
    const {user} = useSelector(authSelector);
    const {t} = useTranslation();

    const clientCode = user?.sage_client_code || user?.codeclientGC;
    const [selectedCode, setSelectedCode] = useState("");

    const {data: addressesData, isLoading: addrLoading} =
        useGetAllAddressesQuery(clientCode, {skip: !clientCode});
    const [postOrder, {isLoading: submitting}] = usePostDistributorOrderMutation();

    useEffect(() => {
        if (!isDistributor(user)) push("/");
    }, [user, push]);

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    // Normalize the two address shapes Sage exposes.
    const addresses = useMemo(() => {
        const raw = addressesData?.adresseslivraison?.adresselivraison;
        const list = Array.isArray(raw) ? raw : [];
        return list
            .filter((a) => (a.active ?? "Oui") !== "Non")
            .map((a) => ({
                code:       a.code       ?? a.numero,
                intitule:   a.intitule   ?? a.libelle,
                adresse1:   a.adresse1   ?? a.adresse,
                adresse2:   a.adresse2   ?? "",
                adresse3:   a.adresse3   ?? "",
                codepostal: a.codepostal ?? "",
                ville:      a.ville      ?? "",
                pays:       a.pays       ?? "",
                codepays:   a.codepays   ?? a.zone ?? "",
                email1:     a.email1     ?? a.eMail ?? "",
                telephone1: a.telephone1 ?? a.telephone ?? "",
                principale: a.principale ?? "",
            }));
    }, [addressesData]);

    useEffect(() => {
        const livraisonCode = user?.sage_livraison_address?.code;
        if (!livraisonCode) return;
        if (addresses.some((a) => a.code === livraisonCode)) {
            setSelectedCode(livraisonCode);
        }
    }, [user, addresses]);

    const selectedAddress = useMemo(
        () => addresses.find((a) => a.code === selectedCode) || null,
        [addresses, selectedCode]
    );

    // Address quick-filter — needed when distributors have 20+ delivery
    // addresses; an unfiltered vertical list takes over the right column.
    const [addressFilter, setAddressFilter] = useState("");
    const filteredAddresses = useMemo(() => {
        const q = addressFilter.trim().toLowerCase();
        if (!q) return addresses;
        return addresses.filter((a) => {
            const haystack = [
                a.code, a.intitule, a.adresse1, a.adresse2,
                a.codepostal, a.ville, a.pays,
            ].filter(Boolean).join(" ").toLowerCase();
            return haystack.includes(q);
        });
    }, [addresses, addressFilter]);

    const onSubmit = async () => {
        if (!cart.cartItems.length) {
            toast.error(t("validation.cartEmpty"));
            return;
        }
        if (!selectedAddress) {
            toast.error(t("validation.deliveryAddressRequired"));
            return;
        }
        const products = cart.cartItems.map((p) => ({
            reference:   p.reference,
            designation: p.designation || p.intitule || "",
            salesUnit:   p.uniteventes || p.unitevente || "UN",
            quantity:    p.cartQuantity,
            grossPrice:  p.prixbrut ?? p.puttc,
            discount1:   p.remise1montant || 0,
            discount2:   p.remise2montant || 0,
            discount3:   p.remise3montant || 0,
            lineTotalHt: p.puttc ? p.puttc * p.cartQuantity : null,
        }));
        const body = {
            deliveryAddress: selectedAddress,
            products,
            totals: {
                ht: cart.cartTotalAmount,
                ttc: cart.cartTotalAmountCheckout || cart.cartTotalAmount,
                discount: cart.discount || 0,
            },
        };
        try {
            const res = await postOrder(body).unwrap();
            if (res.success) {
                toast.success(t("distributor.checkout.success"));
                dispatch(clearCart());
                push("/profile/shipments");
            } else {
                toast.error(res.message || t("distributor.checkout.fail"));
            }
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        }
    };

    const currency = currencySymbol(user?.currency);

    const ACCENT = "#1BA9AA";
    const microLabelSx = {
        fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
    };

    return (
        <Container maxWidth="xl" sx={{py: {xs: 3, md: 6}}}>
            {/* Back link — refined */}
            <Box
                onClick={() => push("/distributor")}
                sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    mb: 3, cursor: "pointer",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.15em",
                    color: "rgba(0,0,0,0.5)", textTransform: "uppercase",
                    "&:hover": {color: "text.primary"},
                }}
            >
                <ArrowBackIosNewIcon sx={{fontSize: 12}}/> {t("checkout.back")}
            </Box>

            {/* Refined header */}
            <Box sx={{mb: {xs: 4, md: 6}, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)", pb: 3}}>
                <Box sx={microLabelSx}>{t("distributor.checkout.eyebrow")}</Box>
                <Box
                    component="h1"
                    sx={{
                        m: 0, mt: 1,
                        fontSize: {xs: 28, md: 36}, fontWeight: 300, letterSpacing: "-0.01em",
                    }}
                >
                    {t("distributor.checkout.title")}
                </Box>
            </Box>

            <Grid container spacing={{xs: 3, md: 6}} alignItems="flex-start">
                {/* Left column: product recap */}
                <Grid item lg={8} xs={12}>
                    {/* Column header */}
                    <Grid
                        container alignItems="center"
                        sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}
                    >
                        <Grid item xs={1}/>
                        <Grid item xs={4}>{t("common.designation")}</Grid>
                        <Grid item xs={1} sx={{textAlign: "center"}}>{t("product.discount")}</Grid>
                        <Grid item xs={2} sx={{textAlign: "right"}}>{t("common.priceUnit")}</Grid>
                        <Grid item xs={1} sx={{textAlign: "center"}}>{t("common.quantity")}</Grid>
                        <Grid item xs={3} sx={{textAlign: "right"}}>{t("cart.subtotal")}</Grid>
                    </Grid>

                    {/* Lines */}
                    {cart.cartItems.map((product, index) => {
                        const unitPrice = Number(product.puttc ?? product.prixbrut ?? 0);
                        const lineTotal = unitPrice * (product.cartQuantity || 0);
                        return (
                            <Box
                                key={`${product.reference}-${index}`}
                                sx={{
                                    mb: 0.5, px: 2, py: 2,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                                    transition: "background-color 0.15s",
                                    "&:hover": {backgroundColor: "#fafafa"},
                                }}
                            >
                                <Grid container alignItems="center">
                                    <Grid item xs={1}>
                                        <Box
                                            sx={{
                                                width: 56, height: 56,
                                                border: "1px solid rgba(0,0,0,0.08)",
                                                overflow: "hidden",
                                                backgroundColor: "#fafafa",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"}
                                                onError={(e) => { e.target.src = logoBd; }}
                                                alt={product.reference}
                                                style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4} sx={{pl: 2}}>
                                        <Box sx={{fontWeight: 600, fontSize: 14, letterSpacing: "0.02em"}}>
                                            {product.reference}
                                        </Box>
                                        <Box sx={{fontSize: 12, color: "text.secondary", mt: 0.5, lineHeight: 1.5}}>
                                            {product.designation || product.intitule}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1} sx={{textAlign: "center", fontSize: 13, color: product.remise1montant ? ACCENT : "rgba(0,0,0,0.3)", fontWeight: product.remise1montant ? 600 : 400}}>
                                        {product.remise1montant ? `−${product.remise1montant}%` : "—"}
                                    </Grid>
                                    <Grid item xs={2} sx={{textAlign: "right", fontSize: 13, color: "text.secondary"}}>
                                        {unitPrice.toFixed(2)} {currency}
                                    </Grid>
                                    <Grid item xs={1} sx={{textAlign: "center", fontSize: 14, fontWeight: 600}}>
                                        {product.cartQuantity}
                                    </Grid>
                                    <Grid item xs={3} sx={{textAlign: "right", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em"}}>
                                        {lineTotal.toFixed(2)} {currency}
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}

                    {/* Sticky total + submit — same look as the /distributor sticky CTA */}
                    <Box
                        sx={{
                            position: "sticky", bottom: 16,
                            zIndex: 10,
                            py: 2, px: 3,
                            mt: 4,
                            backgroundColor: "#fff",
                            border: "1px solid rgba(0,0,0,0.12)",
                            borderRadius: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            boxShadow: "0 -2px 16px rgba(0,0,0,0.04)",
                        }}
                    >
                        {(() => {
                            const lineCount = cart.cartItems.length;
                            const itemCount = cart.cartItems.reduce((s, p) => s + (p.cartQuantity || 0), 0);
                            return (
                                <Box>
                                    <Box sx={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "text.primary", lineHeight: 1.1}}>
                                        {Number(cart.cartTotalAmountCheckout || cart.cartTotalAmount || 0).toFixed(2)} {currency}
                                    </Box>
                                    {lineCount > 0 && (
                                        <Box sx={{fontSize: 11, color: "text.secondary", letterSpacing: "0.05em", mt: 0.5}}>
                                            {lineCount} {lineCount === 1 ? t("distributor.cart.line").toLowerCase() : t("distributor.cart.lines").toLowerCase()}
                                            {itemCount !== lineCount && ` · ${itemCount} ${t("common.quantity").toLowerCase()}`}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })()}

                        <Button
                            onClick={onSubmit}
                            disabled={submitting || !cart.cartItems.length || !selectedAddress}
                            endIcon={submitting
                                ? <CircularProgress size={14} sx={{color: "inherit"}}/>
                                : null}
                            sx={{
                                minWidth: 260,
                                py: 1.5, px: 3,
                                backgroundColor: "#000",
                                color: "#fff",
                                border: "2px solid #000",
                                borderRadius: 0,
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                boxShadow: "none",
                                transition: "all 0.3s ease-out",
                                "&:hover": {backgroundColor: "#fff", color: "#000", borderColor: "#000", boxShadow: "none"},
                                "&.Mui-disabled": {backgroundColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.3)", borderColor: "rgba(0,0,0,0.1)"},
                            }}
                        >
                            {t("distributor.checkout.submit")}
                        </Button>
                    </Box>
                </Grid>

                {/* Right column: sticky, filterable, scrollable address picker */}
                <Grid item lg={4} xs={12}>
                    <Box
                        sx={{
                            position: {lg: "sticky"},
                            top: {lg: 16},
                            maxHeight: {lg: "calc(100vh - 32px)"},
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2, flexShrink: 0}}>
                            <LocalShippingIcon color="primary"/>
                            <h3 style={{margin: 0}}>{t("distributor.checkout.address")}</h3>
                            <Chip
                                label={addresses.length}
                                size="small"
                                sx={{height: 20, fontSize: 11}}
                            />
                        </Stack>

                        {addrLoading && (
                            <Alert severity="info" icon={<CircularProgress size={18}/>}>
                                {t("common.loading")}
                            </Alert>
                        )}

                        {!addrLoading && addresses.length === 0 && (
                            <Alert severity="warning">{t("addresses.empty")}</Alert>
                        )}

                        {/* Filter input — only shown when worth it (5+ addresses) */}
                        {addresses.length >= 5 && (
                            <TextField
                                size="small"
                                placeholder={t("distributor.checkout.filterAddresses")}
                                value={addressFilter}
                                onChange={(e) => setAddressFilter(e.target.value)}
                                fullWidth
                                sx={{mb: 1.5, flexShrink: 0}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" sx={{color: "text.secondary"}}/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}

                        {/* Selected-but-filtered-out fallback */}
                        {selectedAddress && !filteredAddresses.some((a) => a.code === selectedCode) && (
                            <Alert severity="info" sx={{mb: 1, fontSize: 12}}>
                                {t("distributor.checkout.selectedHidden")}: <strong>{selectedAddress.code}</strong>
                            </Alert>
                        )}

                        {/* Scrollable list — caps the column height regardless of address count */}
                        <Box
                            sx={{
                                overflowY: "auto",
                                flex: 1,
                                pr: 0.5,
                                "&::-webkit-scrollbar": {width: 6},
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 3,
                                },
                            }}
                        >
                            <Stack spacing={1}>
                                {filteredAddresses.map((addr) => {
                                    const selected = addr.code === selectedCode;
                                    return (
                                        <Paper
                                            key={addr.code}
                                            elevation={0}
                                            onClick={() => setSelectedCode(addr.code)}
                                            sx={{
                                                p: 1.5,
                                                cursor: "pointer",
                                                border: "2px solid",
                                                borderColor: selected ? "primary.main" : "rgba(0,0,0,0.12)",
                                                backgroundColor: selected ? "rgba(25, 118, 210, 0.04)" : "#fff",
                                                transition: "all 0.12s",
                                                "&:hover": {
                                                    borderColor: selected ? "primary.main" : "rgba(0,0,0,0.3)",
                                                    backgroundColor: selected ? "rgba(25, 118, 210, 0.06)" : "rgba(0,0,0,0.02)",
                                                },
                                            }}
                                        >
                                            <Stack direction="row" alignItems="flex-start" spacing={1}>
                                                {selected
                                                    ? <CheckCircleIcon color="primary" sx={{mt: 0.2, flexShrink: 0}}/>
                                                    : <RadioButtonUncheckedIcon sx={{mt: 0.2, color: "text.disabled", flexShrink: 0}}/>}
                                                <Box sx={{flex: 1, minWidth: 0}}>
                                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, flexWrap: "wrap"}}>
                                                        <Box sx={{fontWeight: 600, fontSize: 13, mr: 0.5}}>
                                                            {addr.intitule || addr.code}
                                                        </Box>
                                                        <Chip label={addr.code} size="small" sx={{height: 16, fontSize: 10}}/>
                                                        {addr.principale === "Oui" && (
                                                            <Chip
                                                                label={t("addresses.primary")}
                                                                size="small" color="primary" variant="outlined"
                                                                sx={{height: 16, fontSize: 10}}
                                                            />
                                                        )}
                                                    </Stack>
                                                    <Box sx={{fontSize: 12, color: "text.secondary", lineHeight: 1.4}}>
                                                        {addr.adresse1}
                                                        {addr.adresse2 && <>, {addr.adresse2}</>}
                                                        <br/>
                                                        {[addr.codepostal, addr.ville].filter(Boolean).join(" ")}, {addr.pays}
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    );
                                })}

                                {addressFilter && filteredAddresses.length === 0 && (
                                    <Box sx={{p: 2, fontSize: 13, color: "text.secondary", textAlign: "center"}}>
                                        {t("catalogue.noResults")}
                                    </Box>
                                )}
                            </Stack>
                        </Box>

                        {!selectedAddress && addresses.length > 0 && (
                            <Alert severity="info" sx={{mt: 1.5, flexShrink: 0, fontSize: 13}}>
                                {t("distributor.checkout.addressMissing")}
                            </Alert>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DistributorCheckout;
