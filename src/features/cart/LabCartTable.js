import React, {useState} from "react";
import {Grid} from "@mui/material";
import {makeStyles} from "@mui/styles";
import styles from "./cartTable.module.css";
import {cartSelector, removeFromCart} from "./cartSlice";
import {useDispatch, useSelector} from "react-redux";
import CartQuantityHandler from "./CartQuantityHandler";
import {importAllImages,} from "../../common/utils/helperFunctions";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import {useHistory} from "react-router";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import {addWishlist} from "../../features/wishlist/wishlistSlice";
import CloseIcon from "@mui/icons-material/Close";
import {orange} from "@mui/material/colors";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {authSelector} from "../auth/authSlice";
import NeedHelp from "../../common/components/needHelp/NeedHelp";
import {usePostGetRepartitionMutation} from "../../app/services/x3Api";
import Spinner from "../../common/components/spinner/Spinner";
import toast from "react-hot-toast";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";


const useStyles = makeStyles((theme) => ({
    cardButton: {
        "&:hover": {
            background: "transparent",
        },
    },
    cardTopIconButton: {
        position: "absolute",
        color: "white",
        zIndex: "100",
        right: "1.5%",
        top: "1.5%",
        "&:hover": {
            background: "white",
            color: "black",
        },
    },
}));

const CartTable = ({products, total}) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const {push} = useHistory();

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const {user, isAuth} = useSelector(authSelector);

    const {cartItems} = useSelector(cartSelector);

    const repartitionArray = {
        nomBaseSAGE: "BIOTECH",
        codeclient: user.codeclientGC,
        articles: {
            article: cartItems.map((item, key) => ({
                code: item.reference,
                quantite: item.cartQuantity,
                index: key
            }))
        }
    }


    const [isSubmitting, setIsSubmitting] = useState(false);

    const [triggerRepartition] = usePostGetRepartitionMutation();

    const handleSubmitCart = async () => {
        setIsSubmitting(true);
        if (!isAuth) {
            push("/login");
        } else {
            await triggerRepartition(repartitionArray)
                .unwrap()
                .then((response) => {
                    if (response.success === 1) {
                        push("/recap");
                    } else {
                        setIsSubmitting(false);
                        toast.error("Quelque chose s'est mal passé.");
                    }
                });
        }
    };

    const handleAddWishlist = (product) => {
        dispatch(addWishlist(product));
    };

    if (isSubmitting) return <Spinner/>;

    return (
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
                            <div className={styles.goBack} onClick={() => push("/")}>
                                <ArrowBackIosNew/> Continuer mes achats
                            </div>
                        </div>
                        <h2 className={styles.title}>Mon panier</h2>
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
                                <Grid item xs={5}>
                                    Produit
                                </Grid>
                                <Grid item xs={2}>
                                    PU TTC
                                </Grid>{" "}
                                <Grid item xs={2}>
                                    Qté
                                </Grid>{" "}
                                <Grid item sm={2} sx={{display: {xs: 'none', sm: 'block'}}}>
                                    Sous-total
                                </Grid>{" "}
                                <Grid item xs={1}>
                                    Suppr.
                                </Grid>
                            </Grid>
                            {products.map((product, index) => (
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
                                    <Grid item xs={3}>
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
                                    </Grid>
                                    <Grid item xs={2}>
                                        {product.puttc} €
                                    </Grid>{" "}
                                    <Grid item xs={2}>
                                        <>
                                            <CartQuantityHandler product={product}/>
                                            {product.stockdisponible < product.cartQuantity && (
                                                <div className={styles.stockAlert}>
                                                    <WarningAmberIcon
                                                        sx={{color: orange[500]}}
                                                        fontSize="small"
                                                    />{" "}
                                                    stock
                                                </div>
                                            )}
                                        </>
                                    </Grid>{" "}
                                    <Grid item sm={2} sx={{display: {xs: 'none', sm: 'block'}}}>
                                        {(parseFloat(product.puttc * product.cartQuantity)).toFixed(2)} €
                                    </Grid>{" "}
                                    <Grid item xs={1}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleRemoveFromCart(product)}
                                        >
                                            <CloseIcon/>
                                        </button>
                                    </Grid>
                                </Grid>
                            ))}
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-evenly"
                                alignItems="center"
                                className={styles.cartTotalContainer}
                            >
                                <Grid item xs={9}>
                                    {" "}
                                    Total de la commande* :
                                </Grid>
                                <Grid item xs={2} className={styles.total}>
                                    {total} €
                                </Grid>
                                <Grid item xs={1}></Grid>
                            </Grid>
                            <div className={styles.totalNote}>
                                *Ce montant ne tient pas compte de vos tarifs préférentiels,
                                remises et crédits. Le total final sera calculé automatiquement
                                après validation de votre panier.
                            </div>
                            <div>
                                <SubmitButton
                                    buttonText="Valider mon panier"
                                    onClick={handleSubmitCart}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item lg={4} className="pb-3">
                        <NeedHelp/>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default CartTable;
