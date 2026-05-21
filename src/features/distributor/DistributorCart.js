import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import {Container, Box, Stack} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

            {/* Reassurance notice — explains that prices on this page are indicative
                and that nothing is final until the next step. Reduces hesitation
                from distributors who fear placing an order they can't undo. */}
            <Box
                role="note"
                sx={{
                    mb: 4,
                    px: 2.5, py: 2,
                    borderLeft: "3px solid",
                    borderColor: "error.main",
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <InfoOutlinedIcon sx={{color: "error.main", mt: 0.25, fontSize: 20}}/>
                    <Box
                        sx={{
                            fontSize: 13,
                            color: "error.dark",
                            lineHeight: 1.6,
                        }}
                    >
                        {t("distributor.cart.priceNotice")}
                    </Box>
                </Stack>
            </Box>

            <DistributorCartTable
                products={cart.cartItems}
                total={cart.cartTotalAmount}
            />
        </Container>
    );
};

export default DistributorCart;
