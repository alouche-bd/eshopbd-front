import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {DataGrid} from "@mui/x-data-grid";
import TableSearchInput from "../../common/components/tableSearchInput/TableSearchInput";
import {escapeRegExp} from "../../common/utils/helperFunctions";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {IconButton} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {authSelector} from "../auth/authSlice";
import {Box} from "@mui/system";
import {makeStyles} from "@mui/styles";
import styles from "../shipments/shipment.module.css";
import {useGetNetworkQuery} from "../../app/services/x3Api";
import {cartSelector, setLabClient} from "../cart/cartSlice";
import toast from "react-hot-toast";

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
    cardTopIconButtonSelected: {
        color: "#1ba9aa",
        background: "#F7F7F7",
        right: "1.5%",
        top: "1.5%",
        "&:hover": {
            background: "black",
            color: "white",
        },
    },
});

const LabClient = () => {
    const {user} = useSelector(authSelector)

    const {labClient} = useSelector(cartSelector)

    const {push} = useHistory();

    const dispatch = useDispatch();

    const {isFetching, data, error, isError} = useGetNetworkQuery(user.sfuid);

    const classes = useStyles();

    const handleSelectClient = (id) => {
        const client = data.find((d) => d.idSageX3 === id)
        dispatch(setLabClient({id: id, company: client.name, suid: client.suid}))
        if(user.user_type === "LDA") {
            push(`/lab-cart/${id}/${client.name}`)
        }else{
            toast.success("Client Sélectionné")
        }
    }

    const columns = [
        {
            field: "idSageX3",
            headerName: "Code client",
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "left",
            align: "left",
            sortable: true,
            filterable: true,
        },
        {
            field: "name",
            headerName: "Raison sociale",
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "left",
            align: "left",
            sortable: true,
            filterable: true,
        },
        {
            field: "billingPostalCode",
            headerName: "Code Postal",
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "left",
            align: "left",
            sortable: true,
            filterable: true,
        },
        {
            field: "see",
            headerName: "",
            minWidth: 50,
            headerAlign: "left",
            headerClassName: "tableHeader",
            sortable: false,
            filterable: false,
            align: "center",
            renderCell: (params) => {
                return (
                    <IconButton
                        classes={{
                            root: params.id === labClient?.id ? classes.cardTopIconButtonSelected : classes.cardTopIconButton,
                        }}
                        onClick={() => handleSelectClient(params.id)}
                    >
                        {" "}
                        <PersonIcon/>
                    </IconButton>
                )
            },
        },
    ];


    const [searchText, setSearchText] = useState("");

    const [rows, setRows] = useState(data);

    useEffect(() => {
       setRows(data)
    }, [data]);

    if (isFetching || rows === undefined) return <></>;

    if (!data) {
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>Mes clients</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        Vous n'avez aucun client enregistré
                    </p>
                </div>
            </Box>
        );
    }
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

    if (isError) return <div>{error}</div>;


    return (
        <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
            {" "}
            <div>
                <h2 className={styles.title}>Mes clients</h2>
            </div>
            <div className={`${styles.gridContainer} ${classes.container}`}>
                <DataGrid
                    components={{Toolbar: TableSearchInput}}
                    rows={rows}
                    rowHeight={50}
                    columns={columns}
                    autoHeight={true}
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

export default LabClient;
