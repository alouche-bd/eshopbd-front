import {useTranslation} from "react-i18next";

/**
 * Thin wrapper around react-i18next's useTranslation that returns `{t, locale}`.
 *
 * The actual language selection happens once after login via
 * setLanguageFromUser(user) in src/i18n.js — this hook only reads it.
 * Kept as a separate hook so we have a single place to extend the contract
 * later (e.g. fall back to user preference, RTL flag, etc).
 */
export default function useDistributorLocale() {
    const {t, i18n} = useTranslation();
    return {t, locale: i18n.language};
}
