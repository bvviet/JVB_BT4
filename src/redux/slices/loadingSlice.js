import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        startLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { startLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
