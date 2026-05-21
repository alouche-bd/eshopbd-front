import React from "react";
import {useTranslation} from "react-i18next";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import styles from "./needHelp.module.css";

const NeedHelpLab = () => {
    const {t} = useTranslation();
    return (
        <div className={styles.help}>
            <h3 className={styles.title}>{t("needHelp.titleLab")}</h3>
            <div>
                <div className={styles.contactContainer}>
                    {t("needHelp.hours")}
                </div>
                <div className={styles.contactDiv}>
                    <a href="tel:+33 4 86 17 60 00" className={styles.contactLink}>
                        <PhoneIcon/> 04 86 17 60 00
                    </a>
                </div>
                <div className={styles.contactDiv}>
                    <a
                        href="mailto:hotline-prothese@biotech-dental.com"
                        className={styles.contactLink}
                    >
                        <MailOutlineIcon/> hotline-prothese@biotech-dental.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NeedHelpLab;
