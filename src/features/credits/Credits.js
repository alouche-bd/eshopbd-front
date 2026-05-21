import {makeStyles} from "@mui/styles";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {authSelector} from "../auth/authSlice";
import {useGetAllCreditsQuery, useGetSoldCreditsQuery,} from "../../app/services/x3Api";
import React, {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import styles from "./credits.module.css";
import TableSearchInput from "../../common/components/tableSearchInput/TableSearchInput";
import {escapeRegExp} from "../../common/utils/helperFunctions";
import CreditsSold from "./CreditsSold";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Spinner from "../../common/components/spinner/Spinner";

const useStyles = makeStyles({
    root: {
        display: "inline-flex",
        flexDirection: "data",
        alignItems: "center",
        height: 48,
        paddingLeft: 20,
    },
    container: {
        fontFamily: "inherit",
        "& .tableHeader": {
            fontWeight: "bold",
            color: "black",
        },
        " & .invoiceNumber": {
            fontWeight: "bold",
        },
    },
});

const Credits = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {isFetching, data, error, isError} = useGetAllCreditsQuery(
        user.codeclientGC
    );

    const {
        isFetching: isFetchingSold,
        data: creditSold,
    } = useGetSoldCreditsQuery(user.codeclientGC);

    const classes = useStyles();

    const columns = [
        {
            field: "numero",
            headerName: t("profile.credits.columns.number"),
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "dateexpedition",
            headerName: "Date expédition",
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            type: "date",
            valueFormatter: (params) => params.value.split("-").reverse().join("-"),
        },
        {
            field: "datelivraison",
            headerName: "Date livraison",
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            type: "date",
            valueFormatter: (params) => params.value.split("-").reverse().join("-"),
        },
        {
            field: "totalht",
            headerName: t("profile.shipments.columns.totalHt"),
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            type: "number",
            align: "center",
            valueFormatter: (params) => {
                const valueFormatted = Number(params.value).toLocaleString();
                return `${valueFormatted} €`;
            },
        },
        {
            field: "totalttc",
            headerName: t("profile.shipments.columns.totalTtc"),
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            type: "number",
            headerAlign: "center",
            align: "center",
            valueFormatter: (params) => {
                const valueFormatted = Number(params.value).toLocaleString();
                return `${valueFormatted} €`;
            },
        },
        /* {
           field: "Télécharger",
           headerName: "",
           flex: 1,
           minWidth: 150,
           headerAlign: "center",
           headerClassName: "tableHeader",
           sortable: false,
           filterable: false,
           align: "center",
           renderCell: (params) => <DownloadCreditCell id={params.id} />,
         },*/
    ];

    const [searchText, setSearchText] = useState("");

    const [rows, setRows] = useState(data);

    useEffect(() => {
        setRows(data);
    }, [data]);

    if (isFetching || rows === undefined || isFetchingSold) return <Spinner/>;

    if (!data && !creditSold)
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                {" "}
                <div>
                    <h2 className={styles.title}>
                        <CloudOffIcon/> {t("profile.credits.empty")}
                    </h2>
                </div>
                <div className={styles.help}>
                    <div>
                        <div className={styles.contactContainer}>
                            Vous souhaitez en savoir plus sur notre système de crédits ?{" "}
                            <br/>
                            Un assistant des ventes est à votre disposition pour répondre à
                            toutes vos questions, du lundi au vendredi de 8h30 à 18h.
                        </div>
                        <div className={styles.contactDiv}>
                            <a href="tel:+33 4 86 17 60 00" className={styles.contactLink}>
                                <PhoneIcon/> 04 86 17 60 00
                            </a>
                        </div>
                        <div className={styles.contactDiv}>
                            <a
                                href="mailto:hotline-prothese@biotech-dental.com"
                                className={styles.contactLink}
                            >
                                <MailOutlineIcon/> hotline-prothese@biotech-dental.com
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.creditSold}>
                    <CreditsSold creditSold={creditSold}/>
                </div>
            </Box>
        );

    if (!data)
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                {" "}
                <div>
                    <h2 className={styles.title}>{t("profile.credits.title")}</h2>
                </div>
                <div className={styles.creditSold}>
                    <CreditsSold creditSold={creditSold}/>
                </div>
            </Box>
        );

    if (isError) return <div>{error}</div>;

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
        const filteredRows = data.filter((data) => {
            return Object.keys(data).some((field) => {
                return searchRegex.test(data[field].toString());
            });
        });
        setRows(filteredRows);
    };

    return (
        <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
            {" "}
            <div>
                <h2 className={styles.title}>Mes crédits</h2>
            </div>
            <div className={styles.creditSold}>
                <CreditsSold creditSold={creditSold}/>
            </div>
            <div className={`${styles.gridContainer} ${classes.container}`}>
                <DataGrid
                    components={{Toolbar: TableSearchInput}}
                    rows={rows}
                    rowHeight={75}
                    columns={columns}
                    disableColumnMenu
                    componentsProps={{
                        toolbar: {
                            value: searchText,
                            onChange: (event) => requestSearch(event.target.value),
                            clearSearch: () => requestSearch(""),
                        },
                    }}
                />
            </div>
        </Box>
    );
};

export default Credits;
