import React, {useState} from "react";
import {
    addCommentLda,
    decreaseQuantityLda,
    increaseQuantityLda,
    removeFromCartLda,
    updateQuantityLda,
} from "../cartSlice";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {Box, Grid, IconButton, Stack, Tooltip} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

const ACCENT = "#1BA9AA";

const CartQuantityHandlerLda = ({cart, product, lot, p, index}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const checkStock = (v) => lot.find((l) => l.name === v)

    const [quantity, setQuantity] = useState(p?.quantity ?? 0);
    const [selectedLot, setSelectedLot] = useState(p?.numero ?? "");
    const [selectedStock, setSelectedStock] = useState(p?.numero ? checkStock(p.numero).availableQuantity : "");
    const [comment, setComment] = useState(p?.comment ?? "")
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCartLda(product));
    };

    const handleSetComment = (e) => {
        setComment(e.target.value)
        dispatch(addCommentLda({product: product, lot: selectedLot, comment: comment}))
    }
    const handleDecreaseQuantity = (product) => {
        if (!selectedLot || selectedLot === "") {
            return toast.error(t("ldaCart.pleaseSelectLotShort"));
        }
        if (quantity > 1) {
            const newQuantity = parseInt(quantity) - 1;
            setQuantity(newQuantity);
            dispatch(decreaseQuantityLda({product: product, lot: selectedLot}));
        }
    };
    const handleIncreaseQuantity = (product) => {
        if (!selectedLot || selectedLot === "") {
            return toast.error(t("ldaCart.pleaseSelectLotShort"));
        }
        const lotExist = product.lot.find(
            (item) => item.numero === selectedLot
        );
        if (lotExist.quantity + 1 <= selectedStock) {
            const newQuantity = parseInt(quantity) + 1;
            setQuantity(newQuantity);
            dispatch(increaseQuantityLda({product: product, lot: selectedLot}));
        } else {
            return toast.error(t("ldaCart.lotNotEnoughStock"));
        }
    };

    const handleInputChange = (quantity) => {
        setQuantity(quantity);
    };

    const handleQuantityChange = (product, quantity) => {
        if (isNaN(quantity) || !quantity.length) {
            return toast.error(t("ldaCart.invalidQuantity"));
        }
        if (!selectedLot || selectedLot === "") {
            return toast.error(t("ldaCart.pleaseSelectLotShort"));
        }
        if (quantity <= selectedStock) {
            console.log(quantity)
            const updatedProduct = {
                ...product,
                lot: {
                    quantity: parseInt(quantity),
                    numero: selectedLot
                },
            };
            dispatch(updateQuantityLda(updatedProduct));
        } else {
            return toast.error(t("ldaCart.lotNotEnoughStock"));
        }
    };

    const inputBaseSx = {
        width: "100%",
        minHeight: 32,
        px: 1,
        py: 0.5,
        border: "1px solid rgba(0,0,0,0.12)",
        outline: "none",
        fontSize: 13,
        fontFamily: "inherit",
        background: "#fff",
        "&:focus": {borderColor: ACCENT},
    };

    return (
        <Grid container direction="row" alignItems="center" sx={{py: 0.5}} key={index}>
            <Grid item xs={3} sx={{fontSize: 13, fontFamily: "monospace", color: "text.secondary", pr: 1}}>
                {p.numero}
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <IconButton
                        size="small"
                        onClick={() => handleDecreaseQuantity(product)}
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
                        value={quantity}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyUp={(e) => handleQuantityChange(product, e.target.value)}
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
                        onClick={() => handleIncreaseQuantity(product)}
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
            <Grid item xs={1} sx={{textAlign: "center", fontSize: 13, color: "text.secondary"}}>
                {selectedStock}
            </Grid>
            <Grid item xs={5} sx={{pl: 1.5}}>
                <Box component="input" value={comment} onChange={handleSetComment} placeholder={t("ldaCart.commentPlaceholder")} sx={inputBaseSx}/>
            </Grid>
            <Grid item xs={1} sx={{textAlign: "center"}}>
                {!cart.isLoadingQuantity && (
                    <Tooltip title={t("ldaCart.removeLot")}>
                        <IconButton
                            size="small"
                            onClick={() => handleRemoveFromCart({product: product, lot: p.numero})}
                            sx={{color: "rgba(0,0,0,0.3)", "&:hover": {color: "error.main", backgroundColor: "transparent"}}}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                )}
            </Grid>
        </Grid>
    );
};
export default CartQuantityHandlerLda;
