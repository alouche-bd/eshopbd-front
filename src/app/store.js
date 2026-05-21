import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/dist/query";
import authReducer from "../features/auth/authSlice";
import creditsReducer from "../features/credits/creditsSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import {lumenApi} from "./services/lumenApi";
import {x3Api} from "./services/x3Api";
import productsReducer from "../features/products/ProductsSlice";
import {errorToastMiddleware} from "./errorToastMiddleware";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        products: productsReducer,
        credits: creditsReducer,
        [x3Api.reducerPath]: x3Api.reducer,
        [lumenApi.reducerPath]: lumenApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(
            x3Api.middleware,
            lumenApi.middleware,
            errorToastMiddleware,
        ),
});

setupListeners(store.dispatch);

export default store;
