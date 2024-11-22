import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const chartSlice = createSlice({
    name: "chart",
    initialState,
    reducers: {
        setDataCharts: (state, action) => {
            return action.payload;
        },
    },
});

export const { setDataCharts } = chartSlice.actions;
export default chartSlice.reducer;
