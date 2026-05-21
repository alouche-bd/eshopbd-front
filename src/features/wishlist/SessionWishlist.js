import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearWishlist, wishlistSelector} from "./wishlistSlice";
import FormDialog from "../../common/components/formDialog/FormDialog";
import {usePostWishlistMutation} from "../../app/services/lumenApi";
import toast from "react-hot-toast";
import {authSelector} from "../auth/authSlice";
import {useHistory} from "react-router";
import {Container, Grid} from "@mui/material";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./sessionWishlist.module.css";
import {ShopProducts} from "../../common/components/shop";

const SessionWishlist = () => {
    const wishlist = useSelector(wishlistSelector);

    const {push} = useHistory();

    const initialValue = {name: ""};

    const [dbWishlistName, setDbWishlistName] = useState(initialValue);

    const [addWishlist] = usePostWishlistMutation();

    const handleChange = (e) => {
        setDbWishlistName(e.target.value);
    };

    const {isAuth} = useSelector(authSelector);

    const handleAddWishlist = async () => {
        if (!dbWishlistName.length) {
            return toast.error(
                "La wishlist doit avoir un nom pour être sauvegardée."
            );
        }
        if (!isAuth) {
            push("/galaxy-login");
            toast.error(
                "La wishlist n'a pas pu être sauvegardée, merci de vous authentifier.",
                {id: "wishlistError"}
            );
        } else {
            try {
                const wishlistToStore = {
                    products: wishlist.wishlistItems,
                    name: dbWishlistName,
                };
                await addWishlist(wishlistToStore)
                    .unwrap()
                    .then(() =>
                        toast.success(
                            "Wishlist sauvegardée. Vous pouvez la retrouver à tout moment dans votre profil."
                        )
                    )
                    .catch((error) =>
                        toast.error(
                            "La wishlist n'a pas pu être sauvegardée, merci de réessayer.",
                            {id: "wishlistError"}
                        )
                    );
                setDbWishlistName(initialValue);
            } catch {
            }
        }
    };

    const dispatch = useDispatch();

    const handleClearWishlist = () => {
        dispatch(clearWishlist());
    };

    return (
        <Container maxWidth="xl">
            {!wishlist.wishlistItems.length ? (
                <>
                    {" "}
                    <div className={styles.goBack} onClick={() => push("/")}>
                        <ArrowBackIosNewIcon/> Parcourir notre catalogue
                    </div>
                    <h2 className={styles.title}>Votre wishlist est vide</h2>
                </>
            ) : (
                <>
                    <ShopProducts layout="grid four-column" products={wishlist.wishlistItems}/>
                    <Grid
                        container
                        flexDirection="row"
                        justifyContent="center"
                        spacing={2}
                        className="pb-3"
                    >
                        <Grid item>
                            <FormDialog
                                buttonText="Sauvegarder"
                                dialogContentText="Merci de donner un nom à votre wishlist"
                                inputId="name"
                                inputLabel="nom"
                                inputType="text"
                                goBack="Annuler"
                                validate="Sauvegarder"
                                onChange={handleChange}
                                actionFunction={handleAddWishlist}
                                textfield
                            />
                        </Grid>{" "}
                        <Grid item>
                            <SubmitButton
                                onClick={() => handleClearWishlist()}
                                buttonText="Vider la wishlist"
                                buttonStyle="dark"
                            />
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default SessionWishlist;
