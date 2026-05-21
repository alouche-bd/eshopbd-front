import {Fragment} from "react";
import {toast} from "react-hot-toast";
import ProductGrid from "./ProductGrid";
import {useDispatch} from "react-redux";
import {addToCart} from "../../../features/cart/cartSlice";
import {addWishlist, removeWishlist} from "../../../features/wishlist/wishlistSlice";

const ProductGridWrapper = ({
                                products,
                                bottomSpace,
                                cartItems,
                                wishlistItems,
                                column
                            }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleAddWishlist = (product) => {
        dispatch(addWishlist(product));
    };
    const handleRemoveWishlist = (product) => {
        dispatch(removeWishlist(product));
    };

    return (
        <Fragment>
            {products &&
                products.map((product) => {
                    const cartItem = cartItems.filter(
                        (cartItem) => cartItem.reference === product.reference
                    )[0];
                    const wishlistItem = wishlistItems.filter(
                        (wishlistItem) => wishlistItem.reference === product.reference
                    )[0];

                    return (
                        <ProductGrid
                            key={product.id}
                            product={product.reference}
                            productPrice={product.puttc}
                            cartItem={cartItem}
                            wishlistItem={wishlistItem}
                            bottomSpace={bottomSpace}
                            addToCart={handleAddToCart}
                            addToWishlist={handleAddWishlist}
                            deleteFromWishlist={handleRemoveWishlist}
                            addToast={toast}
                            cartItems={cartItems}
                            column={column}
                        />
                    );
                })}
        </Fragment>
    );
};


export default ProductGridWrapper;
