import React, {useEffect, useState} from "react";
import {Box, Button, Container, Grid, Stack, Tooltip} from "@mui/material";
import {cartSelector, clearCart, getTotals} from "../../cart/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useHistory, useParams} from "react-router";
import {useGetAllAddressesQuery, usePostOrderLdaMutation} from "../../../app/services/x3Api";
import {authSelector} from "../../auth/authSlice";
import toast from "react-hot-toast";
import Spinner from "../../../common/components/spinner/Spinner";
import {usePostOrderMutation} from "../../../app/services/lumenApi";
import {PRODUCT_IMG_BASE} from "../../../common/utils/apiConstants";

/**
 * LDA order recap (checkout) — luxury monochrome aesthetic.
 *
 * Functional behavior unchanged:
 *   - Fetches the client's addresses, picks the "FAC" one as shipping target
 *   - On submit: postOrderLda (X3) → postOrder (Lumen) → cart clear + redirect
 */
const RecapLda = () => {
    const dispatch = useDispatch();
    const cart = useSelector(cartSelector);
    const {push} = useHistory();
    const {user} = useSelector(authSelector);
    const {idsf, company} = useParams();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const [triggerOrder]     = usePostOrderLdaMutation();
    const [triggerPostLumen] = usePostOrderMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {data} = useGetAllAddressesQuery(idsf);
    const selectedShippingAddress = data?.adresseslivraison.adresselivraison.find(
        (address) => address.numero === "FAC"
    );

    const makeid = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const cartToSend = {
        id: makeid(80),
        clientCode: idsf,
        suuid: "",
        customerCompanyName: company,
        zipCode: selectedShippingAddress?.codepostal,
        deliveryAddressCode: selectedShippingAddress?.numero,
        cart: cart.cartItems.flatMap((item) =>
            item.lot.map((lot) => ({
                product: item.reference, quantity: lot.quantity, comment: lot.comment, lot: lot.numero,
            }))
        ),
        smileyAmount: "0",
    };

    const cartToSendLumen = {
        finalClientCode: idsf,
        finalClient: company,
        shippingAddress: selectedShippingAddress
            ? `${selectedShippingAddress.libelle} ${selectedShippingAddress.adresse} ${selectedShippingAddress.codepostal} ${selectedShippingAddress.ville}`
            : "",
        products: cart.cartItems.flatMap((item) =>
            item.lot.map((lot) => ({
                reference: item.reference, cartQuantity: lot.quantity, comment: lot.comment, lot: lot.numero,
            }))
        ),
    };

    const handleSubmitCart = async () => {
        setIsSubmitting(true);
        triggerOrder(cartToSend)
            .unwrap()
            .then((response) => {
                if (response.success === 1) {
                    triggerPostLumen(cartToSendLumen)
                        .unwrap()
                        .then(() => {
                            push('/profile/clients');
                            dispatch(clearCart());
                            return toast.success('Commande enregistrée');
                        });
                } else {
                    setIsSubmitting(false);
                    toast.error("Quelque chose s'est mal passé.");
                }
            });
    };

    if (isSubmitting) return <Spinner/>;

    const microLabelSx = {
        fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
    };

    const totalLines = cart.cartItems.length;
    const totalQty = cart.cartItems.reduce(
        (sum, item) => sum + item.lot.reduce((s, l) => s + (l.quantity || 0), 0),
        0,
    );
    const hasItems = totalLines > 0;

    return (
        <Container maxWidth="xl" sx={{pt: 0, pb: {xs: 4, md: 6}}}>
            {/* Back link */}
            <Box
                onClick={() => push("/lab-cart/" + idsf + "/" + company)}
                sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    mt: 3, mb: 4, cursor: "pointer",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.15em",
                    color: "rgba(0,0,0,0.5)", textTransform: "uppercase",
                    "&:hover": {color: "text.primary"},
                }}
            >
                <ArrowBackIosNewIcon sx={{fontSize: 12}}/> Modifier mon panier
            </Box>

            {/* Refined header */}
            <Box sx={{mb: {xs: 4, md: 5}, pb: 3, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)"}}>
                <Box sx={{...microLabelSx, mb: 1.5}}>Récapitulatif de la commande</Box>
                <Box
                    component="h1"
                    sx={{
                        m: 0, fontSize: {xs: 18, md: 22}, fontWeight: 500,
                        letterSpacing: "-0.005em", color: "text.primary", lineHeight: 1.3,
                    }}
                >
                    {company}
                </Box>
            </Box>

            <Grid container spacing={3} alignItems="flex-start">
                {/* Left: product recap */}
                <Grid item lg={9} xs={12}>
                    {/* Column header */}
                    {hasItems && (
                        <Grid
                            container alignItems="center"
                            sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}
                        >
                            <Grid item xs={1}/>
                            <Grid item xs={5}>Produit</Grid>
                            <Grid item xs={4}>Lot</Grid>
                            <Grid item xs={2} sx={{textAlign: "center"}}>Qté</Grid>
                        </Grid>
                    )}

                    {/* Lines */}
                    {cart.cartItems.map((product, index) => (
                        <Box
                            key={`${product.reference}-${index}`}
                            sx={{
                                mb: 0.5, px: 2, py: 2,
                                backgroundColor: "#fff",
                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                            }}
                        >
                            <Grid container alignItems="flex-start">
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
                                <Grid item xs={5} sx={{pl: 2}}>
                                    <Box sx={{fontWeight: 600, fontSize: 14, letterSpacing: "0.02em"}}>
                                        {product.reference}
                                    </Box>
                                    <Box sx={{fontSize: 12, color: "text.secondary", mt: 0.5, lineHeight: 1.5}}>
                                        {product.reference === '31_322_231_01-2G'
                                            ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                            : product.reference === '31_323_232_01-2G'
                                                ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                                : product.designation}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={0.5}>
                                        {product.lot.map((l, li) => (
                                            <Grid container key={li} alignItems="center" sx={{py: 0.5, borderBottom: li < product.lot.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none"}}>
                                                <Grid item xs={8} sx={{fontSize: 13, fontFamily: "monospace", color: "text.secondary"}}>
                                                    {l.numero}
                                                </Grid>
                                                <Grid item xs={4} sx={{textAlign: "center", fontWeight: 600, fontSize: 14}}>
                                                    {l.quantity}
                                                </Grid>
                                                {l.comment && (
                                                    <Grid item xs={12} sx={{mt: 0.5, fontSize: 11, color: "text.secondary", fontStyle: "italic"}}>
                                                        {l.comment}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Grid>

                {/* Right: client card — delivery address intentionally NOT shown
                    here (lab flow doesn't surface it on this page). */}
                <Grid item lg={3} xs={12}>
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={microLabelSx}>Client</Box>
                        <Box sx={{mt: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.4}}>
                            {company}
                        </Box>
                        <Box sx={{mt: 0.5, fontSize: 11, color: "text.disabled", letterSpacing: "0.02em"}}>
                            {idsf}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Sticky bottom CTA — identical to /distributor and /lab-cart */}
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
                {/* LDA flow doesn't track unit prices — show product + lot counts only. */}
                <Box>
                    <Box sx={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "text.primary", lineHeight: 1.1}}>
                        {totalLines}
                    </Box>
                    <Box sx={{fontSize: 11, color: "text.secondary", letterSpacing: "0.05em", mt: 0.5, textTransform: "uppercase"}}>
                        {totalLines === 1 ? "produit" : "produits"}
                        {totalQty > 0 && ` · ${totalQty} ${totalQty === 1 ? "unité" : "unités"}`}
                    </Box>
                </Box>

                <Tooltip title={!hasItems ? "Votre panier est vide" : ""} placement="top">
                    <span>
                        <Button
                            onClick={handleSubmitCart}
                            disabled={!hasItems || isSubmitting}
                            endIcon={<ArrowForwardIcon sx={{fontSize: 16}}/>}
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
                            Passer commande
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Container>
    );
};

export default RecapLda;
