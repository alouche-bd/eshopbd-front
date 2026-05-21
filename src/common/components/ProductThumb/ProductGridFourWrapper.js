import {Fragment} from "react";

import {toast} from "react-hot-toast";

import ProductGridFour from "./ProductGridFour";

const ProductGridFourWrapper = ({
                                    products,
                                    bottomSpace,
                                    addToCart,
                                    addToWishlist,
                                    deleteFromWishlist,
                                    cartItems,
                                    wishlistItems,
                                    sliderClass
                                }) => {

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
                        <ProductGridFour
                            key={product.id}
                            product={product}
                            productPrice={productPrice}
                            cartItem={cartItem}
                            wishlistItem={wishlistItem}
                            bottomSpace={bottomSpace}
                            addToCart={addToCart}
                            addToWishlist={addToWishlist}
                            deleteFromWishlist={deleteFromWishlist}
                            addToast={toast}
                            cartItems={cartItems}
                            sliderClass={sliderClass}
                        />
                    );
                })}
        </Fragment>
    );
};

export default ProductGridFourWrapper;
