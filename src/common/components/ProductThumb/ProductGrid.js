import {Fragment, useState} from "react";
import {Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {IoIosHeartEmpty, IoIosSearch} from "react-icons/io";
import {Tooltip} from "react-tippy";
import ProductModal from "./ProductModal";
import {importAllImages} from "../../utils/helperFunctions";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";
import {PRODUCT_IMG_BASE} from "../../utils/apiConstants";

const ProductGrid = ({
                         product,
                         productPrice,
                         cartItem,
                         wishlistItem,
                         bottomSpace,
                         addToCart,
                         addToWishlist,
                         deleteFromWishlist,
                         addToast,
                         cartItems,
                         column
                     }) => {

    const {isAuth} = useSelector(authSelector)
    const [modalShow, setModalShow] = useState(false);


    return (<Fragment>
        <Col
            lg={column && column === 4 ? 3 : 4}
            md={6}
            className={bottomSpace ? bottomSpace : ""}
        >
            <div className="product-grid">
                {/*=======  single product image  =======*/}
                <div className="product-grid__image">
                    <Link
                        to="#"
                        className="image-wrap"
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
                                onClick={wishlistItem !== undefined ? () => deleteFromWishlist(product, addToast) : () => addToWishlist(product, addToast)}
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
                                className="d-none d-lg-block"
                            >
                                <IoIosSearch/>
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/*=======  single product content  =======*/}
                <div className="product-grid__content">
                    <div className="title">
                        <h3>
                            <Link
                                to="#"
                            >
                                {product.reference}
                            </Link>
                        </h3>
                        {cartItem !== undefined ?
                            <button disabled>
                                Dans votre panier
                            </button>
                            : <button onClick={() => addToCart(product)}>
                                Ajouter au panier
                            </button>
                        }
                    </div>
                    <div className="short-description">{product.designation}</div>
                    {isAuth && <div className="price">
                        <span className="main-price">{product.puttc.toFixed(2)} €</span>
                    </div>}
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
            cartitem={cartItem}
            wishlistitem={wishlistItem}
            addtocart={addToCart}
            addtowishlist={addToWishlist}
            deletefromwishlist={deleteFromWishlist}
            addtoast={addToast}
        />
    </Fragment>);
};

export default ProductGrid;
