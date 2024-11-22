import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.weatherapi.com/",
    }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: ({ city }) =>
                `v1/forecast.json?key=f5ac4be4a19c47d8a3e42522222112&q=${city}&days=10&aqi=no&alerts=yes`,
        }),
    }),
});

export const { useGetWeatherQuery } = api;
