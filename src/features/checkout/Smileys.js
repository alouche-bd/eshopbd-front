import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {authSelector} from "../auth/authSlice";
import {useGetSmileysQuery} from "../../app/services/x3Api";
import {addDiscount, cartSelector, removeDiscount} from "../cart/cartSlice";
import styles from "./addressForm.module.css";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import React from "react";
import toast from "react-hot-toast";

const Smileys = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {data, isFetching, isError, error} = useGetSmileysQuery(user.suid);

    const cart = useSelector(cartSelector);

    const dispatch = useDispatch();

    if (isFetching) return <></>;

    if (!data) return <div className={styles.address}>{t("smileys.noSmileys")}</div>;

    if (isError) return <div>{error}</div>;

    const handleUseSmileys = () => {
        if (cart.discount > 0) {
            dispatch(removeDiscount());
        } else {
            if (data.result < 500 || data.result < cart.cartTotalWithoutDiscount) {
                toast.error(t("smileys.insufficient"));
            } else {
                dispatch(addDiscount(Math.ceil(cart.cartTotalWithoutDiscount)));
            }
        }
    };

    const text = cart.discount > 0 ? t("smileys.removeDiscount") : t("smileys.useMine");

    return (
        <div className={styles.address}>
            {data.code && data.code === "ERR-SMY-002" ? (
                <h3 className="mb-2">{t("smileys.balanceTitle")} <small>{t("smileys.galaxyNotRecognized")}</small></h3>
            ) : (
                <>
                    <h3 className="mb-2">{t("smileys.balanceTitle")} {data.result - cart.discount}</h3>
                    <div className={styles.inputContainer}>
                        <div className={styles.addAddress}>
                            {data.result >= 0 &&
                                <SubmitButton buttonText={text} onClick={handleUseSmileys}/>
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Smileys;
