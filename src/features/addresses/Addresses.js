import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import React from "react";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "./addresses.module.css";
import AddressRow from "./AddressRow";
import {useGetAllAddressesQuery, useGetClientInfosQuery} from "../../app/services/x3Api";
import {useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {useHistory, useLocation} from "react-router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Addresses = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {isFetching, data, error, isError} = useGetAllAddressesQuery(
        user.codeclientGC
    );

    let numbers = [];

    const {state} = useLocation();

    const checkout = () => {
        if (state && state.checkout) {
            return true;
        } else {
            return false;
        }
    };

    data?.adresseslivraison.adresselivraison.map((address) =>
        numbers.push(address.numero.slice(1))
    );

    const newAddressNumber = `L${Math.max(...numbers) + 1}`;

    const {push} = useHistory();

    const Item = styled(Paper)(({theme}) => ({
        ...theme.typography.body2,
        textAlign: "center",
        padding: "25px",
        color: theme.palette.text.secondary,
        height: "100%",
    }));

    const {
        data: clientInfos,
        isError: isErrorClientInfos,
        error: errorClientInfos,
        isFetching: isLoadingClientInfos,
    } = useGetClientInfosQuery(user.codeclientGC);

    if (isFetching || isLoadingClientInfos) return <></>;

    if (!data)
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                {state && state.checkout && (
                    <div className={styles.goBack} onClick={() => push("/recap")}>
                        <ArrowBackIosNewIcon/> {t("profile.shipmentAddresses.backToCheckout")}
                    </div>
                )}
                <div>
                    <h2 className={styles.title}>{t("profile.shipmentAddresses.title")}</h2>
                </div>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    className={styles.topRow}
                >
                    <Grid item md={6}>
                        <Item>
                            <h4 className={styles.addressCardTitle}>
                                {t("profile.shipmentAddresses.defaultBilling").toUpperCase()}
                            </h4>
                            <AddressRow item={clientInfos.client.facturation}/>
                        </Item>
                    </Grid>
                    <Grid item md={6}>
                        <Item>
                            <h4 className={styles.addressCardTitle}>
                                {t("profile.shipmentAddresses.defaultDelivery").toUpperCase()}
                            </h4>
                            <AddressRow item={clientInfos.client.livraison}/>
                        </Item>
                    </Grid>
                </Grid>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        {t("profile.shipmentAddresses.emptyExtra")}
                    </p>
                    <SubmitButton
                        buttonText={t("profile.shipmentAddresses.add")}
                        onClick={() =>
                            push({
                                pathname: `/profile/address/${newAddressNumber}`,
                                state: {type: "create", checkout: checkout()},
                            })
                        }
                    />
                </div>
            </Box>
        );

    if (isError) return <div>{error}</div>;
    if (isErrorClientInfos) return <div>{errorClientInfos}</div>;

    return (
        <>
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                {state && state.checkout && (
                    <div className={styles.goBack} onClick={() => push("/recap")}>
                        <ArrowBackIosNewIcon/> {t("profile.shipmentAddresses.backToCheckout")}
                    </div>
                )}{" "}
                <div>
                    <h2 className={styles.title}>{t("profile.shipmentAddresses.title")}</h2>
                </div>
                <div>
                    <h4 className={styles.subTitle}>{t("profile.shipmentAddresses.sectionDefault")}</h4>
                </div>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    className={styles.topRow}
                >
                    <Grid item md={6}>
                        <Item>
                            <h4 className={styles.addressCardTitle}>
                                {t("profile.shipmentAddresses.defaultBilling").toUpperCase()}
                            </h4>
                            <AddressRow item={clientInfos.client.facturation}/>
                        </Item>
                    </Grid>
                    <Grid item md={6}>
                        <Item>
                            <h4 className={styles.addressCardTitle}>
                                {t("profile.shipmentAddresses.defaultDelivery").toUpperCase()}
                            </h4>
                            <AddressRow item={clientInfos.client.livraison}/>
                        </Item>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.topRow}
                >
                    <Grid item xs={12}>
                        <h4 className={styles.subTitle}>{t("profile.shipmentAddresses.sectionExtra")}</h4>
                        <SubmitButton
                            buttonText={t("profile.shipmentAddresses.add")}
                            onClick={() =>
                                push({
                                    pathname: `/profile/address/${newAddressNumber}`,
                                    state: {type: "create", checkout: checkout()},
                                })
                            }
                        />
                    </Grid>
                    {data.adresseslivraison.adresselivraison.map((item, index) => (
                        <Grid item md={6} key={index}>
                            {" "}
                            <Item>
                                <h4 className={styles.addressCardTitle}>
                                    {t("profile.shipmentAddresses.extraTitle").toUpperCase()}
                                </h4>
                                <AddressRow item={item}/>
                                <SubmitButton
                                    buttonText={t("profile.shipmentAddresses.edit")}
                                    onClick={() =>
                                        push({
                                            pathname: `/profile/address/${item.numero}`,
                                            state: {type: "update", checkout: checkout()},
                                        })
                                    }
                                />
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default Addresses;
