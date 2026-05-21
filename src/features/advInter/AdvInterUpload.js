import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {
    Container,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFileOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import SendIcon from "@mui/icons-material/Send";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArchiveIcon from "@mui/icons-material/Inventory2Outlined";
import UnarchiveIcon from "@mui/icons-material/UnarchiveOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import {authSelector} from "../auth/authSlice";
import {isAdvInter} from "../../common/constants/userTypes";
import {ROOT_URL_LUMEN} from "../../common/utils/apiConstants";
import {
    useGetAdvInterOrdersQuery,
    usePostAdvInterUploadMutation,
    usePostAdvInterSendMutation,
    usePostAdvInterCreateOrderMutation,
    useArchiveAdvInterOrderMutation,
    useUnarchiveAdvInterOrderMutation,
    useDuplicateAdvInterOrderMutation,
} from "../../app/services/lumenApi";

const ACCENT = "#1BA9AA";

// Status options resolve their labels through useTranslation() in the
// component body — see `STATUS_OPTION_KEYS` and the mapping below.
const STATUS_OPTION_KEYS = [
    "active", "exported", "pending", "failed", "sent", "archived", "all",
];

const STATUS_BADGE = {
    pending:  {label: "En cours",  color: "rgba(0,0,0,0.6)",  bg: "rgba(0,0,0,0.05)"},
    exported: {label: "À envoyer", color: "#0a5c5d",          bg: "rgba(27, 169, 170, 0.10)"},
    sent:     {label: "Envoyée",   color: "#1b5e20",          bg: "rgba(46, 125, 50, 0.10)"},
    failed:   {label: "Échec",     color: "#b71c1c",          bg: "rgba(211, 47, 47, 0.08)"},
};

const microLabelSx = {
    fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
};

/**
 * ADV_INTER orders dashboard — luxury monochrome aesthetic, matching the
 * distributor pages. Server-driven search / sort / filter / paginate.
 *
 *   - Upload existing Excel for parse-preview + send
 *   - Download a blank Excel template
 *   - Orders table with search, status filter, sortable columns, pagination
 *   - Per-row: View/Edit (→ /adv-inter/orders/:id) + Send
 */
const AdvInterUpload = () => {
    const {push} = useHistory();
    const {user, lumenToken} = useSelector(authSelector);
    const {t} = useTranslation();

    React.useEffect(() => {
        if (!isAdvInter(user)) push("/");
    }, [user, push]);

    // ===== Upload preview =====
    const [file, setFile] = useState(null);
    const [parsedPreview, setParsedPreview] = useState(null);
    const [uploadFile, {isLoading: uploading}]   = usePostAdvInterUploadMutation();
    const [sendOrder, {isLoading: sending}]      = usePostAdvInterSendMutation();
    const [createFromExcel, {isLoading: creatingOrder}] = usePostAdvInterCreateOrderMutation();
    const [archiveOrder]   = useArchiveAdvInterOrderMutation();
    const [unarchiveOrder] = useUnarchiveAdvInterOrderMutation();
    const [duplicateOrder] = useDuplicateAdvInterOrderMutation();

    const handleArchive = async (id) => {
        try {
            const res = await archiveOrder(id).unwrap();
            if (res.success) toast.success(t("advInter.orders.actions.archived"));
        } catch (e) { toast.error(e?.data?.message || t("common.networkError")); }
    };

    const handleUnarchive = async (id) => {
        try {
            const res = await unarchiveOrder(id).unwrap();
            if (res.success) toast.success(t("advInter.orders.actions.unarchived"));
        } catch (e) { toast.error(e?.data?.message || t("common.networkError")); }
    };

    const handleDuplicate = async (id) => {
        try {
            const res = await duplicateOrder(id).unwrap();
            if (res.success && res.order) {
                toast.success(t("advInter.orders.actions.duplicated"));
                push(`/adv-inter/orders/${res.order.id}`);
            }
        } catch (e) { toast.error(e?.data?.message || t("common.networkError")); }
    };

    const onFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        if (!f) { setFile(null); return; }
        const ok = /\.xlsx?$/i.test(f.name);
        if (!ok) { toast.error(t("advInter.upload.invalidExtension")); setFile(null); return; }
        setFile(f);
    };

    const onUpload = async () => {
        if (!file) { toast.error(t("validation.fileRequired")); return; }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await uploadFile(formData).unwrap();
            if (res.success) { setParsedPreview(res); toast.success(t("advInter.upload.parsed")); }
            else { toast.error(res.message || t("advInter.upload.parseFailed")); }
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        }
    };

    // Track WHICH row is currently being sent so only that row shows the
    // spinner. The global `sending` flag from the mutation hook is also true
    // but applies to every Send button — using a per-row id is more accurate
    // and keeps the rest of the table interactive.
    const [sendingOrderId, setSendingOrderId] = useState(null);

    const onSend = async (id) => {
        setSendingOrderId(id);
        try {
            const res = await sendOrder(id).unwrap();
            if (res.success) {
                toast.success(t("advInter.upload.success") +
                    (res?.response?.orderReference ? ` (${res.response.orderReference})` : ""));
                refetch();
            } else {
                toast.error(t("advInter.upload.failure"));
            }
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        } finally {
            setSendingOrderId(null);
        }
    };

    const downloadTemplate = async () => {
        try {
            const res = await fetch(ROOT_URL_LUMEN + "adv-inter/orders/template", {
                headers: {Authorization: `Bearer ${lumenToken}`},
            });
            if (!res.ok) throw new Error("Téléchargement refusé");
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href = url;
            a.download = "distributor_order_template.xlsx";
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            toast.error(t("common.networkError"));
        }
    };

    // ===== Orders table state (server-driven) =====
    const [search, setSearch]         = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [status, setStatus]         = useState("active");
    const [sort, setSort]             = useState("created_at");
    const [direction, setDirection]   = useState("desc");
    const [page, setPage]             = useState(1);
    const perPage = 25;

    React.useEffect(() => {
        const id = setTimeout(() => setSearchDebounced(search), 350);
        return () => clearTimeout(id);
    }, [search]);

    React.useEffect(() => { setPage(1); }, [searchDebounced, status, sort, direction]);

    const queryArgs = useMemo(() => ({
        search: searchDebounced,
        status, sort, direction, page, per_page: perPage,
    }), [searchDebounced, status, sort, direction, page]);

    const {data: ordersData, refetch, isFetching} = useGetAdvInterOrdersQuery(queryArgs, {
        skip: !isAdvInter(user),
    });

    const orders = ordersData?.orders || [];
    const pagination = ordersData?.pagination || {total: 0, last_page: 1, current_page: 1};

    const toggleSort = (col) => {
        if (sort === col) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSort(col);
            setDirection("desc");
        }
    };

    const SortHeader = ({col, children, align = "left"}) => {
        const active = sort === col;
        return (
            <Box
                onClick={() => toggleSort(col)}
                sx={{
                    display: "flex", alignItems: "center",
                    justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
                    gap: 0.5,
                    cursor: "pointer",
                    color: active ? "text.primary" : "text.secondary",
                    "&:hover": {color: "text.primary"},
                }}
            >
                {children}
                {active && (direction === "asc" ? <ArrowUpwardIcon sx={{fontSize: 12}}/> : <ArrowDownwardIcon sx={{fontSize: 12}}/>)}
            </Box>
        );
    };

    return (
        <Container maxWidth="xl" sx={{pt: 0, pb: {xs: 4, md: 6}}}>
            {/* Refined header */}
            <Box sx={{mb: {xs: 4, md: 5}, pt: 3, pb: 3, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)"}}>
                <Box sx={{...microLabelSx, mb: 1.5}}>{t("advInter.dashboard.eyebrow")}</Box>
                <Box component="h1" sx={{m: 0, fontSize: {xs: 18, md: 22}, fontWeight: 500, lineHeight: 1.3}}>
                    {t("advInter.dashboard.title")}
                </Box>
            </Box>

            {/* Two action cards: upload existing / download template */}
            <Grid container spacing={2} sx={{mb: 5}}>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            p: 3,
                            border: "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: "#fff",
                            height: "100%",
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{mb: 2}}>
                            <UploadFileIcon sx={{color: ACCENT}}/>
                            <Box>
                                <Box sx={microLabelSx}>{t("advInter.dashboard.cardUploadEyebrow")}</Box>
                                <Box sx={{fontSize: 16, fontWeight: 600, mt: 0.25}}>
                                    {t("advInter.dashboard.cardUploadTitle")}
                                </Box>
                            </Box>
                        </Stack>
                        <Box sx={{fontSize: 13, color: "text.secondary", mb: 2, lineHeight: 1.6}}>
                            {t("advInter.dashboard.cardUploadHelp")}
                        </Box>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                                component="input"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={onFileChange}
                                sx={{flex: 1, fontSize: 13}}
                            />
                            <Button
                                disabled={!file || uploading}
                                onClick={onUpload}
                                sx={{
                                    py: 1, px: 2.5,
                                    backgroundColor: "#000", color: "#fff",
                                    border: "2px solid #000", borderRadius: 0,
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    boxShadow: "none",
                                    "&:hover": {backgroundColor: "#fff", color: "#000", boxShadow: "none"},
                                    "&.Mui-disabled": {backgroundColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.3)", borderColor: "rgba(0,0,0,0.1)"},
                                }}
                            >
                                {uploading ? <CircularProgress size={14} sx={{color: "inherit"}}/> : t("advInter.dashboard.parseAction")}
                            </Button>
                        </Stack>

                        {parsedPreview && (
                            <Box sx={{mt: 3, p: 2, backgroundColor: "#fafafa", border: "1px solid rgba(0,0,0,0.06)"}}>
                                <Box sx={{...microLabelSx, mb: 1}}>{t("advInter.dashboard.parsePreviewTitle")}</Box>
                                <Box
                                    component="pre"
                                    sx={{m: 0, fontSize: 11, fontFamily: "monospace", maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all"}}
                                >
                                    {JSON.stringify(parsedPreview.parsedHeader, null, 2)}
                                </Box>

                                {parsedPreview.matchedOrder ? (
                                    <Stack direction="row" spacing={1} sx={{mt: 1.5}}>
                                        <Box sx={{fontSize: 11, color: "text.secondary", mr: 1, alignSelf: "center"}}>
                                            {t("advInter.dashboard.matchedFound", {id: parsedPreview.matchedOrder.id})}
                                        </Box>
                                        <Button
                                            size="small"
                                            onClick={() => push(`/adv-inter/orders/${parsedPreview.matchedOrder.id}`)}
                                            sx={{
                                                py: 0.75, px: 2,
                                                border: "1px solid #000", borderRadius: 0,
                                                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                                color: "#000",
                                                "&:hover": {backgroundColor: "#000", color: "#fff"},
                                            }}
                                        >
                                            {t("advInter.dashboard.matchedView")}
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1} sx={{mt: 1.5}} alignItems="center">
                                        <Box sx={{fontSize: 11, color: "text.secondary", alignSelf: "center", flex: 1}}>
                                            {t("advInter.dashboard.matchedNone")}
                                        </Box>
                                        <Button
                                            size="small"
                                            onClick={async () => {
                                                try {
                                                    const res = await createFromExcel({
                                                        parsedHeader: parsedPreview.parsedHeader,
                                                        parsedLines:  parsedPreview.parsedLines,
                                                    }).unwrap();
                                                    if (res.success) {
                                                        toast.success(t("advInter.orders.actions.createdOk"));
                                                        push(`/adv-inter/orders/${res.order.id}`);
                                                    } else {
                                                        toast.error(t("advInter.orders.actions.createFailed"));
                                                    }
                                                } catch (e) {
                                                    toast.error(e?.data?.message || t("common.networkError"));
                                                }
                                            }}
                                            disabled={creatingOrder}
                                            sx={{
                                                py: 0.75, px: 2,
                                                backgroundColor: "#000", color: "#fff",
                                                border: "2px solid #000", borderRadius: 0,
                                                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                                "&:hover": {backgroundColor: "#fff", color: "#000"},
                                                "&.Mui-disabled": {backgroundColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.3)", borderColor: "rgba(0,0,0,0.1)"},
                                            }}
                                        >
                                            {creatingOrder ? <CircularProgress size={12} sx={{color: "inherit"}}/> : t("advInter.dashboard.createFromExcel")}
                                        </Button>
                                    </Stack>
                                )}
                            </Box>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            p: 3,
                            border: "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: "#fff",
                            height: "100%",
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{mb: 2}}>
                            <FileDownloadIcon sx={{color: ACCENT}}/>
                            <Box>
                                <Box sx={microLabelSx}>{t("advInter.dashboard.cardTemplateEyebrow")}</Box>
                                <Box sx={{fontSize: 16, fontWeight: 600, mt: 0.25}}>
                                    {t("advInter.dashboard.cardTemplateTitle")}
                                </Box>
                            </Box>
                        </Stack>
                        <Box sx={{fontSize: 13, color: "text.secondary", mb: 2, lineHeight: 1.6}}>
                            {t("advInter.dashboard.cardTemplateHelp")}
                        </Box>
                        <Button
                            onClick={downloadTemplate}
                            startIcon={<FileDownloadIcon sx={{fontSize: 16}}/>}
                            sx={{
                                py: 1, px: 2.5,
                                backgroundColor: "transparent", color: "#000",
                                border: "2px solid #000", borderRadius: 0,
                                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                "&:hover": {backgroundColor: "#000", color: "#fff"},
                            }}
                        >
                            {t("advInter.dashboard.downloadTemplate")}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Orders section header */}
            <Box sx={{mb: 2}}>
                <Stack direction="row" alignItems="baseline" spacing={1.5}>
                    <Box sx={{fontSize: 20, fontWeight: 500}}>{t("advInter.dashboard.sectionOrders")}</Box>
                    <Box sx={{fontSize: 12, color: "text.secondary"}}>
                        {t("advInter.dashboard.resultsCount", {count: pagination.total})}
                    </Box>
                </Stack>
            </Box>

            {/* Filters bar */}
            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={1.5}
                sx={{mb: 2}}
                alignItems={{sm: "center"}}
            >
                <Box
                    sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        px: 1.5, py: 1,
                        border: "1px solid rgba(0,0,0,0.12)",
                        backgroundColor: "#fff",
                        flex: 1,
                        maxWidth: {sm: 380},
                        "&:focus-within": {borderColor: ACCENT},
                    }}
                >
                    <SearchIcon sx={{fontSize: 18, color: "rgba(0,0,0,0.4)"}}/>
                    <Box
                        component="input"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("advInter.dashboard.searchPlaceholder")}
                        sx={{
                            flex: 1, border: "none", outline: "none",
                            fontSize: 13, fontFamily: "inherit",
                            background: "transparent",
                        }}
                    />
                    {search && (
                        <CloseIcon
                            sx={{fontSize: 16, cursor: "pointer", color: "rgba(0,0,0,0.3)", "&:hover": {color: "text.primary"}}}
                            onClick={() => setSearch("")}
                        />
                    )}
                </Box>

                <Stack direction="row" spacing={0} sx={{flexWrap: "wrap"}}>
                    {STATUS_OPTION_KEYS.map((key) => (
                        <Box
                            key={key}
                            onClick={() => setStatus(key)}
                            sx={{
                                py: 1, px: 2,
                                border: "1px solid",
                                borderColor: status === key ? "#000" : "rgba(0,0,0,0.12)",
                                borderRightWidth: 0,
                                "&:last-of-type": {borderRightWidth: 1},
                                backgroundColor: status === key ? "#000" : "#fff",
                                color: status === key ? "#fff" : "text.secondary",
                                cursor: "pointer",
                                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                transition: "all 0.15s",
                                "&:hover": {color: status === key ? "#fff" : "text.primary"},
                            }}
                        >
                            {t(`advInter.orders.statuses.${key}`)}
                        </Box>
                    ))}
                </Stack>
            </Stack>

            {/* Table */}
            {isFetching && !orders.length && (
                <Box sx={{p: 4, textAlign: "center"}}><CircularProgress size={20}/></Box>
            )}

            {!isFetching && !orders.length && (
                <Box sx={{p: 4, textAlign: "center", color: "text.secondary", fontSize: 13, border: "1px dashed rgba(0,0,0,0.12)"}}>
                    {t("advInter.dashboard.noResults")}
                </Box>
            )}

            {orders.length > 0 && (
                <>
                    {/* Header row */}
                    <Grid container alignItems="center" sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
                        <Grid item xs={1}><SortHeader col="id">{t("advInter.orders.id")}</SortHeader></Grid>
                        <Grid item xs={2}><SortHeader col="customer_reference">{t("advInter.orders.customerRef")}</SortHeader></Grid>
                        <Grid item xs={3}><SortHeader col="raison_sociale">{t("advInter.orders.client")}</SortHeader></Grid>
                        <Grid item xs={1}><SortHeader col="billing_country_code" align="center">{t("advInter.orders.country")}</SortHeader></Grid>
                        <Grid item xs={2}><SortHeader col="created_at">{t("advInter.orders.createdAt")}</SortHeader></Grid>
                        <Grid item xs={1}><SortHeader col="export_status" align="center">{t("advInter.orders.status")}</SortHeader></Grid>
                        <Grid item xs={2} sx={{textAlign: "right"}}>{t("advInter.orders.action")}</Grid>
                    </Grid>

                    {orders.map((o) => {
                        const badge = STATUS_BADGE[o.export_status] || STATUS_BADGE.pending;
                        return (
                            <Box
                                key={o.id}
                                sx={{
                                    mb: 0.5, px: 2, py: 1.5,
                                    backgroundColor: "#fff",
                                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                                    transition: "background-color 0.15s",
                                    "&:hover": {backgroundColor: "#fafafa"},
                                }}
                            >
                                <Grid container alignItems="center">
                                    <Grid item xs={1} sx={{fontSize: 13, fontFamily: "monospace", color: "text.secondary"}}>
                                        #{o.id}
                                    </Grid>
                                    <Grid item xs={2} sx={{fontSize: 13, fontWeight: 600, letterSpacing: "0.01em"}}>
                                        {o.customer_reference}
                                    </Grid>
                                    <Grid item xs={3} sx={{fontSize: 13, color: "text.primary"}}>
                                        {o.raison_sociale}
                                        <Box sx={{fontSize: 11, color: "text.disabled", mt: 0.25}}>
                                            {o.client_code}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1} sx={{fontSize: 12, color: "text.secondary", textAlign: "center"}}>
                                        {o.billing_country_code || "—"}
                                    </Grid>
                                    <Grid item xs={2} sx={{fontSize: 12, color: "text.secondary"}}>
                                        {o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR", {day: "2-digit", month: "short", year: "numeric"}) : "—"}
                                    </Grid>
                                    <Grid item xs={1} sx={{textAlign: "center"}}>
                                        <Box
                                            sx={{
                                                display: "inline-block",
                                                px: 1, py: 0.25,
                                                fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color: badge.color, backgroundColor: badge.bg,
                                            }}
                                        >
                                            {badge.label}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2} sx={{textAlign: "right"}}>
                                        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                                            <Tooltip title={t("advInter.orders.actions.view")}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => push(`/adv-inter/orders/${o.id}`)}
                                                    sx={{color: "text.secondary", "&:hover": {color: "text.primary", backgroundColor: "transparent"}}}
                                                >
                                                    <VisibilityIcon fontSize="small"/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t("advInter.orders.actions.duplicate")}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDuplicate(o.id)}
                                                    sx={{color: "text.secondary", "&:hover": {color: "text.primary", backgroundColor: "transparent"}}}
                                                >
                                                    <ContentCopyIcon fontSize="small"/>
                                                </IconButton>
                                            </Tooltip>
                                            {o.archived_at ? (
                                                <Tooltip title={t("advInter.orders.actions.unarchive")}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUnarchive(o.id)}
                                                        sx={{color: "text.secondary", "&:hover": {color: ACCENT, backgroundColor: "transparent"}}}
                                                    >
                                                        <UnarchiveIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title={t("advInter.orders.actions.archive")}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleArchive(o.id)}
                                                        sx={{color: "text.secondary", "&:hover": {color: "error.main", backgroundColor: "transparent"}}}
                                                    >
                                                        <ArchiveIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title={
                                                sendingOrderId === o.id ? t("advInter.orders.actions.sendInProgress") :
                                                o.export_status === "sent" ? t("advInter.orders.actions.sendDisabledSent") :
                                                o.archived_at ? t("advInter.orders.actions.sendDisabledArchived") :
                                                t("advInter.orders.actions.send")
                                            }>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onSend(o.id)}
                                                        disabled={sendingOrderId !== null || o.export_status === "sent" || !!o.archived_at}
                                                        sx={{
                                                            color: (o.export_status === "sent" || o.archived_at) ? "rgba(0,0,0,0.2)" : ACCENT,
                                                            "&:hover": {color: (o.export_status === "sent" || o.archived_at) ? "rgba(0,0,0,0.2)" : "text.primary", backgroundColor: "transparent"},
                                                        }}
                                                    >
                                                        {sendingOrderId === o.id
                                                            ? <CircularProgress size={14} sx={{color: ACCENT}}/>
                                                            : <SendIcon fontSize="small"/>}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
                            <Pagination
                                count={pagination.last_page}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                                shape="rounded"
                                size="small"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default AdvInterUpload;
