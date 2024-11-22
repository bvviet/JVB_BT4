import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";
import messagesReducer from "./slices/messagesSlice";
import chartReducer from "./slices/chartSlice";
import currentReducer from "./slices/currentSlice";
import { api } from "../services/rootApi";

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        loading: loadingReducer,
        messages: messagesReducer,
        dataChart: chartReducer,
        current: currentReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export default store;
