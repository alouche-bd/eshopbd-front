import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import logoBdWhite from "../../../assets/img/logos/logo_white.png";
import logoBdBlack from "../../../assets/img/logos/logo_black.png";
import {
    IoIosCart,
    IoIosHeartEmpty,
    IoIosMenu,
    IoIosSearch,
    IoLogoFacebook,
    IoLogoInstagram,
    IoLogoLinkedin,
    IoLogoYoutube,
    IoMdPerson
} from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import {cartSelector, getTotals,} from "../../../features/cart/cartSlice";
import {wishlistSelector,} from "../../../features/wishlist/wishlistSlice";
import {productsSelector, setSearchBarClose, setSearchBarOpen,} from "../../../features/products/ProductsSlice";
import {authSelector} from "../../../features/auth/authSlice";
import {isAdvInter, isDistributor} from "../../constants/userTypes";
import LanguageSwitcher from "./elements/LanguageSwitcher";
import {Container, Row} from "react-bootstrap";
import MobileMenu from "./elements/MobileMenu";
import SearchOverlay from "./elements/SearchOverlay";
import CartOverlay from "./elements/CartOverlay";
import WishlistOverlay from "./elements/WishlistOverlay";
import ProductsSearch from "../../../features/products/ProductsSearch";
import NewCatalogue from "./elements/NewCatalogue";

const Header = () => {
    const location = useLocation();

    const cart = useSelector(cartSelector);

    const wishlist = useSelector(wishlistSelector);

    const dispatch = useDispatch();

    const {searchBarOpen} = useSelector(productsSelector)

    // Distributors get sent to their dedicated ordering page from the cart icon.
    const {user} = useSelector(authSelector);
    const cartHref = isDistributor(user) ? "/distributor" : "/cart";

    const [scroll, setScroll] = useState(0);
    const [headerTop, setHeaderTop] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [offCanvasMobileMenuActive, setOffCanvasMobileMenuActive] = useState(
        false
    );
    const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);
    const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
    const [offCanvasWishlistActive, setOffCanvasWishlistActive] = useState(false);

    window.addEventListener('resize', function () {
        if (window.matchMedia("(max-width: 992px)").matches) {
            dispatch(setSearchBarClose())
        }
    });

    useEffect(() => {
        const header = document.querySelector("header");
        setHeaderTop(header.offsetTop);
        setHeaderHeight(header.offsetHeight);
        window.addEventListener("scroll", handleScroll);
        scroll > headerTop
            ? (document.body.style.paddingTop = `${headerHeight}px`)
            : (document.body.style.paddingTop = 0);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        dispatch(getTotals());
    }, [cart.cartItems, dispatch]);


    const handleScroll = () => {
        setScroll(window.scrollY);
    };

    useEffect(() => {
        if (searchBarOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // cleanup in case component unmounts while open
        return () => document.body.classList.remove("overflow-hidden");
    }, [searchBarOpen]);

    return (
        <>
            <header
                className={`topbar-shadow ${scroll > headerTop ? "is-sticky" : location.pathname === "/" ? "transparent-style" : ""}`}
            >
                <div className="header-top-area space-pt--10 space-pb--10 d-none d-lg-block">
                    <Container className="wide">
                        <div className="header-top">
                            <div className="header-top__left">
                                {/* <div className="language-change change-dropdown">
                                    <span>Français</span> <IoIosArrowDown/>
                                    <ul>
                                        <li>
                                            <button>English</button>
                                        </li>
                                    </ul>
                                </div>
                                <span className="header-separator">|</span>*/}
                                <div className="top-social-icons">
                                    <ul>
                                        <li>
                                            <a href="https://fr-fr.facebook.com/GroupeBiotechDental/" target="_blank"
                                               rel="noreferrer">
                                                <IoLogoFacebook/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com/biotechdental/?hl=fr" target="_blank"
                                               rel="noreferrer">
                                                <IoLogoInstagram/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.youtube.com/channel/UC1hN7vhPr-5x-ELahIK2GkA"
                                               target="_blank" rel="noreferrer">
                                                <IoLogoYoutube/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://fr.linkedin.com/company/biotech-dental" target="_blank"
                                               rel="noreferrer">
                                                <IoLogoLinkedin/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="header-top__right" style={{display: "flex", alignItems: "center", gap: 16}}>
                                <LanguageSwitcher/>
                                <a href="https://www.biotechgalaxy.com/">
                                    LaGalaxy Biotech Dental
                                </a>
                            </div>
                        </div>
                    </Container>
                </div>
                <div className={`header-bottom-area border-bottom--grey ${(isDistributor(user) || isAdvInter(user)) ? "py-2" : "pt-lg-4 pb-lg-4"}`}>
                    <div className="wide container">
                        <Row className={`${scroll > headerTop ? "d-none" : "d-flex justify-content-center"}`}
                        >
                            <div className={`header-content__logo__desktop space-pr--15 text-center ${(isDistributor(user) || isAdvInter(user)) ? "mb-2" : "mb-5"}`}>
                                <Link to="/">
                                    <img
                                        src={scroll > headerTop ? logoBdBlack : location.pathname === "/" ? logoBdWhite : logoBdBlack}
                                        className="img-fluid"
                                        alt="Logo Biotech Dental"
                                    />
                                </Link>
                            </div>
                        </Row>
                        <Row>
                            <div className={`d-flex justify-content-end header-content__icons space-pl--15 ${(isDistributor(user) || isAdvInter(user)) ? "mb-0" : "mb-4"}`}>
                                {searchBarOpen ? (
                                    <ProductsSearch scrolled={scroll > headerTop}/>
                                ) : (
                                    <>
                                        <ul className="d-none d-lg-block">
                                            {/* ADV_INTER role: only the account icon is exposed; no
                                                catalogue search, no wishlist, no cart. */}
                                            {location.pathname !== "/recap" && !isDistributor(user) && !isAdvInter(user) ?
                                                <li>
                                                    <button
                                                        onClick={() => dispatch(setSearchBarOpen())}
                                                    >
                                                        <IoIosSearch/>
                                                    </button>
                                                </li>
                                                : null}
                                            <li>
                                                <Link
                                                    to="/profile/account"
                                                >
                                                    <IoMdPerson/>
                                                </Link>
                                            </li>
                                            {!isAdvInter(user) && (
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setOffCanvasWishlistActive(true);
                                                            document
                                                                .querySelector("body")
                                                                .classList.add("overflow-hidden");
                                                        }}
                                                    >
                                                        <IoIosHeartEmpty/>
                                                        {wishlist.wishlistTotal > 0 ? (
                                                            <span className="count">
                          {wishlist.wishlistItems.length ? wishlist.wishlistItems.length : ""}
                        </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </button>
                                                </li>
                                            )}
                                            {!isAdvInter(user) && (
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setOffCanvasCartActive(true);
                                                            document
                                                                .querySelector("body")
                                                                .classList.add("overflow-hidden");
                                                        }}
                                                    >
                                                        <IoIosCart/>
                                                        {cart.cartTotalQuantity > 0 ? (
                                                            <span className="count">
                          {cart.cartTotalQuantity ? cart.cartTotalQuantity : ""}
                        </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                        <ul className="d-block d-lg-none">
                                            {!isAdvInter(user) && (
                                                <li>
                                                    <Link
                                                        to="/whishlist"
                                                    >
                                                        <IoIosHeartEmpty/>
                                                        {wishlist.wishlistTotal > 0 ? (
                                                            <span className="count">
                        {wishlist.wishlistItems.length ? wishlist.wishlistItems.length : ""}
                          </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Link>
                                                </li>
                                            )}
                                            {!isAdvInter(user) && (
                                                <li>
                                                    <Link
                                                        to={cartHref}
                                                    >
                                                        <IoIosCart/>
                                                        {cart.cartTotalQuantity > 0 ? (
                                                            <span className="count">
                            {cart.cartTotalQuantity ? cart.cartTotalQuantity : ""}
                          </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <button onClick={() => setOffCanvasMobileMenuActive(true)}>
                                                    <IoIosMenu/>
                                                </button>
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        </Row>
                    </div>
                    {/* The bottom container holds the second (mega-menu-anchored) logo
                        and the catalogue mega-menu. Distributors and ADV_INTER staff
                        don't browse the public catalogue, so this whole block is
                        empty space for them — hide it entirely. */}
                    {!isDistributor(user) && !isAdvInter(user) && (
                        <Container className="wide">
                            <div
                                className="header-content d-flex align-items-center justify-content-between position-relative space-py-mobile-only--30">
                                <div className="header-content__logo space-pr--15">
                                    <Link to="/">
                                        <img
                                            src={scroll > headerTop ? logoBdBlack : location.pathname === "/" ? logoBdWhite : logoBdBlack}
                                            className="img-fluid w-75"
                                            alt="Logo Biotech Dental"
                                        />
                                    </Link>
                                </div>
                                <NewCatalogue/>
                            </div>
                        </Container>
                    )}
                </div>

            </header>

            {/* search overlay */}
            <SearchOverlay
                activeStatus={offCanvasSearchActive}
                getActiveStatus={setOffCanvasSearchActive}
            />

            {/* cart overlay */}
            <CartOverlay
                activeStatus={offCanvasCartActive}
                getActiveStatus={setOffCanvasCartActive}
                cartTotalAmount={cart.cartTotalAmount}
                cartItems={cart.cartItems}
            />

            {/* wishlist overlay */}
            <WishlistOverlay
                activeStatus={offCanvasWishlistActive}
                getActiveStatus={setOffCanvasWishlistActive}
                wishlistItems={wishlist.wishlistItems}
                wishlistTotal={wishlist.wishlistTotal}
            />

            <MobileMenu
                activeStatus={offCanvasMobileMenuActive}
                getActiveStatus={setOffCanvasMobileMenuActive}
            />

        </>
    );
};

export default Header;
