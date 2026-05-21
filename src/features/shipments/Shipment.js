import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router";
import {useGetOrderLinesQuery} from "../../app/services/x3Api";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {Box} from "@mui/system";
import {Container, Grid} from "@mui/material";
import styles from "./shipment.module.css";
import {importAllImages,} from "../../common/utils/helperFunctions";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import {authSelector} from "../auth/authSlice";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";


const Shipment = () => {
    const {t} = useTranslation();
    const {id} = useParams();
    const {push} = useHistory();
    const {user} = useSelector(authSelector);

    const {data, isFetching, isError, error} = useGetOrderLinesQuery({
        id: id,
        clientCode: user.codeclientGC,
    });

    if (isFetching) {
        return <></>;
    }

    if (!data) {
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>{t("profile.shipments.title")}</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        {t("profile.shipments.noLines")}
                    </p>
                </div>
            </Box>
        );
    }

    if (isError) return <div>{error}</div>;

    const lines = data?.commandes?.commande[0].articles.article;

    const total = lines.reduce(
        (total, item) => total + item.prixnetttc * item.quantite,
        0
    );

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
                                    onClick={() => push("/profile/shipments")}
                                >
                                    <ArrowBackIosNew/> {t("profile.shipments.backToList")}
                                </div>
                            </div>
                            <h2 className={styles.title}>{t("profile.shipments.titleSingle", {id})}</h2>
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
                                    <Grid item xs={3}>{t("profile.shipments.columns.product")}</Grid>{" "}
                                    <Grid item xs={2}>{t("profile.shipments.columns.unitPriceHt")}</Grid>{" "}
                                    <Grid item xs={1}>{t("profile.shipments.columns.unitPriceBrutTtc")}</Grid>{" "}
                                    <Grid item xs={1}>{t("profile.shipments.columns.discount")}</Grid>{" "}
                                    <Grid item xs={2}>{t("profile.shipments.columns.unitPriceTtc")}</Grid>{" "}
                                    <Grid item xs={1}>{t("profile.shipments.columns.quantity")}</Grid>{" "}
                                    <Grid item xs={2}>{t("profile.shipments.columns.subtotal")}</Grid>{" "}
                                </Grid>
                                {lines.map((product, index) => (
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        className={styles.cartTableRow}
                                        key={index}
                                    >
                                        <Grid item xs={1}>
                                            <div className={styles.image}>
                                                <img
                                                    src={
                                                        PRODUCT_IMG_BASE + "/" + product.code.replace('/', '-') + ".jpg"
                                                            ? PRODUCT_IMG_BASE + "/" + product.code.replace('/', '-') + ".jpg"
                                                            : PRODUCT_IMG_BASE + "/" + product.code.replace('/', '-') + ".png"
                                                                ? PRODUCT_IMG_BASE + "/" + product.code.replace('/', '-') + ".png"
                                                                : logoBd
                                                    }
                                                    alt={product.code}
                                                />
                                            </div>
                                        </Grid>{" "}
                                        <Grid item xs={2}>
                                            <h4 className={styles.ref}>{product.code}</h4>
                                            <p className={styles.productDesignation}>
                                                {product.code === '31_322_231_01-2G'
                                                    ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                                    :
                                                    product.code === '31_323_232_01-2G'
                                                        ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                                        :
                                                        product.designation}
                                            </p>
                                        </Grid>{" "}
                                        {id.startsWith("BIOCO") ? (
                                            <>
                                                <Grid item xs={2}>
                                                    {product.prixnetht} €
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {product.prixbrut} €
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {product.remise1montant && product.remise2montant
                                                        ? `${product.remise1montant} - ${product.remise2montant} %`
                                                        : product.remise1montant
                                                            ? `${product.remise1montant} %`
                                                            : product.remise2montant
                                                                ? `${product.remise2montant} %`
                                                                : "-"}
                                                </Grid>{" "}
                                                <Grid item xs={2}>
                                                    {product.prixnetttc} €
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {product.quantite}
                                                </Grid>{" "}
                                                <Grid item xs={2}>
                                                    {product.quantite * product.prixnetttc} €
                                                </Grid>{" "}
                                            </>
                                        ) : (
                                            <>
                                                <Grid item xs={5}>
                                                    {t("profile.shipments.creditUsage")}
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {product.quantite}
                                                </Grid>{" "}
                                                <Grid item xs={2}>
                                                    -
                                                </Grid>{" "}
                                            </>
                                        )}
                                    </Grid>
                                ))}
                                {id.startsWith("BIOCO") && (
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        className={styles.cartTotalContainer}
                                    >
                                        <Grid item xs={10}>
                                            {" "}
                                            {t("profile.shipments.totalLine")}
                                        </Grid>
                                        <Grid item xs={2} className={styles.total}>
                                            {total} €
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Container>
    );
};

export default Shipment;
