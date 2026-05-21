import React from "react";
import {useHistory, useParams} from "react-router";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {Box} from "@mui/system";
import {Container, Grid} from "@mui/material";
import styles from "../shipment.module.css";
import {importAllImages,} from "../../../common/utils/helperFunctions";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import {useGetOrderQuery} from "../../../app/services/lumenApi";
import {PRODUCT_IMG_BASE} from "../../../common/utils/apiConstants";


const ShipmentLda = () => {
    const {id} = useParams();

    const {push} = useHistory();

    const {data, isFetching, isError, error} = useGetOrderQuery(
        id
    );

    if (isFetching) {
        return <></>;
    }

    if (!data) {
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>Mes commandes</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        Cette commande ne comporte aucune ligne
                    </p>
                </div>
            </Box>
        );
    }

    if (isError) return <div>{error}</div>;

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
                        <Grid item xs={12}>
                            <div className={styles.topRow}>
                                <div
                                    className={styles.goBack}
                                    onClick={() => push("/profile/shipments-lda")}
                                >
                                    <ArrowBackIosNew/> Mes commandes
                                </div>
                            </div>
                            <h2 className={styles.title}>Ma commande pour le client : {data.order.finalClientCode} - {data.order.finalClient}</h2>
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
                                    <Grid item xs={4}>
                                        Produit
                                    </Grid>
                                    <Grid item xs={3}>
                                        Lot
                                    </Grid>
                                    <Grid item xs={2}>
                                        Qté
                                    </Grid>
                                    <Grid item xs={3}>
                                        Com.
                                    </Grid>{" "}
                                </Grid>
                                {data.order.product.map((product, index) => (
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
                                        </Grid>{" "}
                                        <Grid item xs={3}>
                                            {product.lot}
                                        </Grid>
                                        <Grid item xs={2}>
                                            {product.cartQuantity}
                                        </Grid>{" "}
                                        <Grid item xs={3}>
                                            {product.comment}
                                        </Grid>{" "}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Container>
    );
};

export default ShipmentLda;
