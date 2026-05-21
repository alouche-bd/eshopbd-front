import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    wishlistItems: localStorage.getItem("wishlistItems")
        ? JSON.parse(localStorage.getItem("wishlistItems"))
        : [],
    wishlistTotal: localStorage.getItem("wishlistItems")
        ? JSON.parse(localStorage.getItem("wishlistItems")).length
        : 0,
    wishlistDrawerOpen: false,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addWishlist(state, action) {
            const itemExist = state.wishlistItems.find(
                (item) => item.reference === action.payload.reference
            );
            if (!itemExist) {
                state.wishlistItems.push(action.payload);
                state.wishlistTotal++;
            }
            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(state.wishlistItems)
            );
        },
        removeWishlist(state, action) {
            const updatedLikes = state.wishlistItems.filter(
                (item) => item.reference !== action.payload.reference
            );
            state.wishlistItems = updatedLikes;
            state.wishlistTotal--;
            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(state.wishlistItems)
            );
        },
        clearWishlist(state, action) {
            state.wishlistItems = [];
            state.wishlistTotal = 0;
            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(state.wishlistItems)
            );
        },
        openWishlistDrawer(state, action) {
            state.wishlistDrawerOpen = true;
        },
        closeWishlistDrawer(state, action) {
            state.wishlistDrawerOpen = false;
        },
    },
});

export default wishlistSlice.reducer;

export const {
    addWishlist,
    removeWishlist,
    clearWishlist,
    openWishlistDrawer,
    closeWishlistDrawer,
} = wishlistSlice.actions;

export const wishlistSelector = (state) => state.wishlist;
