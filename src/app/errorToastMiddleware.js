import {isRejectedWithValue} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import i18n from "../i18n";

/**
 * Redux middleware that surfaces RTK Query / RTK errors as toast notifications.
 *
 *   - Triggers on `rejected` actions from queries & mutations (both lumenApi and x3Api).
 *   - One toast per (endpoint + status) within a 5s window — prevents toast spam from
 *     React re-render storms.
 *   - 401s skipped — they're handled by the auth flow; toasting on those would be noise.
 *   - 504/timeout/network failures still toast (so the user knows something is wrong)
 *     but RTK Query does NOT retry automatically — one toast, then done.
 */

const lastToasts = new Map(); // key → timestamp
const TOAST_DEDUPE_MS = 5000;

const shouldToast = (key) => {
    const now = Date.now();
    const last = lastToasts.get(key) || 0;
    if (now - last < TOAST_DEDUPE_MS) return false;
    lastToasts.set(key, now);
    // Tiny GC pass.
    if (lastToasts.size > 50) {
        for (const [k, t] of lastToasts) {
            if (now - t > TOAST_DEDUPE_MS) lastToasts.delete(k);
        }
    }
    return true;
};

const formatMessage = (action) => {
    const t = i18n.t.bind(i18n);
    const status = action.payload?.status;
    const data = action.payload?.data;
    const endpoint = action.meta?.arg?.endpointName || "request";

    if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
        return t("common.networkError");
    }
    if (typeof data === "object" && data?.message) {
        return data.message;
    }
    if (typeof status === "number" && status >= 500) {
        return `${t("common.serverError")} (${endpoint})`;
    }
    if (typeof status === "number" && status === 404) {
        return `${endpoint}: not found`;
    }
    return t("common.serverError");
};

export const errorToastMiddleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const status = action.payload?.status;
        const endpoint = action.meta?.arg?.endpointName || "request";

        if (status !== 401) {
            const key = `${endpoint}:${status}`;
            if (shouldToast(key)) {
                toast.error(formatMessage(action));
            }
        }
    }
    return next(action);
};
