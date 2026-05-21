import {Fragment, useState} from "react";
import {Col} from "react-bootstrap";
import {IoIosCart, IoIosHeartEmpty} from "react-icons/io";
import {Tooltip} from "react-tippy";
import ProductModal from "./ProductModal";
import {importAllImages,} from "../../utils/helperFunctions";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";
import {PRODUCT_IMG_BASE} from "../../utils/apiConstants";

const ProductGridList = ({
                             product,
                             productPrice,
                             cartItem,
                             wishlistItem,
                             compareItem,
                             bottomSpace,
                             addToCart,
                             addToWishlist,
                             deleteFromWishlist,
                             addToast,
                             cartItems,
                             removeFromCart,
                             search
                         }) => {

    const [modalShow, setModalShow] = useState(false);

    const {isAuth} = useSelector(authSelector)

    const returnCatalogue = (product) => {
        const catalogue = Object.values(product.marketing.catalogue1);
        const removeNull = catalogue.filter(element => {
            return element !== null;
        });

        const encodedCatalogue = removeNull.map((level) => (
            encodeURIComponent(level)
        ));
        return encodedCatalogue.join('/')

    }

    return (
        <Fragment>
            <Col lg={3} md={6} className={bottomSpace ? bottomSpace : ""}>
                <div className="product-grid">
                    {/*=======  single product image  =======*/}
                    <div className="product-grid__image">
                        <div
                            className="image-wrap">
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
                        </div>
                        <div className="product-grid__floating-icons">
                            {/* add to wishlist */}
                            <Tooltip
                                position="left"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <button
                                    onClick={
                                        wishlistItem !== undefined
                                            ? () => deleteFromWishlist(product)
                                            : () => addToWishlist(product)
                                    }
                                    className={wishlistItem !== undefined ? "active" : ""}
                                >
                                    <IoIosHeartEmpty/>
                                </button>
                            </Tooltip>

                            {/* quick view */}
                            <Tooltip
                                position="left"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <button
                                    onClick={() => setModalShow(true)}
                                    className={cartItem !== undefined ? "active" : ""}
                                >
                                    <IoIosCart/>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/*=======  single product content  =======*/}
                    <div className="product-grid__content">
                        <div className="title">
                            <h3>
                                {product.reference}
                            </h3>
                        </div>
                        <div className="short-description pb-3">{product.designation}</div>
                        {isAuth &&
                            <div className="price">
                                <span className="main-price">{product.puttc.toFixed(2)} €</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="product-list">
                    {/*=======  single product image  =======*/}
                    <div className="product-list__image">
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
                        <div className="product-list__floating-icons">
                            {/* add to wishlist */}
                            <Tooltip
                                position="left"
                                trigger="mouseenter"
                                animation="shift"
                                arrow={true}
                                duration={200}
                            >
                                <button
                                    onClick={
                                        wishlistItem !== undefined
                                            ? () => deleteFromWishlist(product, addToast)
                                            : () => addToWishlist(product, addToast)
                                    }
                                    className={wishlistItem !== undefined ? "active" : ""}
                                >
                                    <IoIosHeartEmpty/>
                                </button>
                            </Tooltip>

                        </div>
                    </div>

                    {/*=======  single product content  =======*/}
                    <div className="product-list__content">
                        <div className="title">
                            <h3>
                                {product.reference}
                            </h3>
                        </div>
                        {isAuth &&
                            <div className="price">
                                <span className="main-price">{product.puttc.toFixed(2)} €</span>
                            </div>
                        }

                        <div className="short-description">{product.designation}
                            {product.marketing && search && (
                                <div className="cat mt-2">
                                    <p className="fst-italic text-capitalize">
                                        {decodeURIComponent(returnCatalogue(product)).toLowerCase()}
                                    </p>

                                </div>
                            )}
                        </div>

                        <div className="add-to-cart">
                            {/* add to cart */}
                            {cartItem !== undefined ?
                                <button
                                    onClick={() => removeFromCart(product)}
                                    className="lezada-button--green lezada-button--medium"
                                >
                                    Retirer du panier
                                </button>
                                :
                                <button
                                    onClick={() => setModalShow(true)}
                                    className="lezada-button lezada-button--medium"
                                >
                                    Ajouter au panier
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </Col>
            {/* product modal */}
            <ProductModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                product={product}
                productprice={productPrice}
                cartitems={cartItems}
                cartItem={cartItem}
                wishlistitem={wishlistItem}
                compareitem={compareItem}
                addtocart={addToCart}
                removeFromCart={removeFromCart}
                addtowishlist={addToWishlist}
                deletefromwishlist={deleteFromWishlist}
                addtoast={addToast}
            />
        </Fragment>
    );
};

export default ProductGridList;
