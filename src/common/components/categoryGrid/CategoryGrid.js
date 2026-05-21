import {Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import implant from "../../../assets/img/category/Montage_implants_KPL_paillette.png";
import chirurgie from "../../../assets/img/category/Montage_Kit AtlaSurgery 2_avec_fond.png";
import biomat from "../../../assets/img/category/Image microscope PHOENIX 2016.jpeg"
import prothese from "../../../assets/img/category/miniature-Montage_COMPO-SSA-GF_ombres&reflets_HD.png"
import denteo from "../../../assets/img/category/visuel-principal-DENTEO.jpg"
import piezo from "../../../assets/img/category/1700784-001E.jpg"

const CategoryGrid = ({spaceBottomClass}) => {
    return (
        <div
            className={`product-category-container ${
                spaceBottomClass ? spaceBottomClass : ""
            }`}
        >
            <Container>
                <Row className="row-5 space-mb--n10">
                    <Col lg={6}>
                        <Row className="row-5">
                            <Col lg={12} className="pb-3">
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three">
                                        <img
                                            src={
                                                implant
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25 space-mb--25">
                                        <div className="title">
                                            <p>Solutions implantaires</p>
                                            <Link to="#">
                                                + Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12} className="pb-3">
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three">
                                        <img
                                            src={
                                                chirurgie
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25">
                                        <div className="title">
                                            <p>Instruments Chirurgicaux</p>
                                            <Link to="#">
                                                + Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three darker">
                                        <img
                                            src={
                                                piezo
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25 space-mb--25">
                                        <div className="title">
                                            <p>Équipements</p>
                                            <Link to="#">
                                                + Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={6}>
                        <Row className="row-5">
                            <Col lg={12} className="pb-3">
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three">
                                        <img
                                            src={
                                                biomat
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25">
                                        <div className="title">
                                            <p>Solutions régénératrices</p>
                                            <Link to="#">
                                                + Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12} className="pb-3">
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three">
                                        <img
                                            src={
                                                denteo
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25 space-mb--25">
                                        <div className="title">
                                            <p>Solutions génériques</p>
                                            <Link to="#">
                                                + Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className="single-category single-category--three ">
                                    <div className="single-category__image single-category__image--three">
                                        <img
                                            src={
                                                prothese
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        className="single-category__content single-category__content--three space-mt--25 space-mb--25">
                                        <div className="title">
                                            <p>Solutions prothétiques</p>
                                            <Link to="#">Découvrir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CategoryGrid;