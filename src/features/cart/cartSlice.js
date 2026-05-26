import {createSlice} from "@reduxjs/toolkit";
import {x3Api} from "../../app/services/x3Api";
import {stockAlertAdd, stockAlertIncrease, stockAlertUpdate,} from "../../common/utils/helperFunctions";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    cartTotalWithoutDiscount: 0,
    cartTotalAmountCheckout: 0,
    stockAlertProduct: [],
    discount: 0,
    shippingAddress: {},
    labClient: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            if (itemExist) {
                stockAlertIncrease(action.payload, itemExist, state.stockAlertProduct);
                itemExist.cartQuantity++;
            } else {
                let tempProduct = {...action.payload, cartQuantity: 1};
                state.cartItems.push(tempProduct);
            }
            stockAlertAdd(action.payload, state.stockAlertProduct);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.discount = 0;
        },
        addToCartLda(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            if (!itemExist) {
                let tempProduct = {...action.payload, lot: []};
                state.cartItems.push(tempProduct);
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        addCommentLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.lot
                );
                if (lotExist) {
                    lotExist.comment = action.payload.comment;
                    state.cartItems = [...tempProducts]
                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        addAndSetQuantity(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            if (itemExist) {
                stockAlertUpdate(
                    action.payload,
                    action.payload.cartQuantity,
                    state.stockAlertProduct
                );
                itemExist.cartQuantity += action.payload.quantity;
            } else {
                let tempProduct = {...action.payload, cartQuantity: action.payload.quantity};
                state.cartItems.push(tempProduct);
            }
            stockAlertAdd(action.payload, state.stockAlertProduct);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.discount = 0;
        },
        removeFromCart(state, action) {
            state.cartItems = state.cartItems.filter(
                (item) => item.reference !== action.payload.reference
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.discount = 0;
        },
        removeFromCartLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (!itemExist.lot.length || !itemExist.lot.length > 1) {
                tempProducts = tempProducts.filter(
                    (item) => item.reference !== action.payload.product.reference
                );
                state.cartItems = [...tempProducts]
            }
            if (itemExist) {
                itemExist.lot = itemExist.lot.filter(
                    (item) => item.numero !== action.payload.lot
                );
                state.cartItems = [...tempProducts]
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

            }
        },
        decreaseQuantity(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            if (itemExist.cartQuantity > 1) {
                itemExist.cartQuantity--;
            } else {
                state.cartItems = state.cartItems.filter(
                    (item) => item.reference !== action.payload.reference
                );
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.discount = 0;
        },
        selectLotLda(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.numero
                );
                if (!lotExist) {
                    itemExist.lot = [{numero: action.payload.numero, quantity: 1}]

                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        addLotLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.numero
                );
                if (!lotExist) {
                    itemExist.lot.push({numero: action.payload.numero, quantity: 1})
                    state.cartItems = [...tempProducts]
                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        decreaseQuantityLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.lot
                );
                if (lotExist) {
                    if (lotExist.quantity > 1) {
                        lotExist.quantity--;
                        state.cartItems = [...tempProducts]
                    } else {
                        state.cartItems = lotExist.filter(
                            (item) => item.numero !== action.payload.lot.numero
                        );
                        if (!itemExist.lot.length) {
                            state.cartItems = state.cartItems.filter(
                                (item) => item.reference !== itemExist.reference
                            );
                        }
                    }
                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        increaseQuantity(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            itemExist.cartQuantity++;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            stockAlertIncrease(action.payload, itemExist, state.stockAlertProduct);
            state.discount = 0;
        },
        increaseQuantityLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.product.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.lot
                );
                if (lotExist) {
                    lotExist.quantity++
                    state.cartItems = [...tempProducts]
                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        updateProduct(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            const type = action.payload.type;
            itemExist[type] = action.payload.product[type];
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        updateQuantity(state, action) {
            const itemExist = state.cartItems.find(
                (item) => item.reference === action.payload.reference
            );
            itemExist.cartQuantity = action.payload.cartQuantity;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            stockAlertUpdate(
                action.payload,
                action.payload.cartQuantity,
                state.stockAlertProduct
            );
            state.discount = 0;
        },
        updateQuantityLda(state, action) {
            let tempProducts = [...state.cartItems];
            const itemExist = tempProducts.find(
                (item) => item.reference === action.payload.reference
            );
            if (itemExist) {
                const lotExist = itemExist.lot.find(
                    (item) => item.numero === action.payload.lot.numero
                );
                if (lotExist) {
                    lotExist.quantity = action.payload.lot.quantity;
                    state.cartItems = [...tempProducts]
                    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                }
            }
        },
        clearCart(state, action) {
            state.cartItems = [];
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0;
            state.cartTotalWithoutDiscount = 0;
            state.cartTotalAmountCheckout = 0;
            state.discount = 0;
            state.labClient = null;
            state.shippingAddress = "";
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        getTotals(state, action) {
            let {total, quantity, totalCheckout, totalCheckoutWithoutDiscount} = state.cartItems.reduce(
                (cartTotal, item) => {
                    const {puttc, prixbrut, cartQuantity, remise1montant} = item;
                    const itemTotal = puttc * cartQuantity;
                    let itemTotalCheckout = 0;
                    let itemTotalWithoutDiscount = 0;
                    if (item.grouperepartition && item.grouperepartition === "Commande") {
                        itemTotalCheckout = puttc * cartQuantity;
                        if (remise1montant && remise1montant > 0) {
                            itemTotalWithoutDiscount = puttc * cartQuantity * (100 / remise1montant);
                        } else {
                            itemTotalWithoutDiscount = puttc * cartQuantity;
                        }
                    }
                    cartTotal.totalCheckoutWithoutDiscount += itemTotalWithoutDiscount;
                    cartTotal.totalCheckout += itemTotalCheckout;
                    cartTotal.total += itemTotal;
                    cartTotal.quantity += cartQuantity;

                    return cartTotal;
                },
                {
                    totalCheckout: 0,
                    total: 0,
                    quantity: 0,
                    totalCheckoutWithoutDiscount: 0,
                }
            );
            state.cartTotalAmountCheckout = state.discount > 0 ? 0 : totalCheckout;
            state.cartTotalAmount = total;
            state.cartTotalQuantity = quantity;
            state.cartTotalWithoutDiscount = totalCheckoutWithoutDiscount;
        },
        setShippingAddress(state, action) {
            state.shippingAddress = {
                zipCode: action.payload.zipCode,
                address: action.payload.address,
                finalClientEmail: action.payload.finalClientEmail
            }
        },
        setLabClient(state, action) {
            state.labClient = action.payload
        },
        clearShippingAddress(state, action) {
            state.shippingAddress = [];
        },
        addDiscount(state, action) {
            state.discount = action.payload
        },
        removeDiscount(state, action) {
            state.discount = 0
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            x3Api.endpoints.postGetRepartition.matchFulfilled,
            (state, {payload}) => {
                if (payload && payload?.products) {
                    const arrayRepartition = payload.products;
                    arrayRepartition.map((item) => {
                        const itemExist = state.cartItems.find(
                            (product) => product.reference === item.code
                        );
                        if (itemExist) {
                            itemExist.grouperepartition = item.grouperepartition;
                            itemExist.typedocument = item.typedocument;
                            itemExist.puttc = item.prix * (1 - item.remise / 100);
                            itemExist.remise1montant = item.remise;
                            // Mark the line as carrying the real, client-specific
                            // repartition price (not the indicative catalog puttc
                            // it was added with). The distributor cart only shows a
                            // price / counts a line in the total once this is set.
                            itemExist.priced = true;
                        }
                    });
                }
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
                return state;
            }
        );
    },
});

export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;

export const {
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    removeDiscount,
    addDiscount,
    clearCart,
    getTotals,
    updateQuantity,
    openCartDrawer,
    closeCartDrawer,
    addAndSetQuantity,
    clearShippingAddress,
    clearCartAlert,
    updateProduct,
    setShippingAddress,
    setLabClient,
    selectLotLda,
    updateQuantityLda,
    increaseQuantityLda,
    decreaseQuantityLda,
    addToCartLda,
    addLotLda,
    removeFromCartLda,
    addCommentLda
} = cartSlice.actions;
