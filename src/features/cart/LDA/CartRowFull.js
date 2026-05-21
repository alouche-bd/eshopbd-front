import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import {Grid, Box, IconButton, Tooltip, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {cartSelector, removeFromCart} from "../cartSlice";
import {useGetStockLDAQuery} from "../../../app/services/x3Api";
import CartQuantityHandlerLda from "./CartQuantityHandlerLda";
import CartQuantityHandlerLdaEmpty from "./CartQuantityHandlerLdaEmpty";
import CloseIcon from "@mui/icons-material/Close";
import {PRODUCT_IMG_BASE} from "../../../common/utils/apiConstants";
/* ------------------------------------------------------------------------- */


const CartRowFull = ({product, index}) => {
    const {t} = useTranslation();
    const cart = useSelector(cartSelector);
    const {data} = useGetStockLDAQuery(product.reference);

    const [nbEmptyRows, setNbEmptyRows] = useState(1);
    const handleRemoveRow = () => {
        setNbEmptyRows(nbEmptyRows - 1);
    };

    const displayEmptyRow = () => {
        const emptyRows = [];
        for (let i = 0; i < nbEmptyRows; i++) {
            emptyRows.push(
                <CartQuantityHandlerLdaEmpty
                    handleRemoveRow={handleRemoveRow}
                    index={i}
                    product={product}
                    lot={data.batches.batch}
                    cart={cart}
                />
            );
        }
        return emptyRows;
    };

    const handlePushLine = () => {
        setNbEmptyRows(nbEmptyRows + 1);
    };

    const displayFullRow = () => {

        return product?.lot?.map((p, index) => (
            <CartQuantityHandlerLda
                index={index}
                product={product}
                p={p}
                lot={data.batches.batch}
                cart={cart}
            />
        ));
    };

    const dispatch = useDispatch()

    const handleRemoveProduct = () => {
        dispatch(removeFromCart(product))
    }

    if (!data) return null;

    return (
        <Box
            sx={{
                mb: 0.5, px: 2, py: 2,
                backgroundColor: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                transition: "background-color 0.15s",
                "&:hover": {backgroundColor: "#fafafa"},
            }}
        >
            <Grid container direction="row" alignItems="flex-start">
                {/* Image */}
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

                {/* Reference + designation + catalogue tags */}
                <Grid item xs={3} sx={{pl: 2}}>
                    <Box sx={{fontWeight: 600, fontSize: 14, letterSpacing: "0.02em"}}>
                        {product.reference}
                    </Box>
                    <Box sx={{fontSize: 12, color: "text.secondary", mt: 0.5, lineHeight: 1.5}}>
                        {product.designation}
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{mt: 1, flexWrap: "wrap"}}>
                        {[product.catalogueniv1, product.catalogueniv2, product.catalogueniv3]
                            .filter((v, i, arr) => v && (i === 0 || v !== arr[i - 1]))
                            .map((tag, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        px: 1, py: 0.25,
                                        fontSize: 10,
                                        letterSpacing: "0.05em",
                                        color: "text.secondary",
                                        border: "1px solid rgba(0,0,0,0.08)",
                                    }}
                                >
                                    {tag}
                                </Box>
                            ))}
                    </Stack>
                </Grid>

                {/* Lot rows + empty lot rows + add-lot button */}
                <Grid item xs={8}>
                    <Box sx={{px: 1}}>
                        {displayFullRow()}
                        {displayEmptyRow()}

                        {/* Remove-product button — only when no lots remain */}
                        {!product?.lot?.length && nbEmptyRows === 0 && (
                            <Box sx={{textAlign: "right", mt: 1}}>
                                <Tooltip title={t("ldaCart.removeProduct")}>
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveProduct}
                                        sx={{
                                            color: "rgba(0,0,0,0.3)",
                                            "&:hover": {color: "error.main", backgroundColor: "transparent"},
                                        }}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}

                        {/* Add-lot link */}
                        <Box sx={{mt: 1.5}}>
                            <Box
                                component="button"
                                onClick={handlePushLine}
                                sx={{
                                    display: "inline-flex", alignItems: "center", gap: 0.5,
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "text.secondary",
                                    p: 0.5,
                                    "&:hover": {color: "text.primary"},
                                }}
                            >
                                <AddIcon sx={{fontSize: 14}}/> {t("ldaCart.addLot")}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CartRowFull;
