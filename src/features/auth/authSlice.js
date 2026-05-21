import {createSlice} from "@reduxjs/toolkit";
import {lumenApi} from "../../app/services/lumenApi";

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    isAuth: localStorage.getItem("lumenToken") ? true : false,
    lumenToken: localStorage.getItem("lumenToken")
        ? localStorage.getItem("lumenToken")
        : ""
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logout(state, action) {
            localStorage.clear();
            state.user = {};
            state.isAuth = false;
            state.lumenToken = "";
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            lumenApi.endpoints.postLoginLumen.matchFulfilled,
            (state, {payload}) => {
                if (payload.user && payload.token) {
                    state.user = {...state.user, ...payload.user};
                    state.isAuth = true;
                    state.lumenToken = payload.token;
                    localStorage.setItem("user", JSON.stringify(payload.user));
                    localStorage.setItem("isAuth", true);
                    localStorage.setItem("lumenToken", payload.token);
                }
            }
        );
        builder.addMatcher(
            lumenApi.endpoints.postAdminLogin.matchFulfilled,
            (state, {payload}) => {
                if (payload.user && payload.token) {
                    state.user = {...state.user, ...payload.user};
                    state.isAuth = true;
                    state.lumenToken = payload.token;
                    localStorage.setItem("user", JSON.stringify(payload.user));
                    localStorage.setItem("isAuth", true);
                    localStorage.setItem("lumenToken", payload.token);
                }
            }
        );
        builder.addMatcher(
            lumenApi.endpoints.postReverseLogin.matchFulfilled,
            (state, {payload}) => {
                if (payload.user && payload.token) {
                    state.user = {...state.user, ...payload.user};
                    state.isAuth = true;
                    state.lumenToken = payload.token;
                    localStorage.setItem("user", JSON.stringify(payload.user));
                    localStorage.setItem("isAuth", true);
                    localStorage.setItem("lumenToken", payload.token);
                }
            }
        );
        builder.addMatcher(
            lumenApi.endpoints.getLogout.matchFulfilled,
            (state, {payload}) => {
                localStorage.clear();
                return initialState;
            }
        );
    },
});
export default authSlice.reducer;

export const {logout} = authSlice.actions;

export const authSelector = (state) => state.auth;
