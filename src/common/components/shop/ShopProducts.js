import {ProductGridListWrapper} from "../../components/ProductThumb";
import {Row} from "react-bootstrap";
import {addToCart, removeFromCart} from "../../../features/cart/cartSlice";
import {addWishlist, removeWishlist} from "../../../features/wishlist/wishlistSlice";
import {useDispatch} from "react-redux";

const ShopProducts = ({products, layout, search}) => {

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const dispatch = useDispatch()

    const handleAddWishlist = (product) => {
        dispatch(addWishlist(product));
    };
    const handleRemoveWishlist = (product) => {
        dispatch(removeWishlist(product));
    };

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    return (
        <div className="shop-products">
            <Row className={layout}>
                <ProductGridListWrapper
                    products={products}
                    bottomSpace="space-mb--50"
                    addToCart={handleAddToCart}
                    addToWishlist={handleAddWishlist}
                    deleteFromWishlist={handleRemoveWishlist}
                    removeFromCart={handleRemoveFromCart}
                    search={search}
                />
            </Row>
        </div>
    );
};

export default ShopProducts;
