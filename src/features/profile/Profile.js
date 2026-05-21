import React from "react";
import {Grid, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {authSelector} from "../auth/authSlice";
import styles from "./profile.module.css";
import {useGetSmileysQuery} from "../../app/services/x3Api";
import Spinner from "../../common/components/spinner/Spinner";

const Profile = () => {
    const {t} = useTranslation();
    const Item = styled(Paper)(({theme}) => ({
        ...theme.typography.body2,
        padding: "25px",
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: "100%",
    }));

    const {user} = useSelector(authSelector);

    const {data, isFetching, isError, error} = useGetSmileysQuery(user.suid);

    if (isFetching) return <Spinner/>;
    if (isError) return <div>{error}</div>;

    return (
        <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
            <div>
                <h2 className={styles.title}>{t("profile.title")}</h2>
            </div>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="stretch" className={styles.topRow}>
                <Grid item md={6}>
                    <Item>
                        <h4 className="mb-4">{t("profile.account.sectionInfo").toUpperCase()}</h4>
                        <Typography>{t("profile.account.company")} : {user.raisonsociale}</Typography>
                        <Typography>{t("profile.account.email")} : {user.email}</Typography>
                        <Typography>{t("profile.account.clientCode")} : {user.codeclientGC}</Typography>
                    </Item>
                </Grid>
                <Grid item md={6}>
                    <Item>
                        <h4 className="mb-4">{t("profile.account.sectionSmileys").toUpperCase()}</h4>
                        <Typography>{data ? data.result : t("profile.account.noSmileys")}</Typography>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
