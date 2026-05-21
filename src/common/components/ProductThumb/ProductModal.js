import {Fragment, useState} from "react";
import {Col, Modal, Row} from "react-bootstrap";
import {IoIosHeartEmpty} from "react-icons/io";
import CustomScroll from "react-custom-scroll";
import {importAllImages} from "../../utils/helperFunctions";
import logoBd from "../../../assets/img/logos/hexagone_blanc.png";
import {useDispatch, useSelector} from "react-redux";
import {addAndSetQuantity} from "../../../features/cart/cartSlice";
import {authSelector} from "../../../features/auth/authSlice";
import {PRODUCT_IMG_BASE} from "../../utils/apiConstants";

const ProductModal = (props) => {
    const {
        product,
        wishlistitem,
        addtowishlist,
        deletefromwishlist,
        addtoast,
        cartItem,
        removeFromCart
    } = props;

    const [quantityCount, setQuantityCount] = useState(1);


    const dispatch = useDispatch();

    const {isAuth} = useSelector(authSelector)


    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            className="product-quickview"
            centered
        >
            <Modal.Body>
                <Modal.Header closeButton></Modal.Header>

                <Row>
                    <Col md={5} lg={5} sm={12}>
                        <div className="single-image__modal">
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
                        </div>
                    </Col>


                    <Col md={7} sm={12} className="ml-auto">
                        <CustomScroll allowOuterScroll={true}>
                            <div className="product-quickview__content">
                                <h2 className="product-quickview__title space-mb--20">
                                    {product.reference}
                                </h2>
                                {isAuth && <div className="product-quickview__price space-mb--20">
                                    <span className="main-price">{product.puttc.toFixed(2)} €</span>
                                </div>}

                                <div className="product-quickview__description space-mb--30">
                                    <p>{product.reference === '31_322_231_01-2G'
                                        ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                        :
                                        product.reference === '31_323_232_01-2G'
                                            ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                            :
                                            product.designation}</p>
                                </div>
                                <Fragment>
                                    <div className="product-quickview__quantity space-mb--20">
                                        <div className="product-quickview__quantity__title">
                                            Quantité
                                        </div>
                                        <div className="cart-plus-minus">
                                            <button
                                                onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)}
                                                className="qtybutton"
                                            >
                                                -
                                            </button>
                                            <input
                                                className="cart-plus-minus-box"
                                                type="text"
                                                value={quantityCount}
                                                readOnly
                                            />
                                            <button
                                                onClick={() => setQuantityCount(quantityCount + 1)}
                                                className="qtybutton"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="product-quickview__button-wrapper d-flex align-items-center">
                                        {cartItem !== undefined ?
                                            <button
                                                onClick={() => removeFromCart(product)}
                                                className="lezada-button--green  lezada-button--medium product-quickview__cart space-mr--10"
                                            >
                                                Retirer du panier
                                            </button>
                                            :
                                            <button
                                                onClick={() => dispatch(addAndSetQuantity({
                                                    ...product,
                                                    quantity: quantityCount
                                                }))}
                                                className="lezada-button lezada-button--medium product-quickview__cart space-mr--10"
                                            >
                                                Ajouter au panier
                                            </button>
                                        }
                                        <button
                                            className={`product-quickview__wishlist space-mr--10 ${wishlistitem !== undefined ? "active" : ""}`}
                                            title={wishlistitem !== undefined ? "Added to wishlist" : "Add to wishlist"}
                                            onClick={wishlistitem !== undefined ? () => deletefromwishlist(product, addtoast) : () => addtowishlist(product, addtoast)}
                                        >
                                            <IoIosHeartEmpty/>
                                        </button>

                                    </div>
                                </Fragment>
                            </div>
                        </CustomScroll>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>);
};

export default ProductModal;
