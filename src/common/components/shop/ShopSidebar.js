import {IoIosSearch} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {
    getIndividualAngul,
    getIndividualCategories,
    getIndividualDiamCol,
    getIndividualDiamCorps,
    getIndividualDiamExt,
    getIndividualhauteur,
    getIndividualLongueur,
    getIndividualTaille,
    setActiveSort,
} from "../../utils/productsFunctions";
import {useRef, useState} from "react";
import useOnClickOutside from "../../utils/useOnClickOutsideRef";

const ShopSidebar = ({products, currentCat, getSortParams, setCurrentPage, currentStringCat}) => {
    const {t} = useTranslation();
    const categories = getIndividualCategories(products, decodeURIComponent(currentCat), currentStringCat);
    const corps = getIndividualDiamCorps(products, decodeURIComponent(currentCat));
    const longueur = getIndividualLongueur(products, decodeURIComponent(currentCat));
    const hauteur = getIndividualhauteur(products, decodeURIComponent(currentCat));
    const col = getIndividualDiamCol(products, decodeURIComponent(currentCat));
    const ext = getIndividualDiamExt(products, decodeURIComponent(currentCat));
    const taille = getIndividualTaille(products, decodeURIComponent(currentCat));
    const angul = getIndividualAngul(products, decodeURIComponent(currentCat));

    const createList = (data) => {
        const entries = Object.entries(data);
        if (entries && entries.length) {
            const ul = []
            entries.forEach(([key, value]) => {
                if (!key.startsWith('niv') && !isPositiveInteger(key)) {
                    const li = [];
                    const children = createList(value);
                    li["level"] = (key);
                    if (children) li["nextlevel"] = (children);
                    ul.push(li);
                }
            });
            return ul;
        }
        return null;
    }

    function isPositiveInteger(str) {
        if (typeof str !== 'string') {
            return false;
        }

        const num = Number(str);

        if (Number.isInteger(num) && num >= 0) {
            return true;
        }

        return false;
    }

    const sortedCat = createList(categories);

    const [subMenuState, setSubMenuState] = useState(false)

    const scrollTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const displaySubmenu = (e, i) => {
        e.preventDefault();
        if (i.niv2) {
            setSubMenuState(true)
        }
    }

    const hideMenu = () => {
        setSubMenuState([false, false])
    }

    const ref = useRef();

    useOnClickOutside(ref, () => setSubMenuState([false, false]));

    return (
        <div className="shop-sidebar">
            <div className="single-sidebar-widget space-mb--40">
                {/* search widget */}
                <div className="search-widget">
                    <form>
                        <input type="search" placeholder={t("catalogue.sidebar.searchPlaceholder")} onChange={(e) => {
                            getSortParams("ref", e.target.value)
                            setCurrentPage(1)
                            setActiveSort(e)
                        }}/>
                        <button type="button">
                            <IoIosSearch/>
                        </button>
                    </form>
                </div>
            </div>
            {/* category list */} {sortedCat && sortedCat.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.category")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("category", "");
                                setCurrentPage(1)
                                setActiveSort(e);
                                scrollTop()
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allCategories")}
                        </button>
                    </li>
                    <ul>
                        {sortedCat.map((item, index) => {
                            return (
                                <li><a className="pt-2 pb-2"
                                       onClick={(e) => {
                                           getSortParams("category", item.level);
                                           setCurrentPage(1)
                                           setActiveSort(e);
                                       }}>{item.level}</a>
                                    {item.nextlevel ?
                                        <ul className="p-2">
                                            {item.nextlevel.map((subitem, i) => {
                                                return (
                                                    <li><a className="p-2" onClick={(e) => {
                                                        getSortParams("category", [item.level, subitem.level]);
                                                        setCurrentPage(1)
                                                        setActiveSort(e);
                                                    }}>{subitem.level}</a>
                                                        {subitem.nextlevel ?
                                                            <ul className="p-2">
                                                                {subitem.nextlevel.map((subsubitem, id) => {
                                                                    return (
                                                                        <li className="px-3"><a
                                                                            onClick={(e) => {
                                                                                getSortParams("category", [item.level, subitem.level, subsubitem.level]);
                                                                                setCurrentPage(1)
                                                                                setActiveSort(e);
                                                                            }}
                                                                        >{subsubitem.level}</a></li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            : null
                                                        }
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        : null
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </ul>
            </div>
        )}

            {/* category list */} {corps.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.bodyDiameter")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("corps", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allBodyDiameters")}
                        </button>
                    </li>
                    {corps.map((corpsI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("corps", corpsI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {corpsI}mm
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

            {/* category list */} {col.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.neckDiameter")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("col", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allNeckDiameters")}
                        </button>
                    </li>
                    {col.map((colI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("col", colI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {colI}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

            {/* category list */} {ext.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.externalDiameter")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("ext", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allExternalDiameters")}
                        </button>
                    </li>
                    {ext.map((extI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("ext", extI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {parseFloat(extI).toFixed(1)}mm
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}
            {/* category list */} {longueur.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.length")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("longueur", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allLengths")}
                        </button>
                    </li>
                    {longueur.map((longueurI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("longueur", longueurI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {parseFloat(longueurI).toFixed(1)}mm
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

            {/* category list */} {angul.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.angulation")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("col", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allAngulations")}
                        </button>
                    </li>
                    {angul.map((colI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("angul", colI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {colI}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

            {/* category list */} {taille.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.size")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("taille", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allSizes")}
                        </button>
                    </li>
                    {taille.map((colI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("taille", colI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {colI}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

            {/* category list */} {hauteur.length > 0 && (
            <div className="single-sidebar-widget space-mb--40">
                <h2 className="single-sidebar-widget__title space-mb--30">
                    {t("catalogue.sidebar.height")}
                </h2>
                <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
                    <li>
                        <button
                            onClick={(e) => {
                                getSortParams("hauteur", "");
                                setCurrentPage(1)
                                scrollTop()
                                setActiveSort(e);
                            }}
                            className="active"
                        >
                            {t("catalogue.sidebar.allHeights")}
                        </button>
                    </li>
                    {hauteur.map((hauteurI, i) => {
                        return (
                            <li key={i}>
                                <button
                                    onClick={(e) => {
                                        getSortParams("hauteur", hauteurI);
                                        setCurrentPage(1)
                                        scrollTop()
                                        setActiveSort(e);
                                    }}
                                >
                                    {parseFloat(hauteurI).toFixed(1)}mm
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}


        </div>
    );
};

export default ShopSidebar;
