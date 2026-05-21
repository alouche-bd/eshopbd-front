import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {RESOURCES, localeForUser} from "./common/i18n/translations";

// Honor a user override stored in localStorage; falls back to French if
// nothing is set. The user-triggered LanguageSwitcher writes here, and the
// per-login setLanguageFromUser() helper checks this flag before overriding.
const storedLanguage = (() => {
    try { return localStorage.getItem("uiLanguage"); } catch (e) { return null; }
})();

i18n
    .use(initReactI18next)
    .init({
        resources:      RESOURCES,
        lng:            storedLanguage || "fr",
        fallbackLng:    "fr",
        debug:          false,
        interpolation:  {escapeValue: false},
        defaultNS:      "translation",
    });

/**
 * Switch the UI language based on the authenticated user. Called from App.js
 * whenever the auth state updates. Applies to ALL users (spec §16):
 *
 *   billing_country_code === "FR" or missing  → French
 *   anything else                             → English
 *
 * A manual choice persisted in localStorage takes precedence over the
 * billing-country default, so the language switcher in the header is sticky.
 */
export const setLanguageFromUser = (user) => {
    let manual = null;
    try { manual = localStorage.getItem("uiLanguage"); } catch (e) { /* ignore */ }
    const locale = manual || localeForUser(user);
    if (i18n.language !== locale) {
        i18n.changeLanguage(locale);
    }
};

export default i18n;
