import React from "react";
import {useHistory, useParams} from "react-router";
import {useDeleteWishlistMutation, useGetWishlistQuery, useUpdateWishlistMutation,} from "../../app/services/lumenApi";
import {addToCart, clearCart} from "../cart/cartSlice";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import FormDialog from "../../common/components/formDialog/FormDialog";
import {Grid} from "@mui/material";
import styles from "./storedWishlist.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {ShopProducts} from "../../common/components/shop";
import Container from "@mui/material/Container";

const StoredWishlist = () => {
    const {push} = useHistory();

    const dispatch = useDispatch();

    const {id} = useParams();

    const {data: wishlist, isFetching} = useGetWishlistQuery(id);

    const [updateWishlist] = useUpdateWishlistMutation();

    const [deleteWishlist] = useDeleteWishlistMutation();

    if (isFetching) {
        return <></>;
    }

    if (!wishlist.wishlist.products) {
        return <div>Pas de produit</div>;
    }


    const handleAddWishlistToCart = () => {
        const products = wishlist.wishlist.products;

        products.map((product) =>
            dispatch(addToCart({...product, cartQuantity: 1}))
        );
    };

    const handleReplaceCart = () => {
        const products = wishlist.wishlist.products;

        dispatch(clearCart());
        products.map((product) =>
            dispatch(addToCart({...product, cartQuantity: 1}))
        );
    };

    const handleDeleteFromWishlist = async (item) => {
        const products = wishlist.wishlist.products;
        if (products.length === 1) {
            try {
                deleteWishlist(id).then(() => push("/profile/wishlist"));
            } catch {
            }
        } else {
            const updatedProducts = products.filter(
                (product) => product.reference !== item.reference
            );
            try {
                const wishlistToStore = {
                    id: id,
                    name: wishlist.wishlist.name,
                    products: updatedProducts,
                };
                await updateWishlist(wishlistToStore)
                    .unwrap()
                    .then(() => toast.success("Produit retiré"))
                    .catch((error) => toast.error(error.data.errors.name));
            } catch {
            }
        }
    };

    return (
        <Container maxWidth="xl">
            <div className={styles.goBack} onClick={() => push("/profile/wishlist")}>
                <ArrowBackIosNewIcon/> Mes wishlists
            </div>
            <div>
                <h2 className={styles.title}>{wishlist.wishlist.name}</h2>
            </div>

            <ShopProducts layout="grid four-column" products={wishlist.wishlist.products}/>

            <Grid
                container
                flexDirection="row"
                justifyContent="center"
                spacing={2}
                p={3}
            >
                {" "}
                <Grid item>
                    <FormDialog
                        buttonText="Ajouter cette wishlist à mon panier"
                        dialogTitle="Ajouter cette wishlist à mon panier"
                        dialogContentText="Tous les articles de votre wishlist seront ajoutés à votre panier. Vous pourrez modifier les quantités directement depuis votre panier."
                        goBack="Annuler"
                        validate="Ajouter"
                        actionFunction={handleAddWishlistToCart}
                    />{" "}
                </Grid>{" "}
                <Grid item>
                    <FormDialog
                        buttonText="Remplacer mon panier par cette wishlist"
                        dialogTitle="Remplacer mon panier par cette wishlist"
                        dialogContentText="Si votre panier contient des articles, ceux-ci seront supprimés et remplacés par cette wishlist. Vous pourrez modifier les quantités directement depuis votre panier."
                        goBack="Annuler"
                        validate="Remplacer"
                        actionFunction={handleReplaceCart}
                        buttonStyle="dark"
                    />{" "}
                </Grid>
            </Grid>
        </Container>
    );
};

export default StoredWishlist;
