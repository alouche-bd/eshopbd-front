import {createSlice} from "@reduxjs/toolkit";
import {x3Api} from "../../app/services/x3Api";

const initialState = {
    filteredProducts: [],
    allProducts: [],
    searchBarOpen: false,
};

const ProductsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearchBarOpen(state, action) {
            state.searchBarOpen = true;
        },
        setSearchBarClose(state, action) {
            state.searchBarOpen = false;
        },
        clearProducts(state, action) {
            return initialState;
        },
        setCatalogueProducts(state, {payload}) {
            state.filteredProducts = payload;
            state.allProducts = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            x3Api.endpoints.getProductsByCatalogue.matchFulfilled,
            (state, {payload}) => {
                state.filteredProducts = payload;
                state.allProducts = payload;
            }
        );
        builder.addMatcher(
            x3Api.endpoints.getProductsBySearchQuery.matchFulfilled,
            (state, {payload}) => {
                state.filteredProducts = payload;
                state.allProducts = payload;
            }
        );
    },
});

export default ProductsSlice.reducer;

export const {
    setSearchBarClose,
    setSearchBarOpen,
    clearProducts,
    setCatalogueProducts,
} = ProductsSlice.actions;

export const productsSelector = (state) => state.products;
