import {Link} from "react-router-dom";
import {importAllImages} from "../../utils/helperFunctions";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";
import {PRODUCT_IMG_BASE} from "../../utils/apiConstants";

const ProductWidget = ({
                           product,
                           cartItem,
                           addToCart,
                           addToast,
                           sliderClass
                       }) => {

    const {isAuth} = useSelector(authSelector)

    return (
        <div
            className={`single-widget-product-wrapper ${
                sliderClass ? sliderClass : ""
            }`}
        >
            <div className="single-widget-product">
                <div className="single-widget-product__image">
                    <Link
                        to="#" className="image-wrap"
                    >
                        <img
                            src={
                                PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".jpg"
                                    ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".jpg"
                                    : PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".png"
                                        ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '-') + ".png"
                                        : logoBd
                            }
                            className="responsive-image__image popup_cart_image pr_img_custom_attr lazyautosizes ls-is-cached lazyloaded"
                            alt={product.reference}
                        />
                    </Link>
                </div>
                <div className="single-widget-product__content">
                    <div className="single-widget-product__content__top">
                        <h3 className="product-title space-mb--10">
                            <Link
                                to="#"
                            >
                                {product.reference}
                            </Link>
                        </h3>
                        {isAuth &&
                            <div className="price space-mb--10">
                                <span className="main-price">{product.puttc.toFixed(2)} €</span>
                            </div>
                        }
                        <div className="short-description">{product.designation}</div>
                    </div>
                    <div className="single-widget-product__content__bottom">
                        {/* add to cart */}
                        <button
                            onClick={() => addToCart(product, addToast)}
                            disabled={
                                cartItem !== undefined && cartItem.quantity >= cartItem.stock
                            }
                            className="cart-btn"
                        >
                            {cartItem !== undefined ? "Added to cart" : "Add to cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductWidget;
