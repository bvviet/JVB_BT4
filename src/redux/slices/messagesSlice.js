import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isShowMessage: false,
    typeMessage: "error",
    contentMessage: "",
};

export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        showMessage: (state, action) => {
            state.isShowMessage = action.payload.isShowMessage;
            state.typeMessage = action.payload.typeMessage;
            state.contentMessage = action.payload.contentMessage;
        },
        hiddenMessage: () => {
            return initialState;
        },
    },
});

export const { showMessage, hiddenMessage } = messageSlice.actions;
export default messageSlice.reducer;
