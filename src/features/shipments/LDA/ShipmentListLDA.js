import React, {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import {DataGrid} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import {authSelector} from "../../auth/authSlice";
import {escapeRegExp, isoStringToDate} from "../../../common/utils/helperFunctions";
import {Box} from "@mui/system";
import styles from "../shipmentsList.module.css";
import TableSearchInput from "../../../common/components/tableSearchInput/TableSearchInput";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useHistory} from "react-router";
import {IconButton} from "@mui/material";
import {useGetOrdersQuery} from "../../../app/services/lumenApi";

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
    cardTopIconButton: {
        color: "black",
        background: "#F7F7F7",
        right: "1.5%",
        top: "1.5%",
        "&:hover": {
            background: "black",
            color: "white",
        },
    },
});

const ShipmentsListLDA = () => {
    const {user} = useSelector(authSelector);

    const {isFetching, data, error, isError} = useGetOrdersQuery();

    const classes = useStyles();

    const {push} = useHistory();

    const columns = [
        {
            field: "created_at",
            headerName: "Date",
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            type: "date",
            valueFormatter: (params) => isoStringToDate(params.value),
        },
        {
            field: "finalClientCode",
            headerName: "Code client",
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "finalClient",
            headerName: "Raison sociale",
            headerClassName: "tableHeader",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "see",
            headerName: "",
            minWidth: 50,
            headerAlign: "center",
            headerClassName: "tableHeader",
            sortable: false,
            filterable: false,
            align: "center",
            renderCell: (params) => {
                return (
                    <IconButton
                        classes={{
                            root: classes.cardTopIconButton,
                        }}
                        onClick={() => push(`/profile/shipments-lda/${params.id}`)}
                    >
                        {" "}
                        <VisibilityIcon/>
                    </IconButton>
                )
            },
        },
    ];

    const [searchText, setSearchText] = useState("");

    const [rows, setRows] = useState(data);

    useEffect(() => {
        if(data?.order?.length) {
            setRows(data.order);
        }
    }, [data]);


    if (isFetching || rows === undefined) return <></>;

    if (!data)
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>Mes commandes</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        Vous n'avez aucune commande en cours
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
                <h2 className={styles.title}>Mes commandes</h2>
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

export default ShipmentsListLDA;
