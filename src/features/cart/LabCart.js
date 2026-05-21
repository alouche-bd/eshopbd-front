import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import CartTable from "./CartTable";
import {cartSelector, getTotals} from "./cartSlice";
import {Container} from "@mui/material";
import styles from "./cart.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const LabCart = () => {
    const cart = useSelector(cartSelector);

    const {push} = useHistory();

    const dispatch = useDispatch();

    const {idsf} = useParams();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    return (
        <Container maxWidth="xl">
            {!cart.cartItems.length ? (
                <>
                    <div className={styles.goBack} onClick={() => push("/")}>
                        <ArrowBackIosNewIcon/> Parcourir notre catalogue
                    </div>
                    <h2 className={styles.title}>Votre panier est vide</h2>
                </>
            ) : (
                <>
                    <CartTable products={cart.cartItems} total={cart.cartTotalAmount}/>
                </>
            )}
        </Container>
    );
};

export default LabCart;
