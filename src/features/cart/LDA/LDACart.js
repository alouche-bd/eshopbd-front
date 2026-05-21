import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {Container, Box} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LDACartTable from "./LDACartTable";
import {cartSelector, getTotals} from "../cartSlice";

/**
 * LDA cart page — luxury monochrome aesthetic.
 *
 * Shares visual vocabulary with /distributor (black/white/teal accent,
 * hairline borders, refined typography). Functional behavior unchanged —
 * still uses LDACartTable for lot/batch tracking and routes to
 * /lab-cart/recap/{idsf}/{company}.
 */
const LDACart = () => {
    const cart = useSelector(cartSelector);
    const {push} = useHistory();
    const dispatch = useDispatch();
    const {idsf, company} = useParams();
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    return (
        <Container maxWidth="xl" sx={{pt: 0, pb: {xs: 4, md: 6}}}>
            {/* Back link */}
            <Box
                onClick={() => push("/profile/clients")}
                sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    mt: 3, mb: 4, cursor: "pointer",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.15em",
                    color: "rgba(0,0,0,0.5)", textTransform: "uppercase",
                    "&:hover": {color: "text.primary"},
                }}
            >
                <ArrowBackIosNewIcon sx={{fontSize: 12}}/> Sélectionner un autre client
            </Box>

            {/* Refined header — title only; client info lives in its own card */}
            <Box
                sx={{
                    mb: {xs: 4, md: 5},
                    pb: 3,
                    borderBottom: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    sx={{
                        fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
                        color: "text.secondary", mb: 1.5,
                    }}
                >
                    Commande laboratoire
                </Box>
                <Box
                    component="h1"
                    sx={{
                        m: 0,
                        fontSize: {xs: 18, md: 22},
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                        color: "text.primary",
                        lineHeight: 1.3,
                    }}
                >
                    {company}
                </Box>
            </Box>

            <LDACartTable
                products={cart.cartItems}
                total={cart.cartTotalAmount}
                idsf={idsf}
                company={company}
            />
        </Container>
    );
};

export default LDACart;
