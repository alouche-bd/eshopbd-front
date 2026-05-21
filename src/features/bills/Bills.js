import {makeStyles} from "@mui/styles";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {authSelector} from "../auth/authSlice";
import React, {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import styles from "./bills.module.css";
import TableSearchInput from "../../common/components/tableSearchInput/TableSearchInput";
import {escapeRegExp} from "../../common/utils/helperFunctions";
import DownloadBillCell from "../../common/components/downloadBillCell/downloadBillCell";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {useGetAllBillsQuery} from "../../app/services/x3Api";

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

const Bills = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {isFetching, data, error, isError} = useGetAllBillsQuery(
        user.codeclientGC
    );

    const classes = useStyles();

    const columns = [
        {
            field: "numero",
            headerName: t("profile.bills.columns.number"),
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "date",
            headerName: t("profile.bills.columns.date"),
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
        /*{
          field: "statut",
          headerName: "Statut",
          headerClassName: "tableHeader",
          flex: 1,
          minWidth: 150,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => (
            <div className={styles.delivered}>
              <CheckIcon /> Réglée
            </div>
          ),
        },*/
        {
            field: "Télécharger",
            headerName: "",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            headerClassName: "tableHeader",
            sortable: false,
            filterable: false,
            align: "center",
            renderCell: (params) => <DownloadBillCell id={params.id}/>,
        },
    ];

    const [searchText, setSearchText] = useState("");

    const [rows, setRows] = useState(data);

    useEffect(() => {
        setRows(data);
    }, [data]);

    if (isFetching || rows === undefined) return <></>;

    if (!data)
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>{t("profile.bills.title")}</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        {t("profile.bills.empty")}
                    </p>
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
                <h2 className={styles.title}>Mes factures</h2>
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

export default Bills;
