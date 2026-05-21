import {Fragment} from "react";
import {toast} from "react-hot-toast";
import ProductWidget from "./ProductWidget";

const ProductWidgetWrapper = ({
                                  products,
                                  bottomSpace,
                                  addToCart,
                                  cartItems,
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

                    return (
                        <ProductWidget
                            key={product.id}
                            product={product}
                            productPrice={productPrice}
                            cartItem={cartItem}
                            bottomSpace={bottomSpace}
                            addToCart={addToCart}
                            addToast={toast}
                            sliderClass={sliderClass}
                        />
                    );
                })}
        </Fragment>
    );
};

export default ProductWidgetWrapper;
