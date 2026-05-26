import React, {useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {
    Container,
    Box,
    Grid,
    Button,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Paper,
    Chip,
    Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {authSelector} from "../auth/authSlice";
import {isAdvInter} from "../../common/constants/userTypes";
import {BASE_BDD, PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";
import {
    useGetAdvInterOrderQuery,
    useUpdateAdvInterOrderMutation,
    usePostAdvInterSendMutation,
    useGetAdvInterZsohPreviewQuery,
} from "../../app/services/lumenApi";
import {
    useGetAllAddressesQuery,
    usePostGetRepartitionMutation,
    x3Api,
} from "../../app/services/x3Api";

const ACCENT = "#1BA9AA";

const microLabelSx = {
    fontSize: 10, fontWeight: 500, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(0,0,0,0.5)",
};

const inputBaseSx = (locked = false) => ({
    width: "100%",
    minHeight: 32,
    px: 1, py: 0.5,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    fontSize: 13,
    fontFamily: "inherit",
    background: locked ? "#f5f5f5" : "#fff",
    "&:focus": {borderColor: ACCENT},
    "&:disabled": {color: "rgba(0,0,0,0.5)"},
});

/**
 * Normalize an address from either Sage shape into the lireInfoClient one.
 */
const normalizeAddress = (a) => ({
    code:       a.code       ?? a.numero,
    intitule:   a.intitule   ?? a.libelle,
    adresse1:   a.adresse1   ?? a.adresse,
    adresse2:   a.adresse2   ?? "",
    adresse3:   a.adresse3   ?? "",
    codepostal: a.codepostal ?? "",
    ville:      a.ville      ?? "",
    pays:       a.pays       ?? "",
    codepays:   a.codepays   ?? a.zone ?? "",
    principale: a.principale ?? "",
    active:     a.active     ?? "Oui",
});

/* ─────────────────────────────────────────────────────────────────────────
 * Inline product search — minimal version of DistributorSearch used by ADV
 * editor. On select, calls `onAdd(product)` instead of dispatching to a cart.
 * ───────────────────────────────────────────────────────────────────────── */
function ProductSearchInline({onAdd}) {
    const containerRef = useRef(null);
    const inputRef     = useRef(null);

    const [open, setOpen]         = useState(false);
    const [query, setQuery]       = useState("");
    const [items, setItems]       = useState(null);
    const [active, setActive]     = useState(-1);
    const [debounceTimer, setTimer] = useState(null);

    const [trigger, result] = x3Api.endpoints.getProductsBySearchQueryTop.useLazyQuery();

    useEffect(() => {
        const onDocClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDocClick, true);
        return () => document.removeEventListener("click", onDocClick, true);
    }, []);

    useEffect(() => {
        if (result.isLoading) return;
        if (Array.isArray(result.data)) {
            setItems(result.data);
            setActive(result.data.length ? 0 : -1);
        } else if (!result.data) {
            setItems(null);
        }
    }, [result.isLoading, result.data]);

    const onType = (value) => {
        setQuery(value);
        if (debounceTimer) clearTimeout(debounceTimer);
        if (value.trim().length === 0) { setOpen(false); setItems(null); return; }
        setOpen(true);
        setTimer(setTimeout(() => trigger(encodeURI(value)), 400));
    };

    const handleAdd = (product) => {
        if (!product) return;
        onAdd(product);
        setQuery(""); setItems(null); setOpen(false);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const onKeyDown = (e) => {
        if (!open || !items || items.length === 0) {
            if (e.key === "Escape") { setOpen(false); e.currentTarget.blur(); }
            return;
        }
        if (e.key === "ArrowDown")    { e.preventDefault(); setActive((i) => (i + 1) % items.length); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + items.length) % items.length); }
        else if (e.key === "Enter")   { e.preventDefault(); handleAdd(items[active] || items[0]); }
        else if (e.key === "Escape")  { setOpen(false); }
    };

    const hasResults = items && items.length > 0;
    const hasZeroResults = open && query.trim().length > 0 && !result.isLoading && !result.isError && items !== null && items.length === 0;

    return (
        <Box ref={containerRef} sx={{position: "relative", border: "1px solid rgba(0,0,0,0.12)", backgroundColor: "#fff", "&:focus-within": {borderColor: ACCENT}}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25}}>
                {result.isLoading ? <CircularProgress size={16} sx={{color: ACCENT}}/> : <SearchIcon sx={{color: "rgba(0,0,0,0.4)", fontSize: 18}}/>}
                <Box
                    component="input"
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    value={query}
                    placeholder="Ajouter une référence ou un nom de produit"
                    onChange={(e) => onType(e.target.value)}
                    onFocus={() => query.length > 0 && setOpen(true)}
                    onKeyDown={onKeyDown}
                    sx={{flex: 1, border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", background: "transparent"}}
                />
                {query && (
                    <CloseIcon
                        sx={{fontSize: 18, cursor: "pointer", color: "rgba(0,0,0,0.3)", "&:hover": {color: "text.primary"}}}
                        onClick={() => { setQuery(""); setItems(null); setOpen(false); inputRef.current?.focus(); }}
                    />
                )}
            </Box>
            {open && (
                <Paper elevation={0} sx={{position: "absolute", top: "calc(100% + 4px)", left: -1, right: -1, maxHeight: 360, overflowY: "auto", zIndex: 50, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 0}}>
                    {result.isLoading && <Box sx={{p: 2, fontSize: 13, color: "text.secondary"}}>Chargement…</Box>}
                    {hasZeroResults && <Box sx={{p: 2, fontSize: 13, color: "text.secondary", fontStyle: "italic"}}>Aucun produit ne correspond.</Box>}
                    {hasResults && items.map((product, index) => {
                        const highlighted = index === active;
                        return (
                            <Box
                                key={product.reference}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => handleAdd(product)}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5, cursor: "pointer",
                                    borderTop: "1px solid rgba(0,0,0,0.06)",
                                    backgroundColor: highlighted ? "rgba(27, 169, 170, 0.04)" : "transparent",
                                    borderLeft: highlighted ? `2px solid ${ACCENT}` : "2px solid transparent",
                                    transition: "background-color 0.15s, border-color 0.15s",
                                    "&:first-of-type": {borderTop: "none"},
                                }}
                            >
                                <Box sx={{width: 40, height: 40, flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden", backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <img
                                        src={PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"}
                                        onError={(e) => { e.target.src = logoBd; }}
                                        alt={product.reference}
                                        style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}}
                                    />
                                </Box>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Box sx={{fontSize: 13, fontWeight: 600, letterSpacing: "0.02em"}}>{product.reference}</Box>
                                    <Box sx={{fontSize: 12, color: "text.secondary", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{product.designation}</Box>
                                </Box>
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{color: highlighted ? ACCENT : "rgba(0,0,0,0.3)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase"}}>
                                    {highlighted && <KeyboardReturnIcon fontSize="small"/>}
                                    Ajouter
                                </Stack>
                            </Box>
                        );
                    })}
                </Paper>
            )}
        </Box>
    );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Full-page ADV_INTER order editor
 * ───────────────────────────────────────────────────────────────────────── */
const AdvInterOrderEditor = () => {
    const {push} = useHistory();
    const {id} = useParams();
    const {user} = useSelector(authSelector);
    const {t} = useTranslation();

    const {data, isLoading, refetch} = useGetAdvInterOrderQuery(id, {skip: !isAdvInter(user)});
    const [updateOrder, {isLoading: saving}] = useUpdateAdvInterOrderMutation();
    const [sendOrder, {isLoading: sending}]  = usePostAdvInterSendMutation();
    const [showPreview, setShowPreview]      = useState(false);
    const {data: zsohPreview} = useGetAdvInterZsohPreviewQuery(id, {skip: !showPreview || !isAdvInter(user)});

    const [triggerRepartition, {isLoading: repricing}] = usePostGetRepartitionMutation();

    useEffect(() => {
        if (!isAdvInter(user)) push("/");
    }, [user, push]);

    // Local draft
    const [draft, setDraft] = useState(null);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (data?.order) {
            setDraft({
                customer_reference: data.order.customer_reference || "",
                raison_sociale:     data.order.raison_sociale || "",
                client_code:        data.order.client_code || "",
                currency:           data.order.currency || "EUR",
                delivery_address:   data.order.delivery_address || null,
                billing_address:    data.order.billing_address || null,
                // Lines loaded from a saved order already carry real prices, so
                // they count as priced. Lines added later start unpriced until
                // the repartition recalc fills in the client's price.
                products: (data.order.product || []).map((p) => ({...p, priced: true})),
            });
            setDirty(false);
        }
    }, [data]);

    // Addresses for the client
    const {data: addressesData} = useGetAllAddressesQuery(draft?.client_code, {skip: !draft?.client_code});
    const addresses = useMemo(() => {
        const raw = addressesData?.adresseslivraison?.adresselivraison;
        const list = Array.isArray(raw) ? raw : [];
        return list.filter((a) => (a.active ?? "Oui") !== "Non").map(normalizeAddress);
    }, [addressesData]);

    if (isLoading || !draft) {
        return <Container maxWidth="xl" sx={{py: 4}}><CircularProgress size={24}/></Container>;
    }

    const order  = data.order;
    const locked = order.export_status === "sent";

    const updateProduct = (index, patch) => {
        setDraft((d) => ({...d, products: d.products.map((p, i) => i === index ? {...p, ...patch} : p)}));
        setDirty(true);
    };

    const removeProduct = (index) => {
        setDraft((d) => ({...d, products: d.products.filter((_, i) => i !== index)}));
        setDirty(true);
    };

    const updateHeader = (patch) => {
        setDraft((d) => ({...d, ...patch}));
        setDirty(true);
    };

    const selectDeliveryAddress = (addr) => {
        setDraft((d) => ({...d, delivery_address: addr}));
        setDirty(true);
    };

    /**
     * Append a new line. Quantity defaults to 1. Price defaults to product.puttc
     * if present in the search result (it usually is); the user can then click
     * "Recalculer les prix" to pull the correct repartition pricing for the
     * client. We also auto-fire repartition right after add for convenience.
     */
    const addProduct = (product) => {
        const newLine = {
            reference:    product.reference,
            designation:  product.designation || "",
            sales_unit:   product.uniteventes || product.unitevente || "UN",
            cartQuantity: 1,
            gross_price:  product.prixbrut ?? product.puttc ?? 0,
            discount_1:   0,
            discount_2:   0,
            discount_3:   0,
            line_total_ht: product.puttc ?? 0,
            // Indicative catalog price above is kept only as a fallback; the line
            // stays unpriced (no price shown, excluded from total) until the
            // repartition recalc below returns the client's real price.
            priced: false,
        };
        setDraft((d) => ({...d, products: [...d.products, newLine]}));
        setDirty(true);
        // Repartition runs on the NEXT tick so the new line is included.
        requestAnimationFrame(() => recalculatePrices([...draft.products, newLine]));
    };

    /**
     * Refresh prices/discounts for every line in the draft via the
     * postGetRepartition middleware call. Maps response.products back onto
     * draft.products by `reference`.
     */
    const recalculatePrices = async (productsOverride) => {
        const products = productsOverride || draft.products;
        if (!products.length) return;
        if (!draft.client_code) {
            toast.error("Code client manquant pour recalculer les prix");
            return;
        }
        const payload = {
            nomBaseSAGE: BASE_BDD,
            codeclient:  draft.client_code,
            articles: {
                article: products.map((p, idx) => ({
                    code: p.reference,
                    quantite: p.cartQuantity || 1,
                    index: idx,
                })),
            },
        };
        try {
            const res = await triggerRepartition(payload).unwrap();
            if (!res || res.success !== 1 || !res.products) {
                toast.error("La répartition n'a pas renvoyé de prix");
                return;
            }
            // Build a reference→pricing map.
            const priceMap = {};
            res.products.forEach((p) => {
                priceMap[p.code] = {
                    gross_price:  Number(p.prix) || 0,
                    discount_1:   Number(p.remise) || 0,
                    line_total_ht: (Number(p.prix) || 0) * (1 - (Number(p.remise) || 0) / 100),
                };
            });
            setDraft((d) => ({
                ...d,
                products: d.products.map((line) => priceMap[line.reference] ? {...line, ...priceMap[line.reference], priced: true} : line),
            }));
            setDirty(true);
            toast.success("Prix recalculés");
        } catch (e) {
            toast.error(e?.data?.message || "Erreur lors du recalcul des prix");
        }
    };

    const onSave = async () => {
        try {
            const res = await updateOrder({id, body: draft}).unwrap();
            if (res.success) { toast.success("Modifications enregistrées"); refetch(); setDirty(false); }
            else toast.error(res.message || "Échec de l'enregistrement");
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        }
    };

    const onSend = async () => {
        if (dirty) { toast.error("Veuillez enregistrer vos modifications avant l'envoi"); return; }
        try {
            const res = await sendOrder(id).unwrap();
            if (res.success) {
                toast.success("Commande envoyée à Sage X3" + (res?.response?.orderReference ? ` (${res.response.orderReference})` : ""));
                refetch();
            } else toast.error("Sage X3 a renvoyé une erreur");
        } catch (e) {
            toast.error(e?.data?.message || t("common.networkError"));
        }
    };

    // Total reflects only repartition-priced lines, so a freshly added line
    // doesn't bump the total with its indicative catalog price before the
    // recalc lands.
    const pricedCount = (draft.products || []).filter((p) => p.priced === true).length;
    const total = (draft.products || []).reduce(
        (s, p) => (p.priced === true
            ? s + (Number(p.gross_price) || 0) * (1 - (Number(p.discount_1) || 0) / 100) * (Number(p.cartQuantity) || 0)
            : s),
        0,
    );
    // While the first price is still in flight there's nothing to show yet.
    const totalPending = (draft.products || []).length > 0 && pricedCount === 0 && repricing;
    const selectedDeliveryCode = draft.delivery_address?.code;

    // Render a price/discount cell: the editable input once the line is priced,
    // otherwise a loader (while the recalc runs) or a dash.
    const priceCell = (priced, input) => priced
        ? input
        : (
            <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center", minHeight: 32}}>
                {repricing
                    ? <CircularProgress size={14} sx={{color: "rgba(0,0,0,0.3)"}}/>
                    : <Box sx={{color: "text.disabled"}}>—</Box>}
            </Box>
        );

    return (
        <Container maxWidth="xl" sx={{pt: 0, pb: {xs: 4, md: 6}}}>
            {/* Back */}
            <Box
                onClick={() => push("/adv-inter/orders")}
                sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    mt: 3, mb: 4, cursor: "pointer",
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.15em",
                    color: "rgba(0,0,0,0.5)", textTransform: "uppercase",
                    "&:hover": {color: "text.primary"},
                }}
            >
                <ArrowBackIosNewIcon sx={{fontSize: 12}}/> Retour à la liste
            </Box>

            {/* Header */}
            <Box sx={{mb: {xs: 4, md: 5}, pb: 3, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)"}}>
                <Box sx={{...microLabelSx, mb: 1.5}}>
                    Commande distributeur · {order.export_status}
                </Box>
                <Box component="h1" sx={{m: 0, fontSize: {xs: 18, md: 22}, fontWeight: 500, lineHeight: 1.3}}>
                    {draft.customer_reference || `#${order.id}`}
                </Box>
                {locked && (
                    <Alert severity="error" sx={{mt: 1.5}}>
                        Cette commande a déjà été envoyée à Sage X3 — les modifications sont désactivées.
                    </Alert>
                )}
            </Box>

            {/* Header fields */}
            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid item xs={12} md={4}>
                    <Box sx={{...microLabelSx, mb: 0.5}}>Référence client</Box>
                    <Box component="input" disabled={locked} value={draft.customer_reference} onChange={(e) => updateHeader({customer_reference: e.target.value})} sx={inputBaseSx(locked)}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{...microLabelSx, mb: 0.5}}>Code client Sage</Box>
                    <Box component="input" disabled={locked} value={draft.client_code} onChange={(e) => updateHeader({client_code: e.target.value})} sx={inputBaseSx(locked)}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{...microLabelSx, mb: 0.5}}>Raison sociale</Box>
                    <Box component="input" disabled={locked} value={draft.raison_sociale} onChange={(e) => updateHeader({raison_sociale: e.target.value})} sx={inputBaseSx(locked)}/>
                </Grid>
            </Grid>

            {/* === Two-column layout: lines on the left, delivery address on the right === */}
            <Grid container spacing={3} alignItems="flex-start">
                {/* Lines */}
                <Grid item lg={8} xs={12}>
                    {/* Add a new line via product search */}
                    {!locked && (
                        <Box sx={{mb: 2}}>
                            <Box sx={{...microLabelSx, mb: 1}}>Ajouter une référence</Box>
                            <ProductSearchInline onAdd={addProduct}/>
                        </Box>
                    )}

                    {/* Recalculate prices */}
                    {!locked && draft.products.length > 0 && (
                        <Box sx={{mb: 2, textAlign: "right"}}>
                            <Button
                                size="small"
                                onClick={() => recalculatePrices()}
                                startIcon={repricing ? <CircularProgress size={12}/> : <RefreshIcon sx={{fontSize: 14}}/>}
                                disabled={repricing}
                                sx={{
                                    textTransform: "uppercase", fontSize: 10, letterSpacing: "0.1em", fontWeight: 600,
                                    color: ACCENT, "&:hover": {color: "text.primary", backgroundColor: "transparent"},
                                }}
                            >
                                Recalculer les prix (répartition)
                            </Button>
                        </Box>
                    )}

                    {/* Lines header */}
                    <Grid container alignItems="center" sx={{py: 1.5, px: 2, mb: 1, ...microLabelSx, borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
                        <Grid item xs={2}>Réf.</Grid>
                        <Grid item xs={4}>Désignation</Grid>
                        <Grid item xs={1} sx={{textAlign: "center"}}>Qté</Grid>
                        <Grid item xs={2} sx={{textAlign: "right"}}>Prix brut</Grid>
                        <Grid item xs={1} sx={{textAlign: "right"}}>Rem 1</Grid>
                        <Grid item xs={1} sx={{textAlign: "right"}}>Rem 2</Grid>
                        <Grid item xs={1} sx={{textAlign: "right"}}/>
                    </Grid>

                    {/* Lines */}
                    {draft.products.map((p, i) => {
                        const priced = p.priced === true;
                        return (
                        <Box key={i} sx={{mb: 0.5, px: 2, py: 1.5, backgroundColor: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)"}}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item xs={2}>
                                    <Box component="input" disabled={locked} value={p.reference || ""} onChange={(e) => updateProduct(i, {reference: e.target.value})} sx={inputBaseSx(locked)}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box component="input" disabled={locked} value={p.designation || ""} onChange={(e) => updateProduct(i, {designation: e.target.value})} sx={inputBaseSx(locked)}/>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box component="input" type="number" disabled={locked} value={p.cartQuantity || 0} onChange={(e) => updateProduct(i, {cartQuantity: parseInt(e.target.value, 10) || 0})} sx={{...inputBaseSx(locked), textAlign: "center"}}/>
                                </Grid>
                                <Grid item xs={2}>
                                    {priceCell(priced, <Box component="input" type="number" step="0.01" disabled={locked} value={p.gross_price || 0} onChange={(e) => updateProduct(i, {gross_price: parseFloat(e.target.value) || 0})} sx={{...inputBaseSx(locked), textAlign: "right"}}/>)}
                                </Grid>
                                <Grid item xs={1}>
                                    {priceCell(priced, <Box component="input" type="number" step="0.01" disabled={locked} value={p.discount_1 || 0} onChange={(e) => updateProduct(i, {discount_1: parseFloat(e.target.value) || 0})} sx={{...inputBaseSx(locked), textAlign: "right"}}/>)}
                                </Grid>
                                <Grid item xs={1}>
                                    {priceCell(priced, <Box component="input" type="number" step="0.01" disabled={locked} value={p.discount_2 || 0} onChange={(e) => updateProduct(i, {discount_2: parseFloat(e.target.value) || 0})} sx={{...inputBaseSx(locked), textAlign: "right"}}/>)}
                                </Grid>
                                <Grid item xs={1} sx={{textAlign: "right"}}>
                                    <Tooltip title="Retirer cette ligne">
                                        <IconButton
                                            size="small"
                                            disabled={locked}
                                            onClick={() => removeProduct(i)}
                                            sx={{color: "rgba(0,0,0,0.3)", "&:hover": {color: "error.main", backgroundColor: "transparent"}}}
                                        >
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Box>
                        );
                    })}

                    {/* ZSOH preview toggle */}
                    <Box sx={{mt: 3}}>
                        <Button
                            size="small"
                            startIcon={<VisibilityIcon sx={{fontSize: 14}}/>}
                            onClick={() => setShowPreview((v) => !v)}
                            sx={{textTransform: "uppercase", fontSize: 11, letterSpacing: "0.1em", color: "text.secondary", "&:hover": {color: "text.primary", backgroundColor: "transparent"}}}
                        >
                            {showPreview ? "Masquer" : "Voir"} la charge ZSOH
                        </Button>
                        {showPreview && zsohPreview && (
                            <Box component="pre" sx={{mt: 1, p: 2, backgroundColor: "#fafafa", border: "1px solid rgba(0,0,0,0.08)", fontSize: 11, fontFamily: "monospace", maxHeight: 280, overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
                                {JSON.stringify(zsohPreview, null, 2)}
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Delivery address picker */}
                <Grid item lg={4} xs={12}>
                    <Box sx={{position: {lg: "sticky"}, top: {lg: 16}}}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                            <LocalShippingIcon sx={{color: ACCENT}}/>
                            <Box sx={{fontSize: 14, fontWeight: 600}}>Adresse de livraison</Box>
                            <Chip label={addresses.length} size="small" sx={{height: 18, fontSize: 10}}/>
                        </Stack>

                        {!addresses.length && draft.client_code && (
                            <Alert severity="warning" sx={{fontSize: 12}}>
                                Aucune adresse pour ce client.
                            </Alert>
                        )}

                        <Stack spacing={1} sx={{maxHeight: 460, overflowY: "auto", pr: 0.5}}>
                            {addresses.map((addr) => {
                                const selected = addr.code === selectedDeliveryCode;
                                return (
                                    <Paper
                                        key={addr.code}
                                        elevation={0}
                                        onClick={() => !locked && selectDeliveryAddress(addr)}
                                        sx={{
                                            p: 1.5,
                                            cursor: locked ? "default" : "pointer",
                                            border: "2px solid",
                                            borderColor: selected ? "#000" : "rgba(0,0,0,0.12)",
                                            backgroundColor: selected ? "rgba(27, 169, 170, 0.04)" : "#fff",
                                            transition: "all 0.12s",
                                            opacity: locked ? 0.6 : 1,
                                            "&:hover": locked ? {} : {borderColor: selected ? "#000" : "rgba(0,0,0,0.3)"},
                                        }}
                                    >
                                        <Stack direction="row" alignItems="flex-start" spacing={1}>
                                            {selected
                                                ? <CheckCircleIcon sx={{mt: 0.2, color: "#000", flexShrink: 0}}/>
                                                : <RadioButtonUncheckedIcon sx={{mt: 0.2, color: "text.disabled", flexShrink: 0}}/>}
                                            <Box sx={{flex: 1, minWidth: 0}}>
                                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, flexWrap: "wrap"}}>
                                                    <Box sx={{fontWeight: 600, fontSize: 13, mr: 0.5}}>{addr.intitule || addr.code}</Box>
                                                    <Chip label={addr.code} size="small" sx={{height: 16, fontSize: 10}}/>
                                                    {addr.principale === "Oui" && (
                                                        <Chip label="Principale" size="small" color="primary" variant="outlined" sx={{height: 16, fontSize: 10}}/>
                                                    )}
                                                </Stack>
                                                <Box sx={{fontSize: 12, color: "text.secondary", lineHeight: 1.4}}>
                                                    {addr.adresse1}
                                                    {addr.adresse2 && <>, {addr.adresse2}</>}
                                                    <br/>
                                                    {[addr.codepostal, addr.ville].filter(Boolean).join(" ")}, {addr.pays}
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

            {/* Sticky CTA */}
            <Box sx={{position: "sticky", bottom: 16, zIndex: 10, py: 2, px: 3, mt: 4, backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", boxShadow: "0 -2px 16px rgba(0,0,0,0.04)"}}>
                <Box>
                    <Box sx={{fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, display: "flex", alignItems: "center", minHeight: 32}}>
                        {totalPending
                            ? <CircularProgress size={20} sx={{color: "rgba(0,0,0,0.3)"}}/>
                            : `${total.toFixed(2)} ${draft.currency || ""}`}
                    </Box>
                    <Box sx={{fontSize: 11, color: "text.secondary", letterSpacing: "0.05em", mt: 0.5, textTransform: "uppercase"}}>
                        {draft.products.length} {draft.products.length === 1 ? "ligne" : "lignes"} {dirty && "· non enregistré"}
                    </Box>
                </Box>

                <Stack direction="row" spacing={1.5}>
                    <Button
                        onClick={onSave}
                        disabled={!dirty || saving || locked}
                        sx={{
                            minWidth: 160, py: 1.5, px: 3,
                            backgroundColor: "transparent", color: "#000",
                            border: "2px solid #000", borderRadius: 0,
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            "&:hover": {backgroundColor: "#000", color: "#fff"},
                            "&.Mui-disabled": {color: "rgba(0,0,0,0.3)", borderColor: "rgba(0,0,0,0.1)"},
                        }}
                    >
                        {saving ? <CircularProgress size={14} sx={{color: "inherit"}}/> : "Enregistrer"}
                    </Button>
                    <Button
                        onClick={onSend}
                        disabled={sending || locked || dirty}
                        endIcon={sending ? <CircularProgress size={14} sx={{color: "inherit"}}/> : <SendIcon sx={{fontSize: 16}}/>}
                        sx={{
                            minWidth: 220, py: 1.5, px: 3,
                            backgroundColor: "#000", color: "#fff",
                            border: "2px solid #000", borderRadius: 0,
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            transition: "all 0.3s ease-out",
                            "&:hover": {backgroundColor: "#fff", color: "#000"},
                            "&.Mui-disabled": {backgroundColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.3)", borderColor: "rgba(0,0,0,0.1)"},
                        }}
                    >
                        Envoyer à Sage X3
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default AdvInterOrderEditor;
