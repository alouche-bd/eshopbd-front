import {Col, Container, Row} from "react-bootstrap";
import {MdApps, MdList, MdViewComfy} from "react-icons/md";
import {useTranslation} from "react-i18next";
import {setActiveLayout} from "../../utils/productsFunctions";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";

const ShopHeader = ({
                        getFilterSortParams,
                        getLayout,
                        layoutClass,
                        listMode
                    }) => {

    const {t} = useTranslation();
    const {isAuth} = useSelector(authSelector);

    return (
        <div className="shop-header">
            <Container className={layoutClass ? layoutClass : ""}>
                <Row className="align-items-center">
                    <Col md={5} className="text-center text-md-left">
                    </Col>

                    <Col md={7}>
                        <div className="shop-header__filter-icons justify-content-center justify-content-md-end">
                            <div className="single-icon filter-dropdown">
                                <select
                                    onChange={(e) =>
                                        getFilterSortParams("filterSort", e.target.value)
                                    }
                                >
                                    <option value="default">{t("catalogue.sort.default")}</option>
                                    {isAuth && (
                                        <option value="priceHighToLow">{t("catalogue.sort.priceHighToLow")}</option>)}
                                    {isAuth && (
                                        <option value="priceLowToHigh">{t("catalogue.sort.priceLowToHigh")}</option>)}
                                    <option value="refHighToLow">{t("catalogue.sort.refHighToLow")}</option>
                                    <option value="refLowToHigh">{t("catalogue.sort.refLowToHigh")}</option>

                                </select>
                            </div>

                            <div className="single-icon grid-icons d-none d-lg-block">
                                <button
                                    onClick={(e) => {
                                        getLayout("grid three-column");
                                        setActiveLayout(e);
                                    }}
                                >
                                    <MdApps/>
                                </button>

                                <button
                                    className="active"
                                    onClick={(e) => {
                                        getLayout("grid four-column");
                                        setActiveLayout(e);
                                    }}
                                >
                                    <MdViewComfy/>
                                </button>
                                {listMode === false ? (
                                    ""
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            getLayout("list");
                                            setActiveLayout(e);
                                        }}
                                    >
                                        <MdList/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ShopHeader;
