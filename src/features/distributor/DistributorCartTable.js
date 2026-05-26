import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {Grid, IconButton, CircularProgress, Box, Button, Stack, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {removeFromCart, updateQuantity} from "../cart/cartSlice";
import {authSelector} from "../auth/authSlice";
import {usePostGetRepartitionMutation} from "../../app/services/x3Api";
import {BASE_BDD, PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";
import DistributorCartRowEmpty from "./DistributorCartRowEmpty";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";

const ACCENT = "#1BA9AA";

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
 * Cart rows + sticky CTA, luxury black/white aesthetic with #1BA9AA accent.
 *
 * Design constraints:
 *   - No coloured tints anywhere except the very light teal on the sticky bar
 *   - Hairline borders only
 *   - Uppercase letter-spaced micro-labels
 *   - Generous vertical rhythm
 *   - Numbers in tabular weight 600 for scan-ability
 */
const DistributorCartTable = ({products, total}) => {
    const dispatch = useDispatch();
    const {push} = useHistory();
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const initNbEmptyRows = products.length > 5 ? 1 : 5 - products.length;
    const [nbEmptyRows, setNbEmptyRows] = useState(initNbEmptyRows);

    useEffect(() => {
        if (products.length === 0 && nbEmptyRows < 5) setNbEmptyRows(5);
        if (nbEmptyRows < 1) setNbEmptyRows(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products.length]);

    const onQtyChange = (product, qty) => {
        const next = Math.max(1, parseInt(qty, 10) || 1);
        dispatch(updateQuantity({...product, cartQuantity: next}));
    };

    const [triggerRepartition, {isLoading: isRepartitioning}] = usePostGetRepartitionMutation();

    const codeclient = user?.sage_client_code || user?.codeclientGC;

    // Live pricing: re-fetch the real repartition prices whenever the cart
    // contents change (item added/removed or quantity edited). The fulfilled
    // response is folded back into each cart item by the cartSlice matcher
    // (puttc = prix * (1 - remise/100)), so the prices and total rendered below
    // are the client's real prices — not indicative ones.
    const cartSignature = products
        .map((p) => `${p.reference}:${p.cartQuantity}`)
        .join("|");

    useEffect(() => {
        if (!products.length || !codeclient) return;
        const payload = {
            nomBaseSAGE: BASE_BDD,
            codeclient,
            articles: {
                article: products.map((item, index) => ({
                    code: item.reference, quantite: item.cartQuantity, index,
                })),
            },
        };
        // Debounce so rapid +/- clicks or typing in the qty field fire once.
        const timer = setTimeout(() => { triggerRepartition(payload); }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartSignature, codeclient]);

    const handleAddLine = () => setNbEmptyRows(nbEmptyRows + 1);

    const handleValidateAndPrice = async () => {
        if (!products.length) {
            toast.error(t("validation.cartEmpty"));
            return;
        }
        const payload = {
            nomBaseSAGE: BASE_BDD,
            codeclient,
            articles: {
                article: products.map((item, index) => ({
                    code: item.reference, quantite: item.cartQuantity, index,
                })),
            },
        };
        try {
            const response = await triggerRepartition(payload).unwrap();
            if (response?.success === 1) push("/distributor/checkout");
            else toast.error(t("common.serverError"));
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        }
    };

    const itemCount = products.reduce((sum, p) => sum + (p.cartQuantity || 0), 0);
    const hasItems  = products.length > 0;
    const cur       = currencySymbol(user?.currency);

    const microLabelSx = {
        fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
    };

    const emptyRows = [];
    for (let i = 0; i < nbEmptyRows; i++) {
        emptyRows.push(<DistributorCartRowEmpty key={`empty-${i}`}/>);
    }

    return (
        <Box>
            {/* Column header — only when there's content */}
            {hasItems && (
                <Grid
                    container alignItems="center"
                    sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}
                >
                    <Grid item xs={1}/>
                    <Grid item xs={4}>{t("common.designation")}</Grid>
                    <Grid item xs={2} sx={{textAlign: "center"}}>{t("common.quantity")}</Grid>
                    <Grid item xs={2} sx={{textAlign: "right"}}>{t("common.priceUnit")}</Grid>
                    <Grid item xs={2} sx={{textAlign: "right"}}>{t("cart.subtotal")}</Grid>
                    <Grid item xs={1}/>
                </Grid>
            )}

            {/* Filled rows */}
            {products.map((product, index) => {
                const unitPrice = product.puttc ?? product.prixbrut ?? 0;
                const lineTotal = unitPrice * (product.cartQuantity || 0);
                return (
                    <Box
                        key={`row-${product.reference}-${index}`}
                        sx={{
                            mb: 0.5,
                            px: 2, py: 2,
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
                            <Grid item xs={2} sx={{textAlign: "center"}}>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onQtyChange(product, (product.cartQuantity || 1) - 1)}
                                        disabled={(product.cartQuantity || 1) <= 1}
                                        aria-label={`Decrease ${product.reference}`}
                                        sx={{
                                            width: 32, height: 32, borderRadius: 0,
                                            border: "1px solid rgba(0,0,0,0.12)",
                                            "&:hover": {borderColor: "#000", backgroundColor: "transparent"},
                                            "&.Mui-disabled": {borderColor: "rgba(0,0,0,0.06)"},
                                        }}
                                    >
                                        <RemoveIcon sx={{fontSize: 14}}/>
                                    </IconButton>
                                    <Box
                                        component="input"
                                        type="number"
                                        value={product.cartQuantity}
                                        onChange={(e) => onQtyChange(product, e.target.value)}
                                        aria-label={`Quantity for ${product.reference}`}
                                        sx={{
                                            width: 40, height: 32,
                                            border: "1px solid rgba(0,0,0,0.12)",
                                            borderLeft: "none", borderRight: "none",
                                            textAlign: "center",
                                            fontSize: 14, fontWeight: 600,
                                            fontFamily: "inherit",
                                            outline: "none",
                                            "&:focus": {borderColor: ACCENT, borderLeftColor: ACCENT, borderRightColor: ACCENT},
                                            "-moz-appearance": "textfield",
                                            "&::-webkit-outer-spin-button": {WebkitAppearance: "none", margin: 0},
                                            "&::-webkit-inner-spin-button": {WebkitAppearance: "none", margin: 0},
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => onQtyChange(product, (product.cartQuantity || 1) + 1)}
                                        aria-label={`Increase ${product.reference}`}
                                        sx={{
                                            width: 32, height: 32, borderRadius: 0,
                                            border: "1px solid rgba(0,0,0,0.12)",
                                            "&:hover": {borderColor: "#000", backgroundColor: "transparent"},
                                        }}
                                    >
                                        <AddIcon sx={{fontSize: 14}}/>
                                    </IconButton>
                                </Stack>
                            </Grid>
                            <Grid item xs={2} sx={{textAlign: "right", fontSize: 13, color: "text.secondary"}}>
                                {unitPrice
                                    ? `${Number(unitPrice).toFixed(2)} ${cur}`
                                    : isRepartitioning
                                        ? <CircularProgress size={12} sx={{color: "rgba(0,0,0,0.3)"}}/>
                                        : "—"}
                            </Grid>
                            <Grid item xs={2} sx={{textAlign: "right", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "text.primary"}}>
                                {unitPrice
                                    ? `${lineTotal.toFixed(2)} ${cur}`
                                    : isRepartitioning
                                        ? <CircularProgress size={14} sx={{color: "rgba(0,0,0,0.3)"}}/>
                                        : "—"}
                            </Grid>
                            <Grid item xs={1} sx={{textAlign: "right"}}>
                                <Tooltip title={t("cart.remove")}>
                                    <IconButton
                                        size="small"
                                        onClick={() => dispatch(removeFromCart(product))}
                                        aria-label={`${t("cart.remove")} ${product.reference}`}
                                        sx={{
                                            color: "rgba(0,0,0,0.3)",
                                            "&:hover": {color: "error.main", backgroundColor: "transparent"},
                                        }}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Box>
                );
            })}

            {/* Empty rows */}
            <Box sx={{mt: hasItems ? 4 : 0}}>
                {hasItems && (
                    <Box sx={{...microLabelSx, mb: 1.5}}>
                        {t("distributor.cart.addMore")}
                    </Box>
                )}
                {emptyRows}
            </Box>

            {/* Add-another-line link */}
            <Box sx={{mt: 1, mb: 4}}>
                <Button
                    size="small"
                    onClick={handleAddLine}
                    startIcon={<AddIcon sx={{fontSize: 14}}/>}
                    sx={{
                        textTransform: "uppercase",
                        fontSize: 11, letterSpacing: "0.1em", fontWeight: 500,
                        color: "text.secondary",
                        "&:hover": {color: "text.primary", backgroundColor: "transparent"},
                    }}
                >
                    {t("distributor.cart.addLine")}
                </Button>
            </Box>

            {/* Sticky bottom CTA — clean, only total + CTA */}
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
                <Box>
                    <Box sx={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "text.primary", lineHeight: 1.1}}>
                        {Number(total || 0).toFixed(2)} {cur}
                    </Box>
                    {hasItems && (
                        <Box sx={{fontSize: 11, color: "text.secondary", letterSpacing: "0.05em", mt: 0.5}}>
                            {products.length} {products.length === 1 ? t("distributor.cart.line").toLowerCase() : t("distributor.cart.lines").toLowerCase()}
                            {itemCount !== products.length && ` · ${itemCount} ${t("common.quantity").toLowerCase()}`}
                        </Box>
                    )}
                </Box>

                <Tooltip title={!hasItems ? t("validation.cartEmpty") : ""} placement="top">
                    <span>
                        <Button
                            onClick={handleValidateAndPrice}
                            disabled={!hasItems || isRepartitioning}
                            endIcon={isRepartitioning
                                ? <CircularProgress size={14} sx={{color: "inherit"}}/>
                                : <ArrowForwardIcon sx={{fontSize: 16}}/>}
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
                            {t("distributor.cart.validateAndPrice")}
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default DistributorCartTable;
