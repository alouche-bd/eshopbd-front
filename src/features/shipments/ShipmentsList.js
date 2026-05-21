import React, {useEffect, useMemo, useState} from "react";
import {makeStyles} from "@mui/styles";
import {DataGrid} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import {useGetAllShipmentsQuery} from "../../app/services/x3Api";
import {useGetMyPendingDistributorOrdersQuery} from "../../app/services/lumenApi";
import {useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import {isDistributor} from "../../common/constants/userTypes";
import {escapeRegExp} from "../../common/utils/helperFunctions";
import {Box} from "@mui/system";
import styles from "./shipmentsList.module.css";
import TableSearchInput from "../../common/components/tableSearchInput/TableSearchInput";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {useHistory} from "react-router";
import {IconButton, Tooltip, Chip} from "@mui/material";
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

const ShipmentsList = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {isFetching, data, error, isError} = useGetAllShipmentsQuery(
        user.codeclientGC
    );

    // Distributor-only: surface local DB orders that haven't been sent to
    // Sage yet (no sage_order_reference + not archived). Merged with the
    // ERP shipments below so distributors see one unified history.
    const {data: pendingData, isFetching: isFetchingPending} = useGetMyPendingDistributorOrdersQuery(undefined, {
        skip: !isDistributor(user),
    });

    const classes = useStyles();

    const {push} = useHistory();

    // Map local distributor orders → the same row shape as ERP shipments
    // so DataGrid can render both without branching at the column level.
    const pendingRows = useMemo(() => {
        if (!isDistributor(user)) return [];
        const list = pendingData?.orders || [];
        return list.map((o) => ({
            id:       `PENDING-${o.id}`,
            _pending: true,
            _localId: o.id,
            _status:  o.export_status,
            numero:   o.customer_reference || `#${o.id}`,
            date:     (o.created_at || "").slice(0, 10),
            totalht:  o.total_ht ?? 0,
            totalttc: o.total_ttc ?? 0,
            etat:     o.export_status === "failed"   ? t("shipmentsExtra.etat.sendFailed")
                    : o.export_status === "exported" ? t("shipmentsExtra.etat.toSend")
                    : o.export_status === "pending"  ? t("shipmentsExtra.etat.inProgress")
                    : t("shipmentsExtra.etat.waiting"),
        }));
    }, [pendingData, user]);

    const columns = [
        {
            field: "numero",
            headerName: t("profile.shipments.columns.number"),
            headerClassName: "tableHeader",
            cellClassName: "invoiceNumber",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <span>{params.value}</span>
                    {params.row._pending && (
                        <Chip
                            label={t("shipmentsExtra.pending")}
                            size="small"
                            sx={{height: 18, fontSize: 10, backgroundColor: "rgba(0,0,0,0.06)"}}
                        />
                    )}
                </Box>
            ),
        },
        {
            field: "date",
            headerName: t("profile.shipments.columns.date"),
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
            type: "number",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            valueFormatter: (params) => {
                if (params.value === false) {
                    return '-';
                } else {
                    const valueFormatted = Number(params.value).toLocaleString();
                    return `${valueFormatted} €`;
                }
            },
        },
        {
            field: "totalttc",
            headerName: t("profile.shipments.columns.totalTtc"),
            headerClassName: "tableHeader",
            type: "number",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
            valueFormatter: (params) => {
                if (params.value === false) {
                    return '-';
                } else {
                    const valueFormatted = Number(params.value).toLocaleString();
                    return `${valueFormatted} €`;
                }
            },
        },
        {
            field: "etat",
            headerName: t("profile.shipments.columns.status"),
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
                // Local distributor "pending" rows aren't in Sage yet, so the
                // standard /profile/shipments/:id (which queries the ERP)
                // would 404. Show an info-only icon for those.
                if (params.row._pending) {
                    return (
                        <Tooltip title={t("shipmentsExtra.pendingHint")}>
                            <span>
                                <IconButton
                                    classes={{root: classes.cardTopIconButton}}
                                    disabled
                                >
                                    <HourglassEmptyIcon/>
                                </IconButton>
                            </span>
                        </Tooltip>
                    );
                }
                if (params.id.startsWith('WEB')) {
                    return (
                        <IconButton
                            classes={{root: classes.cardTopIconButton}}
                            onClick={() => push(`/profile/shipmentsWeb/${params.id}`)}
                        >
                            <VisibilityIcon/>
                        </IconButton>
                    );
                }
                return (
                    <IconButton
                        classes={{root: classes.cardTopIconButton}}
                        onClick={() => push(`/profile/shipments/${params.id}`)}
                    >
                        <VisibilityIcon/>
                    </IconButton>
                );
            },
        },
    ];

    const [searchText, setSearchText] = useState("");

    // Merged rows: pending distributor orders on top (recent first), then
    // ERP shipments. Falsy `data` means the ERP returned nothing — for non-
    // distributors that becomes "empty state", but distributors with pending
    // orders still have content to show.
    const mergedAll = useMemo(() => {
        const erp = Array.isArray(data) ? data : [];
        return [...pendingRows, ...erp];
    }, [data, pendingRows]);

    const [rows, setRows] = useState(mergedAll);

    useEffect(() => {
        setRows(mergedAll);
    }, [mergedAll]);

    // Show the loader during the initial fetch — both for the ERP shipments
    // call and the distributor-only pending-orders call. Without this check,
    // the empty state below would flash before the data populates because
    // `rows` is initialised to `[]`, not `undefined`.
    if (isFetching || isFetchingPending) return <Spinner/>;

    if (!mergedAll.length) {
        return (
            <Box sx={{flexGrow: 1}} bgcolor="#f7f7f7" p={3}>
                <div>
                    <h2 className={styles.title}>{t("profile.shipments.title")}</h2>
                </div>
                <div className={styles.noResult}>
                    <p>
                        <CloudOffIcon/>
                        {t("profile.shipments.empty")}
                    </p>
                </div>
            </Box>
        );
    }

    if (isError && !pendingRows.length) return <div>{error}</div>;

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
        const filteredRows = mergedAll.filter((row) => {
            return Object.keys(row).some((field) => {
                const v = row[field];
                if (v == null) return false;
                return searchRegex.test(v.toString());
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

export default ShipmentsList;
