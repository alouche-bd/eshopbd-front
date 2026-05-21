import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Box, Paper, Stack} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {x3Api} from "../../app/services/x3Api";
import {authSelector} from "../auth/authSlice";
import {addToDistributorCart} from "./distributorThunks";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";

const ACCENT = "#1BA9AA";

/**
 * Inline product search — luxury monochrome, teal accent only on the active row.
 *
 * UX contract:
 *   - Type → debounced (400 ms) query
 *   - ↓ / ↑ to highlight, Enter to add, Esc to close
 *   - Click anywhere on a result row to add
 *   - Add gates through addToDistributorCart (auth check); on success the
 *     input clears + refocuses
 */
function DistributorSearch() {
    const dispatch = useDispatch();
    const {user} = useSelector(authSelector);
    const {t} = useTranslation();

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
        if (value.trim().length === 0) {
            setOpen(false);
            setItems(null);
            return;
        }
        setOpen(true);
        setTimer(setTimeout(() => trigger(encodeURI(value)), 400));
    };

    const handleAdd = async (product) => {
        if (!product) return;
        const ok = await dispatch(addToDistributorCart({product, user}));
        if (ok) {
            setQuery("");
            setItems(null);
            setOpen(false);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    };

    const onKeyDown = (e) => {
        if (!open || !items || items.length === 0) {
            if (e.key === "Escape") { setOpen(false); e.currentTarget.blur(); }
            return;
        }
        if (e.key === "ArrowDown")      { e.preventDefault(); setActive((i) => (i + 1) % items.length); }
        else if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => (i - 1 + items.length) % items.length); }
        else if (e.key === "Enter")     { e.preventDefault(); handleAdd(items[active] || items[0]); }
        else if (e.key === "Escape")    { setOpen(false); }
    };

    const hasResults = items && items.length > 0;
    const hasZeroResults = open && query.trim().length > 0 && !result.isLoading && !result.isError && items !== null && items.length === 0;

    return (
        <Box ref={containerRef} sx={{position: "relative"}}>
            {/* Input — clean, no border (the parent wrapper provides the frame) */}
            <Box
                sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    px: 2.5, py: 1.5,
                }}
            >
                {result.isLoading
                    ? <CircularProgress size={16} sx={{color: ACCENT}}/>
                    : <SearchIcon sx={{color: "rgba(0,0,0,0.4)", fontSize: 18}}/>}
                <Box
                    component="input"
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    value={query}
                    placeholder={t("product.searchPlaceholder")}
                    onChange={(e) => onType(e.target.value)}
                    onFocus={() => query.length > 0 && setOpen(true)}
                    onKeyDown={onKeyDown}
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-controls="distributor-search-results"
                    aria-activedescendant={active >= 0 ? `distributor-search-result-${active}` : undefined}
                    sx={{
                        flex: 1, border: "none", outline: "none",
                        fontSize: 14, color: "text.primary",
                        background: "transparent",
                        fontFamily: "inherit",
                        "&::placeholder": {color: "rgba(0,0,0,0.35)", fontStyle: "italic"},
                    }}
                />
                {query && (
                    <CloseIcon
                        sx={{
                            fontSize: 18, cursor: "pointer",
                            color: "rgba(0,0,0,0.3)",
                            "&:hover": {color: "text.primary"},
                        }}
                        onClick={() => { setQuery(""); setItems(null); setOpen(false); inputRef.current?.focus(); }}
                        aria-label={t("common.close")}
                    />
                )}
            </Box>

            {/* Dropdown */}
            {open && (
                <Paper
                    id="distributor-search-results"
                    role="listbox"
                    elevation={0}
                    sx={{
                        position: "absolute",
                        top: "calc(100% + 4px)", left: -1, right: -1,
                        maxHeight: 380,
                        overflowY: "auto",
                        zIndex: 50,
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: 0,
                    }}
                >
                    {result.isLoading && (
                        <Box sx={{p: 2.5, display: "flex", alignItems: "center", gap: 1, color: "text.secondary", fontSize: 13}}>
                            <CircularProgress size={14} sx={{color: ACCENT}}/>
                            {t("common.loading")}
                        </Box>
                    )}

                    {hasZeroResults && (
                        <Box sx={{p: 2.5, color: "text.secondary", fontSize: 13, fontStyle: "italic"}}>
                            {t("catalogue.noResults")}
                        </Box>
                    )}

                    {result.isError && (
                        <Box sx={{p: 2.5, display: "flex", alignItems: "center", gap: 1, color: "warning.main", fontSize: 13}}>
                            <WarningIcon fontSize="small"/>
                            {t("common.serverError")}
                        </Box>
                    )}

                    {hasResults && items.map((product, index) => {
                        const highlighted = index === active;
                        return (
                            <Box
                                key={product.reference}
                                id={`distributor-search-result-${index}`}
                                role="option"
                                aria-selected={highlighted}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => handleAdd(product)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    px: 2.5, py: 1.5,
                                    cursor: "pointer",
                                    borderTop: "1px solid rgba(0,0,0,0.06)",
                                    backgroundColor: highlighted ? "rgba(27, 169, 170, 0.04)" : "transparent",
                                    borderLeft: highlighted ? `2px solid ${ACCENT}` : "2px solid transparent",
                                    transition: "background-color 0.15s, border-color 0.15s",
                                    "&:first-of-type": {borderTop: "none"},
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 44, height: 44, flexShrink: 0,
                                        border: "1px solid rgba(0,0,0,0.08)",
                                        overflow: "hidden",
                                        backgroundColor: "#fafafa",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"}
                                        onError={(e) => { e.target.src = logoBd; }}
                                        alt={product.reference}
                                        style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}}
                                    />
                                </Box>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Box sx={{fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", color: "text.primary"}}>
                                        {product.reference}
                                    </Box>
                                    <Box sx={{fontSize: 12, color: "text.secondary", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                        {product.designation}
                                    </Box>
                                </Box>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                    sx={{
                                        color: highlighted ? ACCENT : "rgba(0,0,0,0.3)",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {highlighted && <KeyboardReturnIcon fontSize="small"/>}
                                    {t("product.addToCart")}
                                </Stack>
                            </Box>
                        );
                    })}

                    {hasResults && (
                        <Box
                            sx={{
                                px: 2.5, py: 1,
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(0,0,0,0.4)",
                                borderTop: "1px solid rgba(0,0,0,0.06)",
                                textAlign: "right",
                                backgroundColor: "#fafafa",
                            }}
                        >
                            ↑ ↓ {t("product.navigate")} · ↵ {t("product.addSelected")} · Esc
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}

export default DistributorSearch;
