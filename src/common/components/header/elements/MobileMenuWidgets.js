import {IoIosAt, IoIosCall, IoIosLogOut, IoMdPerson} from "react-icons/io";

import {FaFacebookF, FaInstagram, FaLinkedin, FaYoutube} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authSelector, logout} from "../../../../features/auth/authSlice";
import {useHistory} from "react-router";
import {clearCart} from "../../../../features/cart/cartSlice";
import {clearWishlist} from "../../../../features/wishlist/wishlistSlice";
import {clearProducts} from "../../../../features/products/ProductsSlice";

const MobileMenuWidgets = ({getActiveStatus}) => {
    const {isAuth} = useSelector(authSelector)

    const dispatch = useDispatch();

    const {push} = useHistory();

    const closeMenu = () => {
        getActiveStatus(false);
        document.querySelector("body").classList.remove("overflow-hidden");
    }

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(clearProducts());
        closeMenu()
        push("/");
    };

    return (<div className="offcanvas-mobile-menu__widgets">
        <div className="contact-widget space-mb--30">
            <ul>
                <li className="mb-5">

                    {isAuth ? <>
                        <IoIosLogOut/>
                        <a
                            href="/#" aria-disabled="true" onClick={handleLogout}
                        >
                            Se déconnecter
                        </a> </> : <>
                        <IoMdPerson/>
                        <Link
                            to="/login"
                            onClick={closeMenu}
                        >
                            Se connecter
                        </Link></>}
                </li>
                <li>
                    <a href="tel:0490446060" target="_blank" rel="noreferrer"><IoIosCall/> 04 90 44 60 60</a>
                </li>
                <li>
                    <a href="mailto:info@biotech-dental.com" target="_blank"
                       rel="noreferrer"><IoIosAt/> info@biotech-dental.com</a>
                </li>
            </ul>
        </div>

        <div className="social-widget">
            <a href="https://fr-fr.facebook.com/GroupeBiotechDental/" target="_blank" rel="noreferrer">
                <FaFacebookF/>
            </a>
            <a href="https://www.instagram.com/biotechdental/?hl=fr" target="_blank" rel="noreferrer">
                <FaInstagram/>
            </a>
            <a href="https://www.youtube.com/channel/UC1hN7vhPr-5x-ELahIK2GkA" target="_blank" rel="noreferrer">
                <FaYoutube/>
            </a>
            <a href="https://fr.linkedin.com/company/biotech-dental" target="_blank"
               rel="noreferrer">
                <FaLinkedin/>
            </a>
        </div>
    </div>);
};

export default MobileMenuWidgets;
