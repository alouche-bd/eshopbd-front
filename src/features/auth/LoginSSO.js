import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {useLazyGetGalaxyLoginUrlQuery, usePostLoginLumenMutation} from "../../app/services/lumenApi";
import Spinner from "../../common/components/spinner/Spinner";
import {clearCart, clearShippingAddress} from "../cart/cartSlice";
import {clearWishlist} from "../wishlist/wishlistSlice";
import {defaultRouteForUser} from "../../common/constants/userTypes";
import {setLanguageFromUser} from "../../i18n";
import {isNewGalaxyApi, legacySsoToken, loginFailureKey, readGalaxyCallback} from "../../common/utils/galaxy";
import toast from "react-hot-toast";

const LoginSSO = () => {
    const [login] = usePostLoginLumenMutation();
    const [getLoginUrl] = useLazyGetGalaxyLoginUrlQuery();
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const {search} = useLocation();

    const {push} = useHistory();

    useEffect(() => {
        const signIn = (payload) => {
            dispatch(clearShippingAddress());
            dispatch(clearCart());
            dispatch(clearWishlist());
            // Switch UI language based on Sage billing country and
            // route distributors / ADV_INTER users to their dedicated
            // landing page (spec §4, §16).
            setLanguageFromUser(payload.user);
            push(defaultRouteForUser(payload.user));
        };

        if (!isNewGalaxyApi()) {
            login({
                token: legacySsoToken(search)
            })
                .unwrap()
                .then((payload) => {
                    if (payload.success === 1) {
                        signIn(payload);
                    }
                })
                .catch(() => {
                    push("/login")
                    toast.error(t("login.invalidCredentials"));
                });
            return;
        }

        const fail = (failure) => {
            push("/login")
            toast.error(t(loginFailureKey(failure)));
        };
        const {code, state, error, token} = readGalaxyCallback(search);

        if (error) {
            fail(null);
            return;
        }

        if (!token && (!code || !state)) {
            getLoginUrl()
                .unwrap()
                .then((payload) => window.location.assign(payload.url))
                .catch(fail);
            return;
        }

        login(token ? {token} : {code, state})
            .unwrap()
            .then((payload) => {
                if (payload.success === 1) {
                    signIn(payload);
                } else {
                    fail(payload);
                }
            })
            .catch(fail)
    }, []);

    return <Spinner/>;
};

export default LoginSSO;
