import React from "react";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import {useDeleteWishlistMutation, useGetWishlistsQuery,} from "../../app/services/lumenApi";
import {Grid, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {isoStringToDate} from "../../common/utils/helperFunctions";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import styles from "./wishlistList.module.css";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Spinner from "../../common/components/spinner/Spinner";

const PostList = () => {
    const {t} = useTranslation();
    const {data: wishlists, isFetching} = useGetWishlistsQuery();

    const {push} = useHistory();

    const [deleteWishlist] = useDeleteWishlistMutation();

    if (isFetching) {
        return <Spinner/>;
    }

    if (!wishlists || !wishlists?.wishlist?.length) {
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h2 className={styles.title}>{t("profile.wishlists.title")}</h2>
                    </Grid>
                    <div className={styles.noResult}>
                        <p>
                            <CloudOffIcon/>
                            {t("profile.wishlists.empty")}
                        </p>
                    </div>
                </Grid>
            </Box>
        );
    }
    const Item = styled(Paper)(({theme}) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));

    const handleDeleteWishlist = async (id) => {
        try {
            deleteWishlist(id);
        } catch {
        }
    };

    return (
        <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2 className={styles.title}>Mes wishlists</h2>
                </Grid>
                {wishlists.wishlist.map((wishlist) => (
                    <Grid item md={6} key={wishlist.id}>
                        <Item>
                            <h3 className={styles.title}>{wishlist.name}</h3>
                            <Typography>{wishlist.products.length} {t("ldaCart.product", {count: wishlist.products.length})}</Typography>
                            <Typography>{isoStringToDate(wishlist.created_at)}</Typography>
                            <Grid
                                container
                                flexDirection="row"
                                justifyContent="center"
                                spacing={2}
                            >
                                <Grid item>
                                    <SubmitButton
                                        onClick={() => push(`/wishlist/${wishlist.id}`)}
                                        buttonText={t("profile.wishlists.open")}
                                    />{" "}
                                </Grid>{" "}
                                <Grid item>
                                    <SubmitButton
                                        onClick={() => handleDeleteWishlist(wishlist.id)}
                                        buttonText={t("profile.wishlists.delete")}
                                        buttonStyle="dark"
                                    />
                                </Grid>{" "}
                            </Grid>
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const WishlistList = () => {
    return <PostList/>;
};

export default WishlistList;
