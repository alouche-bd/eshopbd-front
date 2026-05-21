import React from "react";
import {useTranslation} from "react-i18next";

/**
 * Two-state language toggle (FR | EN) for the header.
 * Plain styled divs to avoid any MUI/event-quirk swallowing clicks.
 */
const LanguageSwitcher = () => {
    const {i18n} = useTranslation();
    const current = (i18n.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";

    const setLang = (lng) => {
        i18n.changeLanguage(lng);
        try { localStorage.setItem("uiLanguage", lng); } catch (e) { /* ignore */ }
    };

    const baseStyle = {
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 0.15s, color 0.15s",
    };

    const activeStyle = {
        ...baseStyle,
        backgroundColor: "#000",
        color: "#fff",
    };

    const inactiveStyle = {
        ...baseStyle,
        backgroundColor: "transparent",
        color: "rgba(255, 255, 255, 0.7)",
    };

    return (
        <div
            role="group"
            aria-label="Language selector"
            style={{
                display: "inline-flex",
                border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => setLang("fr")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setLang("fr")}
                style={current === "fr" ? activeStyle : inactiveStyle}
            >
                FR
            </div>
            <div
                role="button"
                tabIndex={0}
                onClick={() => setLang("en")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setLang("en")}
                style={current === "en" ? activeStyle : inactiveStyle}
            >
                EN
            </div>
        </div>
    );
};

export default LanguageSwitcher;
