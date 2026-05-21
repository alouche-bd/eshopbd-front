import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import CartTable from "./CartTable";
import {cartSelector, getTotals} from "./cartSlice";
import {Container} from "@mui/material";
import styles from "./cart.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Cart = () => {
    const cart = useSelector(cartSelector);
    const {push} = useHistory();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    return (
        <Container maxWidth="xl">
            {!cart.cartItems.length ? (
                <>
                    <div className={styles.goBack} onClick={() => push("/")}>
                        <ArrowBackIosNewIcon/> {t("cart.browseCatalog")}
                    </div>
                    <h2 className={styles.title}>{t("cart.empty")}</h2>
                </>
            ) : (
                <CartTable products={cart.cartItems} total={cart.cartTotalAmount}/>
            )}
        </Container>
    );
};

export default Cart;
