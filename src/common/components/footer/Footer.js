import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {FaFacebookF, FaInstagram, FaLinkedin, FaYoutube} from "react-icons/fa";
import {IoIosArrowRoundUp, IoIosAt, IoIosCall, IoIosMap, IoMdGlobe} from "react-icons/io";
import {animateScroll} from "react-scroll";
import logoBdWhite from "../../../assets/img/logos/logo_white.png";
import {Link} from "react-router-dom";
import CGV from "../../../assets/pdf/cgv.pdf";
import smileys from "../../../assets/pdf/smileys.pdf";
import mentions from "../../../assets/pdf/mentions_legales.pdf";

const FooterTwo = ({footerBgClass}) => {
    const {t} = useTranslation();
    const [scroll, setScroll] = useState(0);
    const [top, setTop] = useState(0);

    useEffect(() => {
        setTop(100);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        animateScroll.scrollToTop({duration: 0});
    };

    const handleScroll = () => {
        setScroll(window.scrollY);
    };

    return (
        <footer
            className={`space-pt--100 space-pb--50 ${
                footerBgClass ? footerBgClass : "bg-color--black"
            }`}
        >
            <Container className="wide">
                <Row>
                    <Col className="footer-single-widget space-mb--50">
                        <div className="logo space-mb--35">
                            <Link to="/">
                                <img src={logoBdWhite} className="img-fluid" alt="Biotech Dental"/>
                            </Link>
                        </div>
                    </Col>

                    <Col className="footer-single-widget space-mb--50">
                        <h5 className="footer-single-widget__title">{t("footer.contactTitle")}</h5>
                        <hr className="solid"/>
                        <nav className="footer-single-widget__nav">
                            <ul>
                                <li>
                                    <a href="/#"><IoIosMap/> {t("footer.addressLine1")}<br/>{t("footer.addressLine2")}</a>
                                </li>
                                <li>
                                    <a href="tel:+33490446060" target="_blank" rel="noreferrer">
                                        <IoIosCall/> +33 4 90 44 60 60
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@biotech-dental.com" target="_blank" rel="noreferrer">
                                        <IoIosAt/> info@biotech-dental.com
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.biotech-dental.com/" target="_blank" rel="noreferrer">
                                        <IoMdGlobe/> biotech-dental.com
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </Col>

                    <Col className="footer-single-widget space-mb--50">
                        <h5 className="footer-single-widget__title">{t("footer.followTitle")}</h5>
                        <hr className="solid"/>
                        <nav className="footer-single-widget__nav footer-single-widget__nav--social">
                            <ul>
                                <li><a href="https://fr-fr.facebook.com/GroupeBiotechDental/" target="_blank" rel="noreferrer"><FaFacebookF/> Facebook</a></li>
                                <li><a href="https://www.instagram.com/biotechdental/?hl=fr" target="_blank" rel="noreferrer"><FaInstagram/> Instagram</a></li>
                                <li><a href="https://www.youtube.com/channel/UC1hN7vhPr-5x-ELahIK2GkA" target="_blank" rel="noreferrer"><FaYoutube/> Youtube</a></li>
                                <li><a href="https://fr.linkedin.com/company/biotech-dental" target="_blank" rel="noreferrer"><FaLinkedin/> Linkedin</a></li>
                            </ul>
                        </nav>
                    </Col>

                    <Col className="footer-single-widget space-mb--50">
                        <h5 className="footer-single-widget__title">{t("footer.legalTitle")}</h5>
                        <hr className="solid"/>
                        <nav className="footer-single-widget__nav">
                            <ul>
                                <li><a href={mentions} target="_blank" rel="noreferrer">{t("footer.legal")}</a></li>
                                <li><a href={CGV} target="_blank" rel="noreferrer">{t("footer.cgv")}</a></li>
                                <li><a href={smileys} target="_blank" rel="noreferrer">{t("footer.smileys")}</a></li>
                                <li><a href="/#" target="_blank" rel="noreferrer">{t("footer.cookies")}</a></li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
                <Row>
                    <div className="footer-single-widget__copyright">
                        {t("footer.copyright", {year: new Date().getFullYear()})}
                    </div>
                </Row>
            </Container>
            <button
                className={`scroll-top ${scroll > top ? "show" : ""}`}
                onClick={() => scrollToTop()}
            >
                <IoIosArrowRoundUp/>
            </button>
        </footer>
    );
};

export default FooterTwo;
