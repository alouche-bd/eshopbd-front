import React, {useEffect, useState} from "react";
import {Container} from "@mui/material";
import {useParams} from "react-router";
import {useSeeProductQuery} from "../../app/services/x3Api";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {useDispatch, useSelector} from "react-redux";
import {productsSelector} from "./ProductsSlice";
import {animateScroll} from "react-scroll";
import {getSortedProducts} from "../../common/utils/productsFunctions";
import {Col, Row} from "react-bootstrap";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {Tooltip} from "react-tippy";
import {IoIosHeartEmpty} from "react-icons/io";
import {authSelector} from "../auth/authSlice";
import {importAllImages} from "../../common/utils/helperFunctions";
import ProductModal from "../../common/components/ProductThumb/ProductModal";
import {addToCart, cartSelector, removeFromCart} from "../cart/cartSlice";
import {addWishlist, removeWishlist, wishlistSelector} from "../wishlist/wishlistSlice";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";

const OneProduct = () => {


    const {allProducts} = useSelector(productsSelector);

    const [layout, setLayout] = useState("grid four-column");
    const [sortType, setSortType] = useState("");
    const [sortValue, setSortValue] = useState("");
    const [filterSortType, setFilterSortType] = useState("");
    const [filterSortValue, setFilterSortValue] = useState("");
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);

    const pageLimit = 16;

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };
    const {cartItems} = useSelector(cartSelector)

    const {wishlistItems} = useSelector(wishlistSelector)

    const dispatch = useDispatch()

    const addToWishlist = (product) => {
        dispatch(addWishlist(product));
    };

    const deleteFromWishlist = (product) => {
        dispatch(removeWishlist(product));
    };

    const [modalShow, setModalShow] = useState(false);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const getLayout = (layout) => {
        setLayout(layout);
    };

    const {reference} = useParams();

    const scrollToTop = () => {
        animateScroll.scrollToTop({
            duration: 0
        });
    };

    const {isAuth} = useSelector(authSelector)


    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    };

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    };

    const search = true;

    useEffect(() => {
        let sortedProducts = getSortedProducts(allProducts, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(
            sortedProducts,
            filterSortType,
            filterSortValue
        );
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, allProducts, sortType, sortValue, filterSortType, filterSortValue]);


    const {data, isLoading, isError, originalArgs} =
        useSeeProductQuery(reference);
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

    if (isLoading) return <></>;

    if (!data)
        return (
            <div>
                <p>
                    <CloudOffIcon/>
                    Aucun produit
                </p>
            </div>
        );
    if (isError) return <div>Quelque chose s'est mal passé</div>;

    return (<>
            {data &&
                data.map((product) => {
                    const productPrice = product.puttc;
                    const cartItem = cartItems.filter(
                        (cartItem) => cartItem.reference === product.reference
                    )[0];
                    const wishlistItem = wishlistItems.filter(
                        (wishlistItem) => wishlistItem.reference === product.reference
                    )[0];
                    return (
                        <>
                            <div className="shop-page-content">
                                {/* shop page header */}

                                {/* shop page body */}
                                <div className="shop-page-content__body space-mt--r130 space-mb--r130">
                                    <Container className="wide">
                                        <Row>
                                            <Col lg={12} className="order-1 order-lg-2">
                                                <div className="shop-products">
                                                    <Row className="list">
                                                        <div className="product-list">
                                                            {/*=======  single product image  =======*/}
                                                            <div className="product-list__image">
                                                                <img
                                                                    src={
                                                                        PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                                            ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                                            : PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
                                                                                ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
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
                                                                                    ? () => deleteFromWishlist(product)
                                                                                    : () => addToWishlist(product)
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
                                                                        <span
                                                                            className="main-price">{product.puttc.toFixed(2)} €</span>
                                                                    </div>
                                                                }

                                                                <div className="short-description">
                                                                    {product.reference === '31_322_231_01-2G'
                                                                        ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                                                        :
                                                                        product.reference === '31_323_232_01-2G'
                                                                            ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                                                            :
                                                                            product.designation}
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
                                                                            onClick={() => handleRemoveFromCart(product)}
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
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div>
                            <ProductModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                product={product}
                                productprice={product.puttc}
                                cartitems={cartItems}
                                cartItem={cartItem}
                                wishlistitem={wishlistItem}
                                addtocart={handleAddToCart}
                                removeFromCart={handleRemoveFromCart}
                                addtowishlist={addToWishlist}
                                deletefromwishlist={deleteFromWishlist}
                            />
                        </>
                    )
                })}
        </>
    );
};

export default OneProduct;
