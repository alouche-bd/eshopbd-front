import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Grid} from "@mui/material";
import styles from "./recap.module.css";
import {cartSelector, clearCart, getTotals} from "../cart/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    createX3Commande,
    createX3Credits,
    importAllImages,
    sortOrderAndCredit,
} from "../../common/utils/helperFunctions";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import {useHistory} from "react-router";
import {useConfirmOrderMutation, usePostOrderMutation} from "../../app/services/x3Api";
import {authSelector} from "../auth/authSlice";
import toast from "react-hot-toast";
import Spinner from "../../common/components/spinner/Spinner";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {orange} from "@mui/material/colors";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import SelectAddress from "./SelectAddress";
import Smileys from "./Smileys";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";


const Recap = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const cart = useSelector(cartSelector);

    const {labClient} = useSelector(cartSelector);

    const {push} = useHistory();

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    const {user} = useSelector(authSelector);

    const [comment, setComment] = useState("");

    const headOrder = {
        clientCode: labClient ? labClient.id : user.codeclientGC,
        shippingAddress: cart.shippingAddress,
    };

    const headDcicp = {
        clientCode: labClient ? labClient.id : user.codeclientGC,
        type: "DCICP",
        shippingAddress: cart.shippingAddress,
    };

    const headDcpil = {
        clientCode: labClient ? labClient.id : user.codeclientGC,
        type: "DCPIL",
        shippingAddress: cart.shippingAddress,
    };

    const {order, dcicp, dcpil} = sortOrderAndCredit(cart.cartItems);

    const orderArray = createX3Commande("ZSOH2", headOrder, order);

    const dcicpArray = createX3Credits("ZSOHC", headDcicp, dcicp);

    const dcpilArray = createX3Credits("ZSOHC", headDcpil, dcpil);

    const ordersToPost = () => {
        let ordersArray = [];

        if (order.length !== 0) {
            ordersArray.push(orderArray);
        }
        if (dcicp.length !== 0) {
            ordersArray.push(dcicpArray);
        }
        if (dcpil.length !== 0) {
            ordersArray.push(dcpilArray);
        }
        return ordersArray;
    };

    const [triggerOrder] = usePostOrderMutation();

    const [triggerConfirm] = useConfirmOrderMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const cartToSend = {
        id: makeid(80),
        clientcode: labClient ? labClient.id : user.codeclientGC,
        clientrs: labClient ? labClient.company : user.raisonsociale,
        codepostal: cart.shippingAddress.zipCode,
        adresselivraisoncode: cart.shippingAddress.address,
        panier: cart.cartItems.map((item) => {
            let commentaire = "";
            if (labClient) {
                commentaire = "Commande du laboratoire " + user.codeclientGC;
                if (comment) {
                    commentaire += ". Commentaire : " + comment;
                }
            } else if (comment) {
                commentaire = comment;
            }

            return {
                article: item.reference,
                quantite: item.cartQuantity,
                ...(commentaire && { commentaire })
            };
        }),
        smileyamount: cart.discount,
        uuid: labClient ? labClient.suid : user.suid
    }

    const orderToSend = {
        order: cart.cartItems.map((item) => ({
                reference: item.reference,
                cartQuantity: item.cartQuantity,
                designation: item.designation,
                puttc: item.grouperepartition === "Commande" ? item.puttc : item.grouperepartition
            }
        )),
        email: user.email,
        lab: labClient ? user.codeclientGC + " " + user.raisonsociale : null,
        finalClientEmail: labClient ? cart.shippingAddress.finalClientEmail : null
    }

    const handleSubmitCart = async () => {

        if (!cart.shippingAddress.address) {
            return toast.error(t("checkout.toast.addressMissing"), {id: 'empty_cart'});
        } else {
            setIsSubmitting(true);
            triggerOrder(cartToSend)
                .unwrap()
                .then((response) => {
                    if (response.success === 1) {
                        triggerConfirm(orderToSend).unwrap().then(() => {
                            dispatch(clearCart());
                            push("/");
                            toast.success(t("checkout.toast.saved"));
                        })
                    } else {
                        setIsSubmitting(false);
                        toast.error(t("checkout.toast.error"));
                    }
                });
        }
    };

    if (isSubmitting) return <Spinner/>;

    return (
        <Container maxWidth="xl">
            <div className={styles.loginContainer}>
                <div className={styles.login}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="flex-start"
                        spacing={4}
                    >
                        <Grid item lg={8}>
                            <div className={styles.topRow}>
                                <div
                                    className={styles.goBack}
                                    onClick={() => push("/cart")}
                                >
                                    <ArrowBackIosNew/> {t("checkout.editCart")}
                                </div>
                            </div>
                            <h2 className={styles.title}>{t("checkout.recapTitle")}</h2>
                            <Grid
                                container
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-evenly"
                                    alignItems="center"
                                    className={styles.cartTableHeader}
                                >
                                    {labClient ?
                                        <>
                                            <Grid item xs={10}>{t("checkout.columns.product")}</Grid>{" "}
                                            <Grid item xs={2}>{t("checkout.columns.qty")}</Grid>{" "}
                                        </>
                                        :
                                        <>
                                            <Grid item xs={4}>{t("checkout.columns.product")}</Grid>{" "}
                                            <Grid item xs={2}>{t("checkout.columns.discount")}</Grid>{" "}
                                            <Grid item xs={2}>{t("checkout.columns.unitPrice")}</Grid>{" "}
                                            <Grid item xs={2}>{t("checkout.columns.qty")}</Grid>{" "}
                                            <Grid item xs={2}>{t("checkout.columns.subtotal")}</Grid>{" "}
                                        </>
                                    }
                                </Grid>
                                {cart.cartItems.map((product, index) => (
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        className={styles.cartTableRow}
                                        key={index}
                                    >
                                        <Grid item xs={2}>
                                            <div className={styles.image}>
                                                <img
                                                    src={
                                                        PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                            ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                            : PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
                                                                ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
                                                                : logoBd
                                                    }
                                                    alt={product.reference}
                                                />
                                            </div>
                                        </Grid>{" "}
                                        <Grid item xs={2}>
                                            <h4 className={styles.ref}>{product.reference}</h4>
                                            <p className={styles.productDesignation}>
                                                {product.reference === '31_322_231_01-2G'
                                                    ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                                    :
                                                    product.reference === '31_323_232_01-2G'
                                                        ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                                        :
                                                        product.designation}
                                            </p>
                                        </Grid>{" "}
                                        {!labClient && product.grouperepartition === "Commande" ? (
                                            <>
                                                <Grid item xs={2}>
                                                    {product.remise1montant ? `${product.remise1montant} %`

                                                        : "-"}
                                                </Grid>{" "}
                                                <Grid item xs={2}>
                                                    {product.puttc} €
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {product.cartQuantity}
                                                    {product.stockdisponible < product.cartQuantity && (
                                                        <div className={styles.stockAlert}>
                                                            <WarningAmberIcon
                                                                sx={{color: orange[500]}}
                                                                fontSize="small"
                                                            />{" "}
                                                            {t("cart.stockShort")}
                                                        </div>
                                                    )}
                                                </Grid>{" "}
                                                <Grid item xs={2}>
                                                    {product.cartQuantity * product.puttc} €
                                                </Grid>{" "}
                                            </>
                                        ) : (
                                            <>
                                                {!labClient ?
                                                    <>
                                                        <Grid item xs={4}>
                                                            {t("checkout.creditUsage", {type: product.grouperepartition})}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {product.cartQuantity}
                                                            {product.stockdisponible < product.cartQuantity && (
                                                                <div className={styles.stockAlert}>
                                                                    <WarningAmberIcon
                                                                        sx={{color: orange[500]}}
                                                                        fontSize="small"
                                                                    />{" "}
                                                                    stock
                                                                </div>
                                                            )}
                                                        </Grid>{" "}
                                                        <Grid item xs={2}>
                                                            -
                                                        </Grid>{" "}
                                                    </>
                                                    :
                                                    <>
                                                        <Grid item xs={6}>
                                                            {t("checkout.labPricing")}
                                                        </Grid>{" "}
                                                        <Grid item xs={2}>
                                                            {product.cartQuantity}
                                                            {product.stockdisponible < product.cartQuantity && (
                                                                <div className={styles.stockAlert}>
                                                                    <WarningAmberIcon
                                                                        sx={{color: orange[500]}}
                                                                        fontSize="small"
                                                                    />{" "}
                                                                    stock
                                                                </div>
                                                            )}
                                                        </Grid>{" "}
                                                    </>
                                                }
                                            </>
                                        )}
                                    </Grid>
                                ))}
                                {!labClient &&
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        className={styles.cartTotalContainer}
                                    >
                                        <Grid item xs={6}>
                                            {" "}
                                            {t("checkout.totalLine")}
                                        </Grid>
                                        <Grid item xs={3}>
                                            {cart.discount > 0 &&
                                                <>
                                                    <span>{t("checkout.smileyDiscount", {amount: cart.discount})}</span>
                                                    <br/>
                                                    <span className="small fst-italic">{t("checkout.smileyDiscountNote")}</span>
                                                </>
                                            }</Grid>
                                        <Grid item xs={1}></Grid>
                                        <Grid item xs={2} className={styles.total}>
                                            {cart.cartTotalAmountCheckout} €
                                        </Grid>
                                    </Grid>
                                }
                                <div>
                                    <SubmitButton
                                        buttonText={t("checkout.placeOrderBtn")}
                                        onClick={handleSubmitCart}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <SelectAddress/>
                            <br/>
                            <div className={styles.borderComment}>
                                <h3 className="mb-2">{t("checkout.comment")}</h3>
                                <div className="text-center w-100">
                                    <textarea className="w-100" onChange={(e) => setComment(e.target.value)}/>
                                </div>

                            </div>
                            <br/>
                            {!labClient &&
                                <Smileys/>
                            }
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Container>
    );
};

export default Recap;
