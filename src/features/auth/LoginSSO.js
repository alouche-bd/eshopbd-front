import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {usePostLoginLumenMutation} from "../../app/services/lumenApi";
import Spinner from "../../common/components/spinner/Spinner";
import {clearCart, clearShippingAddress} from "../cart/cartSlice";
import {clearWishlist} from "../wishlist/wishlistSlice";
import {defaultRouteForUser} from "../../common/constants/userTypes";
import {setLanguageFromUser} from "../../i18n";
import toast from "react-hot-toast";

const useQuery = () => {
    const {search} = useLocation();
    return search.split("?token=")[1];
};

const LoginSSO = () => {
    const [login] = usePostLoginLumenMutation();
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const urlToken = useQuery();

    const {push} = useHistory();

    useEffect(() => {
        login({
            token: urlToken
        })
            .unwrap()
            .then((payload) => {
                if (payload.success === 1) {
                    dispatch(clearShippingAddress());
                    dispatch(clearCart());
                    dispatch(clearWishlist());
                    // Switch UI language based on Sage billing country and
                    // route distributors / ADV_INTER users to their dedicated
                    // landing page (spec §4, §16).
                    setLanguageFromUser(payload.user);
                    push(defaultRouteForUser(payload.user));
                }
            })
            .catch((error) => {
                push("/login")
                toast.error(t("login.invalidCredentials"));
            })
    }, []);

    return <Spinner/>;
};

export default LoginSSO;
