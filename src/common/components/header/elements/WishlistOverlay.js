import {Link} from "react-router-dom";
import {IoIosClose} from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {removeWishlist} from "../../../../features/wishlist/wishlistSlice";
import {importAllImages} from "../../../utils/helperFunctions";
import logoBd from "../../../../assets/img/logos/hexagone_blanc.png";
import {PRODUCT_IMG_BASE} from "../../../utils/apiConstants";

const WishlistOverlay = ({
                             activeStatus,
                             getActiveStatus,
                             wishlistItems,
                         }) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const handleRemoveWishlist = (product) => {
        dispatch(removeWishlist(product));
    };


    return (
        <div className={`wishlist-overlay ${activeStatus ? "active" : ""}`}>
            <div
                className="wishlist-overlay__close"
                onClick={() => {
                    getActiveStatus(false);
                    document.querySelector("body").classList.remove("overflow-hidden");
                }}
            />
            <div className="wishlist-overlay__content">
                {/*=======  close icon  =======*/}
                <button
                    className="wishlist-overlay__close-icon"
                    onClick={() => {
                        getActiveStatus(false);
                        document.querySelector("body").classList.remove("overflow-hidden");
                    }}
                >
                    <IoIosClose/>
                </button>
                {/*=======  offcanvas wishlist content container  =======*/}
                <div className="wishlist-overlay__content-container">
                    <h3 className="wishlist-title">{t("wishlists.sidebarTitle")}</h3>
                    {wishlistItems.length >= 1 ? (
                        <div className="wishlist-product-wrapper">
                            <div className="wishlist-product-container">
                                <CustomScroll allowOuterScroll={true}>
                                    {wishlistItems.map((product, i) => {
                                        return (
                                            <div className="single-wishlist-product" key={i}>
                        <span className="wishlist-close-icon">
                          <button
                              onClick={() =>
                                  handleRemoveWishlist(product)
                              }
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
                                                            className="img-fluid"
                                                            alt={product.reference}
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
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CustomScroll>
                            </div>
                            {/*=======  wishlist buttons  =======*/}
                            <div className="wishlist-buttons">
                                <Link
                                    to="/whishlist"
                                    onClick={() => {
                                        getActiveStatus(false);
                                        document.querySelector("body").classList.remove("overflow-hidden");
                                    }}
                                >
                                    {t("wishlists.sidebarGoToWishlist")}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        t("wishlists.sidebarEmpty")
                    )}
                </div>
            </div>
        </div>
    );
};


export default WishlistOverlay;
