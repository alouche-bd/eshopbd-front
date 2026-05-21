import {Link} from "react-router-dom";
import {IoIosClose} from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {cartSelector, removeFromCart} from "../../../../features/cart/cartSlice";
import {importAllImages} from "../../../utils/helperFunctions";
import logoBd from "../../../../assets/img/logos/hexagone_blanc.png";
import {authSelector} from "../../../../features/auth/authSlice";
import {isDistributor} from "../../../constants/userTypes";
import {PRODUCT_IMG_BASE} from "../../../utils/apiConstants";

const CartOverlay = ({
                         activeStatus,
                         getActiveStatus,
                         cartItems,
                         cartTotalAmount
                     }) => {


    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {isAuth, user} = useSelector(authSelector)

    const {labClient} = useSelector(cartSelector)

    const cartHref = isDistributor(user) ? "/distributor" : "/cart";

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    return (
        <div className={`cart-overlay ${activeStatus ? "active" : ""}`}>
            <div
                className="cart-overlay__close"
                onClick={() => {
                    getActiveStatus(false);
                    document.querySelector("body").classList.remove("overflow-hidden");
                }}
            />
            <div className="cart-overlay__content">
                {/*=======  close icon  =======*/}
                <button
                    className="cart-overlay__close-icon"
                    onClick={() => {
                        getActiveStatus(false);
                        document.querySelector("body").classList.remove("overflow-hidden");
                    }}
                >
                    <IoIosClose/>
                </button>
                {/*=======  offcanvas cart content container  =======*/}
                <div className="cart-overlay__content-container">
                    <h3 className="cart-title">{t("cart.sidebarTitle")}</h3>
                    {labClient ?
                        <h2 className="cart-title">{t("cart.sidebarFor", {company: labClient.company})}</h2>
                        :
                        null}
                    {cartItems.length >= 1 ? (
                        <div className="cart-product-wrapper">
                            <div className="cart-product-container">
                                <CustomScroll allowOuterScroll={true}>
                                    {cartItems.map((product, i) => {
                                        return (
                                            <div className="single-cart-product" key={i}>
                        <span className="cart-close-icon">
                          <button
                              onClick={() => handleRemoveFromCart(product)}
                          >
                            <IoIosClose/>
                          </button>
                        </span>
                                                <div className="image">
                                                    <Link
                                                        to="#"
                                                    >
                                                        <img
                                                            src={
                                                                PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".jpg"
                                                                    ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".jpg"
                                                                    : PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".png"
                                                                        ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".png"
                                                                        : logoBd
                                                            }
                                                            alt={product.reference}
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="content">
                                                    <h5 className="mb-3">
                                                        <Link
                                                            to="#"
                                                        >
                                                            {product.reference}
                                                        </Link>
                                                    </h5>
                                                    <p>
                            <span>
                              {product.reference === '31_322_231_01-2G'
                                  ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                  :
                                  product.reference === '31_323_232_01-2G'
                                      ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                      :
                                      product.designation}
                            </span>
                                                    </p>
                                                    <p className="product-subtotal">
                            <span className="cart-count">
                              {product.cartQuantity} x
                            </span>
                                                        {isAuth &&
                                                            <span className="discounted-price">
                              {product.puttc.toFixed(2)} €
                            </span>}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CustomScroll>
                            </div>
                            {/*=======  subtotal calculation  =======*/}
                            {isAuth &&

                                <p className="cart-subtotal">
                                    <span className="subtotal-title">{t("cart.sidebarSubtotal")}</span>
                                    <span className="subtotal-amount">
                  {cartTotalAmount.toFixed(2)} €
                </span>
                                </p>}
                            {/*=======  cart buttons  =======*/}
                            <div className="cart-buttons">
                                <Link
                                    to={cartHref}
                                    onClick={() => {
                                        getActiveStatus(false);
                                        document.querySelector("body").classList.remove("overflow-hidden");
                                    }}
                                >
                                    {t("cart.sidebarGoToCart")}
                                </Link>
                            </div>
                            {/*=======  info text  =======*/}
                            <p className="free-shipping-text">
                                {t("cart.sidebarNote")}
                            </p>
                        </div>
                    ) : (
                        t("cart.sidebarEmpty")
                    )}
                </div>
            </div>
        </div>
    );
};


export default CartOverlay;
