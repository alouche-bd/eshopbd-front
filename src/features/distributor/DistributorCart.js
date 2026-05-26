import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import {Container, Box} from "@mui/material";
import {cartSelector, getTotals} from "../cart/cartSlice";
import {authSelector} from "../auth/authSlice";
import {isDistributor} from "../../common/constants/userTypes";
import DistributorCartTable from "./DistributorCartTable";

/**
 * Distributor ordering page — luxury monochrome aesthetic.
 *
 * Design vocabulary (shared with DistributorCheckout + sub-components):
 *   - Black on white dominant
 *   - Hairline borders (1px, ~8% opacity black)
 *   - #1BA9AA accent reserved for: selected states + primary CTA hover
 *   - Refined typography: uppercase letter-spaced micro-labels, bold prices
 *   - Generous whitespace, no busy backgrounds
 */
const DistributorCart = () => {
    const {push} = useHistory();
    const dispatch = useDispatch();
    const cart = useSelector(cartSelector);
    const {user} = useSelector(authSelector);
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    useEffect(() => {
        if (!isDistributor(user)) push("/");
    }, [user, push]);

    return (
        <Container maxWidth="xl" sx={{pt: 0, pb: {xs: 4, md: 6}}}>
            {/* Eyebrow only — title removed per design feedback */}
            <Box sx={{mb: {xs: 3, md: 4}, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)", pb: 2.5, pt: 3}}>
                <Box
                    sx={{
                        fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
                        color: "text.secondary",
                    }}
                >
                    {t("distributor.cart.eyebrow")}
                </Box>
            </Box>

            <DistributorCartTable
                products={cart.cartItems}
                total={cart.cartTotalAmount}
            />
        </Container>
    );
};

export default DistributorCart;
