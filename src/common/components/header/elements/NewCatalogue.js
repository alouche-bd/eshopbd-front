import {Link} from "react-router-dom";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import useOnClickOutside from "../../../utils/useOnClickOutsideRef";
import mot from "../../../../assets/img/productsImg/1700784-001E.jpg";
import C11 from "../../../../assets/img/productsImg/C11-002.jpg";

const NewCatalogue = () => {
    const {t} = useTranslation();
    const [subMenuState, setSubMenuState] = useState([false, false])

    const displaySubmenu = (e, i) => {
        e.preventDefault();
        const clone = subMenuState.slice(0)
        const newState = clone.map((val, index) => {
            if (index === i) {
                return val
            }
            return false
        })

        newState[i] = !newState[i]

        setSubMenuState(newState)
    }

    const hideMenu = () => {
        setSubMenuState([false, false])
    }

    const ref = useRef();

    useOnClickOutside(ref, () => setSubMenuState([false, false]));

    return (
        <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block mx-auto" ref={ref}>
            <ul>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 0)}>
                        {t("catalogue.families.implantSolutions").toUpperCase()}
                        {subMenuState[0] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-5 ${subMenuState[0] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL">
                                {t("catalogue.children.boneLevel").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact"
                                    >
                                        {t("catalogue.nav.gammeKontact")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact/Kontact"
                                            >
                                                Kontact
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact/Kontact%20N"
                                            >
                                                Kontact N
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact/Kontact%20S"
                                            >
                                                Kontact S
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact/Kontact%20S%2B"
                                            >
                                                Kontact S+
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/BONE%20LEVEL/Gamme%20Kontact/Kontact%20XL"
                                            >
                                                Kontact XL
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/PERIO%20LEVEL">
                                {t("catalogue.children.perioLevel").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/PERIO%20LEVEL/Gamme%20Kontact%20Perio%20Level"
                                    >
                                        {t("catalogue.nav.gammeKontactPerioLevel")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/PERIO%20LEVEL/Gamme%20Kontact%20Perio%20Level/KONTACT%20PERIO%20LEVEL"
                                            >
                                                Kontact PL
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE">
                                {t("catalogue.children.zircone").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE/GAMME%20ZIRCONE"
                                    >
                                        {t("catalogue.nav.gammeZircone")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE/GAMME%20ZIRCONE/SB">
                                                SB
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE/GAMME%20ZIRCONE/RB">
                                                RB
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/ZIRCONE/GAMME%20ZIRCONE/WB">
                                                WB
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/MONOBLOC">
                                {t("catalogue.children.monobloc").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/MONOBLOC/Gamme%20Kontact%20Monobloc"
                                    >
                                        {t("catalogue.nav.gammeKontactMonobloc")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION">
                                {t("catalogue.children.healingScrews").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL">
                                        {t("catalogue.nav.forKontactImplants")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL/VIS%20DE%20COUVERTURE">
                                                {t("catalogue.nav.coverScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL/VIS%20DE%20CICATRISATION">
                                                {t("catalogue.nav.healingScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL/KIT%20DE%20VIS%20DE%20CICATRISATION">
                                                {t("catalogue.nav.healingScrewKit")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL/BIOSCANHEALER">
                                                {t("catalogue.nav.bioscanhealer")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20%2F%20N%20%2F%20S%20%2F%20S%2B%20%2F%20XL/SPIDERGRAFT">
                                                {t("catalogue.nav.spiderGraft")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20Perio%20Level%20(KPL)">
                                        {t("catalogue.nav.forKontactKplImplants")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20Perio%20Level%20(KPL)/VIS%20DE%20COUVERTURE">
                                                {t("catalogue.nav.coverScrews")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20Perio%20Level%20(KPL)/VIS%20DE%20CICATRISATION">
                                                {t("catalogue.nav.healingScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Kontact%20Perio%20Level%20(KPL)/KIT%20DE%20VIS%20DE%20CICATRISATION">
                                                {t("catalogue.nav.healingScrewKit")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Zircone">
                                        {t("catalogue.nav.forZirconeImplants")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Zircone/VIS%20DE%20COUVERTURE">
                                                {t("catalogue.nav.coverScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20IMPLANTAIRES/VIS%20et%20COIFFE%20DE%20CICATRISATION/Pour%20implants%20Zircone/FACONNEUR%20GINGIVAL">
                                                {t("catalogue.nav.gingivalFormer")}
                                            </Link>
                                        </li>

                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 1)}>
                        {t("catalogue.families.surgicalInstruments").toUpperCase()} {subMenuState[1] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-5 ${subMenuState[1] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">
                            <Link
                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE">
                                {t("catalogue.children.classicSurgery").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/TROUSSES%20DE%20CHIRURGIE"
                                    >
                                        {t("catalogue.nav.surgeryKits")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/TROUSSES%20DE%20CHIRURGIE/TROUSSE%20PLEINE"
                                            >
                                                {t("catalogue.nav.fullKit")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/TROUSSES%20DE%20CHIRURGIE/TROUSSE%20VIDE"
                                            >
                                                {t("catalogue.nav.emptyKit")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/BUTEES%20CHIRURGICALES">
                                        {t("catalogue.nav.surgicalStops")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/BUTEES%20CHIRURGICALES/BUTEES%20UNITAIRES"
                                            >
                                                {t("catalogue.nav.singleStops")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/BUTEES%20CHIRURGICALES/KIT%20DE%20BUTEES"
                                            >
                                                {t("catalogue.nav.stopKit")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS">
                                        {t("catalogue.children.instruments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/FORETS%20DE%20MARQUAGE"
                                            >
                                                {t("catalogue.nav.markingDrills")}
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/FORETS%20PILOTES"
                                            >
                                                {t("catalogue.nav.pilotDrills")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/FORETS%20ETAGES"
                                            >
                                                {t("catalogue.nav.stagedDrills")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/FORETS%20CORTICAUX%20POUR%20VIS%20DE%20CICATRISATION"
                                            >
                                                {t("catalogue.nav.corticalDrillsForHealing")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/ALESOIRS"
                                            >
                                                {t("catalogue.nav.reamers")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/COUNTERSINK%20POUR%20IMPLANTS%20KONTACT%20PERIO%20LEVEL"
                                            >
                                                {t("catalogue.nav.countersinkKpl")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/FRAISES%20CORTICALES%20POUR%20IMPLANTS%20KONTACT%20S%2B"
                                            >
                                                {t("catalogue.nav.corticalBursSplus")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/JAUGES"
                                            >
                                                {t("catalogue.nav.gauges")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/MANDRINS"
                                            >
                                                {t("catalogue.nav.mandrels")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/PROLONGATEUR%20DE%20FORET"
                                            >
                                                {t("catalogue.nav.drillExtender")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/TOURNEVIS"
                                            >
                                                {t("catalogue.nav.screwdriver")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/ADAPTATEURS"
                                            >
                                                {t("catalogue.nav.adapters")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/ESPACEUR"
                                            >
                                                {t("catalogue.nav.spacer")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/EXTRACTEURS%20DE%20PILIERS"
                                            >
                                                {t("catalogue.nav.abutmentExtractors")}
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/CLES"
                                            >
                                                {t("catalogue.nav.keys")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/INSTRUMENTS/GUIDES%20DE%20FORAGE"
                                            >
                                                {t("catalogue.nav.drillingGuides")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20CLASSIQUE/TREPANS%20POUR%20EXTRACTION%20D%27IMPLANT">
                                        {t("catalogue.nav.trephinesForExtraction")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <ul className="sub-menu--mega__list">
                                <li className="bold mb-5">
                                    <Link
                                        className="bold"
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE">
                                        {t("catalogue.children.guidedSurgery").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/FULL%20GUIDED"
                                            >
                                                {t("catalogue.nav.fullGuided")}
                                            </Link>
                                            <ul className="sub-menu--mega__list__second-level">
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/FULL%20GUIDED/INSTRUMENTS"
                                                    >
                                                        {t("catalogue.children.instruments")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/FULL%20GUIDED/MASTERS%20TUBES"
                                                    >
                                                        {t("catalogue.nav.mastersTube")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/FULL%20GUIDED/TROUSSE%20DE%20CHIRURGIE%20GUIDEE"
                                                    >
                                                        {t("catalogue.nav.guidedSurgeryKit")}
                                                    </Link>
                                                </li>

                                            </ul>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/PILOTE"
                                            >
                                                {t("catalogue.nav.pilot")}
                                            </Link>
                                            <ul className="sub-menu--mega__list__second-level">
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/PILOTE/FORETS%20PILOTES"
                                                    >
                                                        {t("catalogue.nav.pilotDrills")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/PILOTE/KIT%20FORETS%20PILOTES"
                                                    >
                                                        {t("catalogue.nav.pilotDrillsKit")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/CHIRURGIE%20GUIDEE/PILOTE/MASTERS%20TUBES"
                                                    >
                                                        {t("catalogue.nav.mastersTubes")}
                                                    </Link>
                                                </li>

                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="bold mb-5">
                                    <Link
                                        className="bold"
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20PK"
                                    >
                                        {t("catalogue.children.pkRange").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20PK/VIS%20SCREWPINSKIT"
                                            >
                                                {t("catalogue.nav.screwpinskitScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20PK/KIT%20SCREWPINSKIT"
                                            >
                                                {t("catalogue.nav.screwpinskitKit")}
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20PK/DISPOSITIF%20DE%20PRELEVEMENT%20D%27OS%20AUTOGENE"
                                            >
                                                {t("catalogue.nav.autogenousBoneDevice")}
                                            </Link>
                                        </li>

                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <ul className="sub-menu--mega__list">
                                <li className="bold mb-5">
                                    <Link
                                        className="bold"
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE"
                                    >
                                        {t("catalogue.children.osteosynthesisScrew").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/INSTRUMENTS"
                                            >
                                                {t("catalogue.children.instruments")}
                                            </Link>
                                            <ul className="sub-menu--mega__list__second-level">
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/INSTRUMENTS/FORETS"
                                                    >
                                                        {t("catalogue.nav.drills")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/INSTRUMENTS/AXES%20DE%20TOURNEVIS"
                                                    >
                                                        {t("catalogue.nav.screwdriverShafts")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/INSTRUMENTS/MANCHE"
                                                    >
                                                        {t("catalogue.nav.handle")}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/VIS%20FIX%20IN"
                                            >
                                                {t("catalogue.nav.fixInScrews")}
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/KIT%20FIX%20IN"
                                            >
                                                {t("catalogue.nav.fixInKit")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20VIS%20OSTEOSYNTHESE/VIS%20SCREWPINSKIT"
                                            >
                                                {t("catalogue.nav.screwpinskitScrews")}
                                            </Link>
                                        </li>

                                    </ul>
                                </li>
                                <li className="bold mb-5">
                                    <Link
                                        className="bold"
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU"
                                    >
                                        {t("catalogue.children.flapFixation").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU/INSTRUMENTS"
                                            >
                                                {t("catalogue.children.instruments")}
                                            </Link>
                                            <ul className="sub-menu--mega__list__second-level">
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU/INSTRUMENTS/MAILLET"
                                                    >
                                                        {t("catalogue.nav.mallet")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU/INSTRUMENTS/IMPACTEUR"
                                                    >
                                                        {t("catalogue.nav.impactor")}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FIXATION%20LAMBEAU/CLOU"
                                            >
                                                {t("catalogue.nav.nail")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <ul className="sub-menu--mega__list">
                                <li className="bold mb-5">
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS"
                                        className="bold"
                                    >
                                        {t("catalogue.children.flapless").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS/KIT"
                                            >
                                                {t("catalogue.nav.kit")}
                                            </Link>
                                            <ul className="sub-menu--mega__list__second-level">
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS/KIT/PLEIN"
                                                    >
                                                        {t("catalogue.nav.full")}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS/KIT/VIDE"
                                                    >
                                                        {t("catalogue.nav.empty")}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/FLAPLESS/TREPANS%20FLAPLESS"
                                            >
                                                {t("catalogue.nav.flaplessTrephines")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul className="sub-menu--mega__list">
                                <li className="bold mb-5">
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG"
                                        className="bold"
                                    >
                                        {t("catalogue.nav.gammeHug").toUpperCase()}
                                    </Link>
                                    <ul className="sub-menu--mega__list">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG/KIT%20HUG"
                                            >
                                                {t("catalogue.nav.hugKit")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG/VIS%20OSTEOSYNTHESE"
                                            >
                                                {t("catalogue.nav.osteosynthesisScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG/TOURNEVIS%20POUR%20VIS%20D%27OSTEOSYNTHESE"
                                            >
                                                {t("catalogue.nav.osteosynthesisScrewdriver")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG/MANCHE%20DE%20TOURNEVIS"
                                            >
                                                {t("catalogue.nav.screwdriverHandle")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/GAMME%20HUG/FORET%20POUR%20VIS%20D%27OSTHEOSYNTHESE"
                                            >
                                                {t("catalogue.nav.drillForOsteosynthesis")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">

                            <Link
                                className="bold"
                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE"
                            >
                                {t("catalogue.children.zircone").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS"
                                    >
                                        {t("catalogue.children.instruments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/CLE"
                                            >
                                                {t("catalogue.nav.key")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/FRAISE%20BOULE"
                                            >
                                                {t("catalogue.nav.roundBur")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/JAUGE%20DE%20PROFONDEUR"
                                            >
                                                {t("catalogue.nav.depthGauge")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/KIT%20DE%20BUTEES"
                                            >
                                                {t("catalogue.nav.stopKit")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/PICKUP"
                                            >
                                                {t("catalogue.nav.pickup")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/PROFIL%20DRILL"
                                            >
                                                {t("catalogue.nav.profileDrill")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/ZERADRILL"
                                            >
                                                {t("catalogue.nav.zeradrill")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/INSTRUMENTS/ZERATAPE"
                                            >
                                                {t("catalogue.nav.zeratape")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/KIT"
                                    >
                                        {t("catalogue.nav.kit")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/KIT/PLATEAU%20CHIRURGICAL"
                                            >
                                                {t("catalogue.nav.surgicalTray")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/INSTRUMENTS%20CHIRURGICAUX/ZIRCONE/KIT/SET%20COMPLET"
                                            >
                                                {t("catalogue.nav.completeSet")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 3)}>
                        {t("catalogue.families.prostheticSolutions").toUpperCase()} {subMenuState[3] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-4 ${subMenuState[3] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N">
                                KONTACT / S / S+ / N
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS"
                                    >
                                        {t("catalogue.nav.abutments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/DROITS"
                                            >
                                                {t("catalogue.nav.straight")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/ANGULES"
                                            >
                                                {t("catalogue.nav.angled")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/CONIQUES"
                                            >
                                                {t("catalogue.nav.conical")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/%20CAD%20%2F%20CAM%20TI-BASE"
                                            >
                                                {t("catalogue.nav.cadCamTiBase")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/PROVISOIRES"
                                            >
                                                {t("catalogue.nav.provisional")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/SURCOULABLES"
                                            >
                                                {t("catalogue.nav.castable")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/FIT-POST"
                                            >
                                                {t("catalogue.nav.fitPost")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/UNI-POST"
                                            >
                                                {t("catalogue.nav.uniPost")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/OMNI-POST"
                                            >
                                                {t("catalogue.nav.omniPost")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/NANO-POST"
                                            >
                                                {t("catalogue.nav.nanoPost")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/ISO-POST"
                                            >
                                                {t("catalogue.nav.isoPost")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/AMOVIBLE"
                                            >
                                                {t("catalogue.nav.removable")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS/PILIERS%20D%27ESSAI"
                                            >
                                                {t("catalogue.nav.trialAbutments")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS%20ET%20COIFFES%20OMNI-POST%20%2F%20SSA"
                                    >
                                        {t("catalogue.nav.omniPostSsaAbutmentsCaps")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS%20ET%20COIFFES%20OMNI-POST%20%2F%20SSA/PILIERS%20OMNI-POST"
                                            >
                                                {t("catalogue.nav.omniPostAbutments")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS%20ET%20COIFFES%20OMNI-POST%20%2F%20SSA/PILIERS%20SSA%20DIRECT%20IMPLANT"
                                            >
                                                {t("catalogue.nav.ssaDirectImplantAbutments")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS%20ET%20COIFFES%20OMNI-POST%20%2F%20SSA/COIFFES%20SSA-GF%20%28SUR%20OMNI-POST%29"
                                            >
                                                {t("catalogue.nav.ssaGfCapsOnOmniPost")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PILIERS%20ET%20COIFFES%20OMNI-POST%20%2F%20SSA/COIFFES%20OMNI-POST"
                                            >
                                                {t("catalogue.nav.omniPostCaps")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/SPIDERGRAFT"
                                    >
                                        {t("catalogue.nav.spiderGraft")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE">
                                        {t("catalogue.nav.prostheticFittings")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/COIFFES%20PROTHETIQUES"
                                            >
                                                {t("catalogue.nav.prostheticCaps")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/COIFFES%20DE%20CICATRISATION"
                                            >
                                                {t("catalogue.nav.healingCaps")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/COIFFES%20DE%20PARALLELISME"
                                            >
                                                {t("catalogue.nav.parallelismCaps")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/GAINES"
                                            >
                                                {t("catalogue.nav.sleeves")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/JAUGES"
                                            >
                                                {t("catalogue.nav.gauges")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/VIS%20%28DE%20PILIER%2C%20POUR%20VISSAGE%20ANGULE%29"
                                            >
                                                {t("catalogue.nav.abutmentScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/ACCASTILLAGE%20PROTHETIQUE/AMOVIBLE"
                                            >
                                                {t("catalogue.nav.removable")}
                                            </Link>
                                        </li>
                                    </ul>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS"
                                        >
                                            {t("catalogue.children.instruments")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/ADAPTATEURS"
                                                >
                                                    {t("catalogue.nav.adapters")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/CLES"
                                                >
                                                    {t("catalogue.nav.keys")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/EXTRACTEURS%20DE%20PILIERS"
                                                >
                                                    {t("catalogue.nav.abutmentExtractors")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/TOURNEVIS"

                                                >
                                                    {t("catalogue.nav.screwdriver")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/MANDRINS%20POUR%20PILIER%20CONIQUE"

                                                >
                                                    {t("catalogue.nav.mandrelsForConical")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/TROUSSE%20DE%20PROTHESE"

                                                >
                                                    {t("catalogue.nav.prosthesisKit")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/INSTRUMENTS/KIT%20PILIERS%20CONIQUES"
                                                >
                                                    {t("catalogue.nav.conicalAbutmentKit")}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D%27EMPREINTES"
                                    >
                                        {t("catalogue.nav.impressionTaking")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D%27EMPREINTES/DUPLICATAS"
                                            >
                                                {t("catalogue.nav.duplicates")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D%27EMPREINTES/DUPLICATAS%20ET%20ANALOGUES%20NUMERIQUES"
                                            >
                                                {t("catalogue.nav.duplicatesDigitalAnalogs")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D%27EMPREINTES/SCAN%20BODY"
                                            >
                                                {t("catalogue.nav.scanBody")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D%27EMPREINTES/TRANSFERTS%20ET%20VIS%20DE%20TRANSFERT"
                                            >
                                                {t("catalogue.nav.transfersAndScrews")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20%2F%20S%20%2F%20S%2B%20%2F%20N/PRISE%20D'EMPREINTES/BIOSCANHEALER"
                                            >
                                                {t("catalogue.nav.bioscanhealer")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL">
                                KONTACT PERIO LEVEL
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS"
                                    >
                                        {t("catalogue.nav.abutments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/DROITS"
                                            >
                                                {t("catalogue.nav.straight")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/ANGULES"
                                            >
                                                {t("catalogue.nav.angled")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/CONIQUES"
                                            >
                                                {t("catalogue.nav.conical")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/%20CAD%20%2F%20CAM%20TI-BASE"
                                            >
                                                {t("catalogue.nav.cadCamTiBase")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/PROVISOIRES"
                                            >
                                                {t("catalogue.nav.provisional")}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS/AMOVIBLE"
                                            >
                                                {t("catalogue.nav.removable")}
                                            </Link>
                                        </li>

                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS%20SSA"
                                    >
                                        {t("catalogue.nav.ssaAbutments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PILIERS%20SSA/SSA%20DIRECT%20IMPLANT"
                                            >
                                                {t("catalogue.nav.ssaDirectImplant")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/INSTRUMENTS"
                                    >
                                        {t("catalogue.children.instruments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/INSTRUMENTS/MANDRINS"
                                            >
                                                {t("catalogue.nav.mandrels")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/ACCASTILLAGE%20PROTHETIQUE">
                                        {t("catalogue.nav.prostheticFittings")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/ACCASTILLAGE%20PROTHETIQUE/COIFFES%20DE%20CICATRISATION%20POUR%20PILIERS%20CONIQUES"
                                            >
                                                {t("catalogue.nav.healingCapsForConical")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/ACCASTILLAGE%20PROTHETIQUE/GAINES"
                                            >
                                                {t("catalogue.nav.sleeves")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/ACCASTILLAGE%20PROTHETIQUE/VIS%20%28DE%20PILIER%2C%20POUR%20VISSAGE%20ANGULE%29"
                                            >
                                                {t("catalogue.nav.abutmentScrews")}
                                            </Link>
                                        </li>
                                    </ul>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PRISE%20D%27EMPREINTES"
                                        >
                                            {t("catalogue.nav.impressionTaking")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PRISE%20D%27EMPREINTES/DUPLICATAS"
                                                >
                                                    {t("catalogue.nav.duplicates")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PRISE%20D%27EMPREINTES/SCAN%20BODY"
                                                >
                                                    {t("catalogue.nav.scanBody")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20PERIO%20LEVEL/PRISE%20D%27EMPREINTES/TRANSFERTS%20ET%20VIS%20DE%20TRANSFERT"
                                                >
                                                    {t("catalogue.nav.transfersAndScrews")}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE">
                                {t("catalogue.children.zircone").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PILIERS"
                                    >
                                        {t("catalogue.nav.abutments")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PILIERS/CLASSIQUE"
                                            >
                                                {t("catalogue.nav.classic")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PILIERS/ZERABASE"
                                            >
                                                {t("catalogue.nav.zerabase")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PILIERS/PILIERS%20PROVISOIRES"
                                            >
                                                {t("catalogue.nav.provisionalAbutments")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/ACCASTILLAGE%20PROTHETIQUE">
                                        {t("catalogue.nav.prostheticFittings")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/ACCASTILLAGE%20PROTHETIQUE/VIS%20%28DE%20PILIER%2C%20POUR%20VISSAGE%20ANGULE%29">

                                                {t("catalogue.nav.abutmentScrewsAlt")}
                                            </Link>
                                        </li>
                                    </ul>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/KIT"
                                        >
                                            {t("catalogue.nav.kit")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/KIT/PLATEAU%20PROTHESE"
                                                >
                                                    {t("catalogue.nav.prosthesisTray")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/KIT/SET%20COMPLET"
                                                >
                                                    {t("catalogue.nav.completeSet")}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PRISE%20D%27EMPREINTES"
                                        >
                                            {t("catalogue.nav.impressionTaking")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PRISE%20D%27EMPREINTES/DUPLICATAS"
                                                >
                                                    {t("catalogue.nav.duplicates")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PRISE%20D%27EMPREINTES/SCAN%20BODY"
                                                >
                                                    {t("catalogue.nav.scanBody")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/PRISE%20D%27EMPREINTES/TRANSFERTS%20ET%20VIS%20DE%20TRANSFERT"
                                                >
                                                    {t("catalogue.nav.transfersAndScrews")}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/ZIRCONE/CLE"
                                        >
                                            {t("catalogue.nav.key")}
                                        </Link>
                                    </li>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC">
                                KONTACT MONOBLOC
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/ACCASTILLAGE%20PROTHETIQUE">
                                        {t("catalogue.nav.prostheticFittings")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/ACCASTILLAGE%20PROTHETIQUE/GAINES">

                                                {t("catalogue.nav.sleeves")}
                                            </Link>
                                        </li>
                                    </ul>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/INSTRUMENTS"
                                        >
                                            {t("catalogue.children.instruments")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/INSTRUMENTS/MANDRINS%20POUR%20PILIER%20CONIQUE"
                                                >
                                                    {t("catalogue.nav.mandrelsForConical")}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link
                                            to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/PRISE%20D%27EMPREINTES"
                                        >
                                            {t("catalogue.nav.impressionTaking")}
                                        </Link>
                                        <ul className="sub-menu--mega__list__second-level">
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/PRISE%20D%27EMPREINTES/DUPLICATAS">
                                                    {t("catalogue.nav.duplicates")}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/catalogue/SOLUTIONS%20PROTHETIQUES/KONTACT%20MONOBLOC/PRISE%20D%27EMPREINTES/TRANSFERTS%20ET%20VIS%20DE%20TRANSFERT/">
                                                    {t("catalogue.nav.transfersAndScrews")}
                                                </Link>
                                            </li>
                                        </ul>

                                    </li>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 4)}>
                        {t("catalogue.families.genericSolutions").toUpperCase()} {subMenuState[4] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-2 ${subMenuState[4] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">


                            <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF">
                                SSA-GF
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF/SUR%20NOBEL">
                                        {t("catalogue.nav.onNobel")}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF/SUR%20STRAUMANN">
                                        {t("catalogue.nav.onStraumann")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF/SUR%20STRAUMANN/RC">
                                                RC
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF/SUR%20STRAUMANN/RP">
                                                RP
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/catalogue/SOLUTIONS%20GENERIQUES/SSA-GF/SUR%20STRAUMANN/WP">
                                                WP
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <ul className="sub-menu--mega__columns2">
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/ANTHOGYR">
                                        ANTHOGYR
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/ASTRA">
                                        ASTRA
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/BIOMET">
                                        BIOMET
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/DENTAURUM">
                                        DENTAURUM
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/INSTRUMENTS">
                                        {t("catalogue.children.instruments").toUpperCase()}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20ACTIVE">
                                        NOBEL ACTIVE
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20BRANEMARK">
                                        NOBEL BRANEMARK
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/NOBEL%20REPLACE">
                                        NOBEL REPLACE
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/STRAUMANN">
                                        STRAUMANN
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/TEKKA%20IN%20KONE">
                                        TEKKA IN KONE
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/TEKKA%20PROGRESS">
                                        TEKKA PROGRESS
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20GENERIQUES/ZIMMER">
                                        ZIMMER
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 5)}>
                        {t("catalogue.families.equipment").toUpperCase()} {subMenuState[5] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-5 ${subMenuState[5] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/EQUIPEMENT/LIGNES%20IRRIGATION">
                                {t("catalogue.children.irrigationLines").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/EQUIPEMENT/LIGNES%20IRRIGATION/PRODUITS%20ADAPTABLES">
                                        {t("catalogue.nav.adaptableProducts")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/EQUIPEMENT/LIGNES%20IRRIGATION/PRODUITS%20ORIGINAUX"
                                    >
                                        {t("catalogue.nav.originalProducts")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/EQUIPEMENT/MOTEURS%20DE%20CHIRURGIE">
                                {t("catalogue.children.surgicalMotors").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/EQUIPEMENT/MOTEURS%20DE%20CHIRURGIE/BIOPOWER">
                                        {t("catalogue.nav.biopower")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/EQUIPEMENT/MOTEURS%20DE%20CHIRURGIE/PIEZO%20CHIRURGIE"
                                    >
                                        {t("catalogue.nav.piezoSurgery")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/EQUIPEMENT/MESURE%20DE%20L%27ISQ">
                                {t("catalogue.nav.isqMeasurement").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/EQUIPEMENT/MESURE%20DE%20L%27ISQ/MULTIPEG">
                                        {t("catalogue.nav.multipeg")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/EQUIPEMENT/MESURE%20DE%20L%27ISQ/OSSEO%20100%2B"
                                    >
                                        {t("catalogue.nav.osseo100Plus")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/EQUIPEMENT/VISSEUSE%20ELECTRIQUE">
                                {t("catalogue.nav.electricScrewdriver").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/EQUIPEMENT/VISSEUSE%20ELECTRIQUE/ISD900">
                                        {t("catalogue.nav.isd900")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/EQUIPEMENT/VITAMINE%20D">
                                {t("catalogue.children.vitaminD").toUpperCase()}
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="#" onClick={(e) => displaySubmenu(e, 6)}>
                        {t("catalogue.families.regenerationSolutions").toUpperCase()} {subMenuState[6] ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </Link>

                    <ul className={`sub-menu sub-menu--mega sub-menu--mega--column-6 ${subMenuState[6] ? `d-flex` : 'd-none'}`}
                        onMouseLeave={hideMenu} onClick={hideMenu}>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES">
                                {t("catalogue.children.boneGrafts").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES">
                                        {t("catalogue.nav.xenografts")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES/COLLAPAT">
                                                {t("catalogue.nav.collapat")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES/CERABONE">
                                                {t("catalogue.nav.cerabone")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES/CERABONE%2B">
                                                {t("catalogue.nav.ceraboneplus")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES/MINEROSS%20X">
                                                {t("catalogue.nav.minerossX")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/XENOGREFFES/MINEROSS%20XP">
                                                {t("catalogue.nav.minerossXP")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES">
                                        {t("catalogue.nav.synthetic")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES/GUIDOR%20EASY-GRAFT%20CLASSIC%20%2B">
                                                {t("catalogue.nav.guidorClassicPlus")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES/GUIDOR%20EASY-GRAFT%20CRYSTAL">
                                                {t("catalogue.nav.guidorCrystal")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES/GUIDOR%20EASY-GRAFT%20CRYSTAL%20%2B">
                                                {t("catalogue.nav.guidorCrystalPlus")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES/MAXRESORB">
                                                {t("catalogue.nav.maxresorb")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/GREFFES%20OSSEUSES/SYNTHETIQUES/MAXRESORB%20INJECT">
                                                {t("catalogue.nav.maxresorbInject")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES">
                                {t("catalogue.children.membranesMatrices").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/XENOGREFFES">
                                        {t("catalogue.nav.xenografts")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/XENOGREFFES/NEA%20COVA">
                                                {t("catalogue.nav.neaCova")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/XENOGREFFES/JASON">
                                                {t("catalogue.nav.jason")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/XENOGREFFES/COLLPROTECT">
                                                {t("catalogue.nav.collprotect")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/SYNTHETIQUES">
                                        {t("catalogue.nav.synthetic")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/SYNTHETIQUES/PERMAMEM">
                                                {t("catalogue.nav.permamem")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/GAMME%20MAGNESIUM">
                                        {t("catalogue.nav.gammeMagnesium")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/GAMME%20MAGNESIUM/NOVAMAG">
                                                {t("catalogue.nav.novamag")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/GAMME%20MAGNESIUM/VIS">
                                                {t("catalogue.nav.screws")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/GAMME%20MAGNESIUM/INSTRUMENTS">
                                                {t("catalogue.children.instruments")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/MATRICES%20DE%20RECONSTRUCTION%20TISSULAIRE">
                                        {t("catalogue.nav.tissueReconstructionMatrices")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/MATRICES%20DE%20RECONSTRUCTION%20TISSULAIRE/MUCODERM">
                                                {t("catalogue.nav.mucoderm")}
                                            </Link>
                                        </li>
                                    </ul>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/MEMBRANES%20ET%20MATRICES/MATRICES%20DE%20RECONSTRUCTION%20TISSULAIRE/NOVOMATRIX">
                                                {t("catalogue.nav.novomatrix")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link
                                to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES">
                                {t("catalogue.children.hemostaticDevices").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES/CONES">
                                        {t("catalogue.nav.cones")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES/CONES/COLLACONE">
                                                {t("catalogue.nav.collacone")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES/EPONGES">
                                        {t("catalogue.nav.sponges")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/DISPOSITIFS%20HEMOSTATIQUES/EPONGES/COLLAFLEECE">
                                                {t("catalogue.nav.collafleece")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link
                                to="/catalogue/SOLUTIONS%20REGENERATRICES/REGENERATION%20OSSEUSE">
                                {t("catalogue.nav.boneRegeneration").toUpperCase()}
                           </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/regeneration/regeneration-osseuse-modelisee/"
                                       target="_blank">
                                        {t("catalogue.children.modeledBoneRegen")}
                                    </a>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/regeneration/regeneration-osseuse-modelisee/"
                                               target="_blank">
                                                {t("catalogue.nav.your3DCage")}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/catalogue/SOLUTIONS%20REGENERATRICES/REGENERATION%20OSSEUSE/REGENERATION%20OSSEUSE%20PERI-IMPLANTAIRE">
                                        {t("catalogue.nav.periImplantBoneRegen")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/REGENERATION%20OSSEUSE/REGENERATION%20OSSEUSE%20PERI-IMPLANTAIRE/SPIDERGRAFT">
                                                {t("catalogue.nav.spiderGraft")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/laser/photobiomodulation/"
                               target="_blank">
                                {t("catalogue.children.photobiomodulation").toUpperCase()}
                            </a>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <a href="https://pro.biotech-dental.com/professionnel-sante-produits-et-solutions/laser/photobiomodulation/"
                                       target="_blank">
                                        {t("catalogue.nav.atp38")}
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="sub-menu--mega__title">
                            <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE">
                                {t("catalogue.children.hyaluronicAcid").toUpperCase()}
                            </Link>
                            <ul className="sub-menu--mega__list">
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS">
                                        {t("catalogue.nav.fillers")}
                                    </Link>
                                    <ul className="sub-menu--mega__list__second-level">
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS/PLURYAL%20CLASSIC">
                                                {t("catalogue.nav.pluryalClassic")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS/PLURYAL%20VOLUME">
                                                {t("catalogue.nav.pluryalVolume")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS/PLURYAL%20LIDOCAINE%20CLASSIC">
                                                {t("catalogue.nav.pluryalLidocaineClassic")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS/PLURYAL%20LIDOCAINE%20VOLUME">
                                                {t("catalogue.nav.pluryalLidocaineVolume")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/FILLERS/PLURYAL%20BIOVOLUME">
                                                {t("catalogue.nav.pluryalBiovolume")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/catalogue/SOLUTIONS%20REGENERATRICES/ACIDE%20HYALURONIQUE/CANULES">
                                        {t("catalogue.nav.cannulas")}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="/catalogue/ORAL%20CARE">
                        {t("catalogue.nav.oralCare").toUpperCase()}
                    </Link>
                </li>
            </ul>
        </nav>);
};

export default NewCatalogue;
