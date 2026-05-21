import {createSlice} from "@reduxjs/toolkit";
import {convertBase64ToPdfSee} from "../../common/utils/helperFunctions";
import {x3Api} from "../../app/services/x3Api";

const initialState = {};

export const creditsSlice = createSlice({
    name: "credits",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            x3Api.endpoints.seeCredit.matchFulfilled,
            (state, {payload}) => {
                convertBase64ToPdfSee(payload.credit);
            }
        );
    },
});

export default creditsSlice.reducer;

export const creditsSelector = (state) => state.credits;
