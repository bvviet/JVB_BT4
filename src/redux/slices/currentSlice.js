import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    time: null,
    avgtemp_c: null,
    icon: null,
    text: null,
    avghumidity: null,
    avgvis_km: null,
};

export const currentSlice = createSlice({
    name: "current",
    initialState,
    reducers: {
        setCurrent: (state, action) => {
            state.time = action.payload.time;
            state.avgtemp_c = action.payload.avgtemp_c;
            state.icon = action.payload.icon;
            state.text = action.payload.text;
            state.avghumidity = action.payload.avghumidity;
            state.avgvis_km = action.payload.avgvis_km;
        },
        removeCurrent: () => {
            return initialState;
        },
    },
});

export const { setCurrent, removeCurrent } = currentSlice.actions;
export default currentSlice.reducer;
