import {Fragment} from "react";
import {toast} from "react-hot-toast";
import ProductGridList from "./ProductGridList";
import {cartSelector} from "../../../features/cart/cartSlice";
import {useSelector} from "react-redux";
import {wishlistSelector} from "../../../features/wishlist/wishlistSlice";

const ProductGridWrapper = ({
                                products,
                                bottomSpace,
                                addToCart,
                                addToWishlist,
                                deleteFromWishlist,
                                removeFromCart,
                                search
                            }) => {
    const {cartItems} = useSelector(cartSelector)
    const {wishlistItems} = useSelector(wishlistSelector)

    return (
        <Fragment>
            {products &&
                products.map((product) => {
                    const productPrice = product.puttc;
                    const cartItem = cartItems.filter(
                        (cartItem) => cartItem.reference === product.reference
                    )[0];
                    const wishlistItem = wishlistItems.filter(
                        (wishlistItem) => wishlistItem.reference === product.reference
                    )[0];


                    return (
                        <ProductGridList
                            key={product.reference}
                            product={product}
                            productPrice={productPrice}
                            cartItem={cartItem}
                            wishlistItem={wishlistItem}
                            bottomSpace={bottomSpace}
                            addToCart={addToCart}
                            addToWishlist={addToWishlist}
                            deleteFromWishlist={deleteFromWishlist}
                            removeFromCart={removeFromCart}
                            addToast={toast}
                            search={search}
                            cartItems={cartItems}
                        />
                    );
                })}
        </Fragment>
    );
};

export default ProductGridWrapper;
