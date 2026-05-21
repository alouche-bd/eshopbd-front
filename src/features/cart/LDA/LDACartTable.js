import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {Box, Button, Grid, Stack, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {cartSelector} from "../cartSlice";
import {authSelector} from "../../auth/authSlice";
import CartRowEmpty from "./CartRowEmpty";
import CartRowFull from "./CartRowFull";

/**
 * LDA cart table — luxury monochrome aesthetic.
 *
 * Functional contract is unchanged from the original implementation:
 *   - Top header lists columns (Produit / Lot / Qté / Stock / Com. / Suppr.)
 *   - Filled product rows render via CartRowFull
 *   - N empty rows below contain inline product search (CartRowEmpty)
 *   - "Ajouter une ligne" appends another empty row
 *   - "Étape suivante" validates lots and routes to /lab-cart/recap/{idsf}/{company}
 */
const LDACartTable = ({products, total, idsf, company}) => {
    const {push} = useHistory();
    const {t} = useTranslation();
    const {isAuth} = useSelector(authSelector);
    const {cartItems} = useSelector(cartSelector);

    const microLabelSx = {
        fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
    };

    const handleSubmitCart = () => {
        if (!cartItems.length) {
            return toast.error(t("ldaCart.pleaseSelectProduct"));
        }
        for (const item of cartItems) {
            if (!item.lot.length) {
                return toast.error(t("ldaCart.pleaseSelectLot", {ref: item.reference}));
            }
            if (!isAuth) {
                push("/login");
            } else {
                push("/lab-cart/recap/" + idsf + "/" + company);
            }
        }
    };

    const initNbEmptyRows = products.length > 7 ? 0 : 7 - products.length;
    const [nbEmptyRows, setNbEmptyRows] = useState(initNbEmptyRows);

    useEffect(() => {
        if (nbEmptyRows > 0) {
            setNbEmptyRows(products.length > 7 ? 0 : 7 - products.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePushLine = () => setNbEmptyRows(nbEmptyRows + 1);

    const emptyRows = [];
    for (let i = 0; i < nbEmptyRows; i++) {
        emptyRows.push(<CartRowEmpty key={i}/>);
    }

    const hasItems = products.length > 0;

    return (
        <Box>
            <Grid container direction="row" alignItems="flex-start" spacing={3}>
                {/* Left: rows */}
                <Grid item xs={12} lg={10}>
                    {/* Column header — only when there are items */}
                    {hasItems && (
                        <Grid
                            container alignItems="center"
                            sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}
                        >
                            <Grid item xs={4}>{t("ldaCart.columns.product")}</Grid>
                            <Grid item xs={2} sx={{textAlign: "center"}}>{t("ldaCart.columns.lot")}</Grid>
                            <Grid item xs={1} sx={{textAlign: "center"}}>{t("ldaCart.columns.quantity")}</Grid>
                            <Grid item xs={1} sx={{textAlign: "center"}}>{t("ldaCart.columns.stock")}</Grid>
                            <Grid item xs={3} sx={{textAlign: "center"}}>{t("ldaCart.columns.comment")}</Grid>
                            <Grid item xs={1} sx={{textAlign: "center"}}>{t("ldaCart.columns.remove")}</Grid>
                        </Grid>
                    )}

                    {/* Filled rows */}
                    {products.length > 0 && products.map((product, index) => (
                        <CartRowFull product={product} key={index}/>
                    ))}

                    {/* Empty rows (each = inline product search) */}
                    <Box sx={{mt: hasItems ? 4 : 0}}>
                        {hasItems && (
                            <Box sx={{...microLabelSx, mb: 1.5}}>
                                {t("ldaCart.addMoreReferences")}
                            </Box>
                        )}
                        {emptyRows}
                    </Box>

                    {/* Add-another-line link */}
                    <Box sx={{mt: 1, mb: 4}}>
                        <Button
                            size="small"
                            onClick={handlePushLine}
                            startIcon={<AddIcon sx={{fontSize: 14}}/>}
                            sx={{
                                textTransform: "uppercase",
                                fontSize: 11, letterSpacing: "0.1em", fontWeight: 500,
                                color: "text.secondary",
                                "&:hover": {color: "text.primary", backgroundColor: "transparent"},
                            }}
                        >
                            {t("ldaCart.addLine")}
                        </Button>
                    </Box>
                </Grid>

                {/* Right: client card */}
                <Grid item xs={12} lg={2}>
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={microLabelSx}>{t("ldaCart.client")}</Box>
                        <Box sx={{mt: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.4}}>
                            {company}
                        </Box>
                        <Box sx={{mt: 0.5, fontSize: 11, color: "text.disabled", letterSpacing: "0.02em"}}>
                            {idsf}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Sticky bottom CTA — same pattern as /distributor */}
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
                {/* LDA flow doesn't track unit prices on the cart — show line count only. */}
                <Box>
                    <Box sx={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "text.primary", lineHeight: 1.1}}>
                        {products.length}
                    </Box>
                    <Box sx={{fontSize: 11, color: "text.secondary", letterSpacing: "0.05em", mt: 0.5, textTransform: "uppercase"}}>
                        {t("ldaCart.product", {count: products.length})}
                    </Box>
                </Box>

                <Tooltip title={!hasItems ? t("ldaCart.emptyCart") : ""} placement="top">
                    <span>
                        <Button
                            onClick={handleSubmitCart}
                            disabled={!hasItems}
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
                            {t("ldaCart.next")}
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default LDACartTable;
