import React from "react";
import {addLotLda} from "../cartSlice";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {Grid, IconButton, Tooltip} from "@mui/material";
import LotSelectorLda from "./LotSelectorLda";
import CloseIcon from "@mui/icons-material/Close";

const CartQuantityHandlerLdaEmpty = ({cart, product, lot, index, handleRemoveRow}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const handleSelectLot = (product, e) => {
        const selected = e.target.value;
        if (product.lot.find((l) => l.numero === e.target.value)) {
            return toast.error(t("ldaCart.lotAlreadyAdded"));
        }
        if (selected) {
            handleRemoveRow();
            dispatch(addLotLda({product, numero: e.target.value}));
        }
    };

    return (
        <Grid container direction="row" alignItems="center" sx={{py: 0.5}} key={index}>
            <Grid item xs={3}>
                <LotSelectorLda handleSelectLot={handleSelectLot} product={product} lot={lot}/>
            </Grid>
            <Grid item xs={8}/>
            <Grid item xs={1} sx={{textAlign: "center"}}>
                {!cart.isLoadingQuantity && (
                    <Tooltip title={t("ldaCart.removeRow")}>
                        <IconButton
                            size="small"
                            onClick={handleRemoveRow}
                            sx={{color: "rgba(0,0,0,0.3)", "&:hover": {color: "error.main", backgroundColor: "transparent"}}}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                )}
            </Grid>
        </Grid>
    );
};
export default CartQuantityHandlerLdaEmpty;

