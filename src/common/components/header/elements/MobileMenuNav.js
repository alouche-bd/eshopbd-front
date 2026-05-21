import {useEffect} from "react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MobileMenuNav = ({getActiveStatus, catalogue}) => {
    const {t} = useTranslation();

    useEffect(() => {
        const offCanvasNav = document.querySelector("#offcanvas-mobile-menu__navigation");
        const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".mobile-sub-menu");
        const anchorLinks = offCanvasNav.querySelectorAll("a");

        for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
            offCanvasNavSubMenu[i].insertAdjacentHTML("beforebegin", "<span class='menu-expand'><i></i></span>");
        }

        const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
        const numMenuExpand = menuExpand.length;

        for (let i = 0; i < numMenuExpand; i++) {
            menuExpand[i].addEventListener("click", (e) => {
                sideMenuExpand(e);
            });
        }

        for (let i = 0; i < anchorLinks.length; i++) {
            anchorLinks[i].addEventListener("click", () => {
                getActiveStatus(false);
            });
        }
    });

    const sideMenuExpand = (e) => {
        e.currentTarget.parentElement.classList.toggle("active");
    };

    // NOTE: brand names (Kontact, Anthogyr, Nobel, Astra, Biomet, Dentaurum,
    // Straumann, Tekka, Zimmer, SSA-GF, Flapless, Monobloc) stay hardcoded —
    // they're proper product/family names, not UI strings. URLs are kept as-is.
    return (<nav
        className="offcanvas-mobile-menu__navigation"
        id="offcanvas-mobile-menu__navigation"
    >
        <ul>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.implantSolutions").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    <li><Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL">{t("catalogue.children.boneLevel")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/PERIO%20LEVEL">{t("catalogue.children.perioLevel")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE">{t("catalogue.children.zircone")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/MONOBLOC">{t("catalogue.children.monobloc")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION">{t("catalogue.children.healingScrews")}</Link></li>
                </ul>
            </li>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.surgicalInstruments").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    <li><Link to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE">{t("catalogue.children.classicSurgery")}</Link></li>
                    <li><Link to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE">{t("catalogue.children.guidedSurgery")}</Link></li>
                    <li><Link to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20PK">{t("catalogue.children.pkRange")}</Link></li>
                    <li><Link className="bold" to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE">{t("catalogue.children.osteosynthesisScrew")}</Link></li>
                    <li><Link className="bold" to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU">{t("catalogue.children.flapFixation")}</Link></li>
                    <li><Link to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS" className="bold">{t("catalogue.children.flapless")}</Link></li>
                    <li><Link className="bold" to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE">{t("catalogue.children.zircone")}</Link></li>
                </ul>
            </li>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.prostheticSolutions").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    {/* Brand product names — not translated. */}
                    <li><Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N">Kontact / S / S+ / N</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL">Kontact Perio Level</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE">{t("catalogue.children.zircone")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC">{t("catalogue.children.monobloc")}</Link></li>
                </ul>
            </li>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.genericSolutions").toUpperCase()}
                </Link>
                {/* Sub-menu is all third-party implant-system brand names — kept verbatim. */}
                <ul className="mobile-sub-menu">
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF">SSA-GF</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/ANTHOGYR">Anthogyr</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/ASTRA">Astra</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/BIOMET">Biomet</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/DENTAURUM">Dentaurum</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/INSTRUMENTS">{t("catalogue.children.instruments")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20ACTIVE">Nobel Active</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20BRANEMARK">Nobel Branemark</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20REPLACE">Nobel Replace</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/STRAUMANN">Straumann</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/TEKKA%20IN%20KONE">Tekka In Kone</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/TEKKA%20PROGRESS">Tekka Progress</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20GENERIQUES/ZIMMER">Zimmer</Link></li>
                </ul>
            </li>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.equipment").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    <li><Link to="/catalogue/EQUIPEMENT/LIGNES%20IRRIGATION">{t("catalogue.children.irrigationLines")}</Link></li>
                    <li><Link to="/catalogue/EQUIPEMENT/MOTEURS%20DE%20CHIRURGIE">{t("catalogue.children.surgicalMotors")}</Link></li>
                    <li><Link to="/catalogue/EQUIPEMENT/VITAMINE%20D">{t("catalogue.children.vitaminD")}</Link></li>
                </ul>
            </li>
            <li className="menu-item-has-children">
                <Link to="#">
                    {t("catalogue.families.regenerationSolutions").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    <li><Link to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES">{t("catalogue.children.boneGrafts")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES">{t("catalogue.children.membranesMatrices")}</Link></li>
                    <li><Link to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES">{t("catalogue.children.hemostaticDevices")}</Link></li>
                    <li><a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/regeneration/regeneration-osseuse-modelisee/">{t("catalogue.children.modeledBoneRegen")}</a></li>
                    <li><a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/laser/photobiomodulation/">{t("catalogue.children.photobiomodulation")}</a></li>
                    <li><Link to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE">{t("catalogue.children.hyaluronicAcid")}</Link></li>
                </ul>
            </li>

            <li className="menu-item-has-children">
                <Link to={`/profile/account`}>
                    {t("catalogue.families.professionalArea").toUpperCase()}
                </Link>
                <ul className="mobile-sub-menu">
                    <li><Link to={`/profile/account`}>{t("profile.nav.profile")}</Link></li>
                    <li><Link to={`/profile/wishlist`}>{t("profile.nav.wishlists")}</Link></li>
                    <li><Link to={`/profile/shipments`}>{t("profile.nav.orders")}</Link></li>
                    <li><Link to={`/profile/credits`}>{t("profile.nav.credits")}</Link></li>
                    <li><Link to={`/profile/bills`}>{t("profile.nav.bills")}</Link></li>
                    <li><Link to={`/profile/addresses`}>{t("profile.nav.addresses")}</Link></li>
                </ul>
            </li>
        </ul>
    </nav>);
};

export default MobileMenuNav;
