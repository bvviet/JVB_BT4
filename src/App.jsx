import "./App.css";
import { Flex, Input, Space, Spin } from "antd";
import WeatherRight from "./components/WeatherRight";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { hiddenMessage, showMessage } from "./redux/slices/messagesSlice";
import { useGetWeatherQuery } from "./services/rootApi";
import { startLoading } from "./redux/slices/loadingSlice";
import { debounce } from "lodash";
import { getDayOfWeek, getMonthName } from "./utils";

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);
    const { isShowMessage, typeMessage, contentMessage } = useSelector((state) => state.messages);
    useEffect(() => {
        if (isShowMessage) {
            if (typeMessage === "error") {
                toast.error(contentMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else if (typeMessage === "success") {
                toast.success(contentMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            dispatch(hiddenMessage());
        }
    }, [isShowMessage, typeMessage, contentMessage, dispatch]);

    const [searchTerm, setSearchTerm] = useState("hanoi");
    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setSearchTerm(value);
            }, 800),
        []
    );

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const {
        data,
        isLoading: isLoadingGetApi,
        isError,
        error,
        isSuccess,
    } = useGetWeatherQuery(
        { city: searchTerm },
        {
            skip: !searchTerm,
        }
    );

    useEffect(() => {
        if (isLoadingGetApi) {
            dispatch(startLoading(true));
        } else {
            dispatch(startLoading(false));
        }
    }, [dispatch, isLoadingGetApi]);

    useEffect(() => {
        if (isError) {
            dispatch(
                showMessage({ isShowMessage: true, typeMessage: "error", contentMessage: error?.data?.error?.message })
            );
        }
        if (isSuccess) {
            dispatch(showMessage({ isShowMessage: true, typeMessage: "success", contentMessage: "Success" }));
        }
    }, [dispatch, isError, error?.data?.error?.message, isSuccess]);

    const dataCurrent = useSelector((state) => state.current);

    return (
        <Flex gap="middle" vertical>
            <Spin tip="Loading" size="default" spinning={isLoading}>
                <div className="flex items-center justify-center h-screen w-auto text-sm">
                    <div className="border-8 border-[#a0cdd638] shadow-xl rounded-lg px-6 py-10 w-[65vw] flex">
                        <div className="w-[30%]">
                            <form>
                                <Space direction="horizontal" size="small">
                                    <label htmlFor="city" className="font-medium">
                                        Your city
                                    </label>
                                    <Input
                                        placeholder={`${
                                            data?.location.name ? data?.location.name : "Search name City"
                                        }`}
                                        id="city"
                                        size="small"
                                        className="w-32"
                                        onChange={handleSearch}
                                    />
                                </Space>
                            </form>
                            <div className="p-3 pb-0 w-full mt-1">
                                <div className="px-4">
                                    <p className="mb-2 font-semibold">
                                        {data?.location.name}, {data?.location.country}
                                    </p>
                                    <p className="text-slate-600 text-xs">
                                        <span>{data?.location.localtime.split(" ")[1]}</span>,{" "}
                                        <span>{getDayOfWeek(data?.location.localtime.split(" ")[0])}</span>,{" "}
                                        <span>{getMonthName(data?.location.localtime.split(" ")[0])}</span>,{" "}
                                        <span>{data?.location.localtime.split("-")[0]}</span>
                                    </p>
                                </div>
                                <Space direction="horizontal" size="small" className="w-full justify-between mt-3">
                                    <img
                                        src={`${dataCurrent.time ? dataCurrent.icon : data?.current?.condition.icon}`}
                                        alt=""
                                        className="w-24"
                                    />
                                    <strong className="text-[50px]">
                                        {dataCurrent.time ? dataCurrent.avgtemp_c : data?.current.temp_c}
                                        <span className="text-xl inline-block align-super">°C</span>
                                    </strong>
                                </Space>
                                <p className="text-xl text-center font-bold">
                                    {dataCurrent.time ? dataCurrent.text : data?.current?.condition.text}
                                </p>

                                <div className="mt-5 px-6 flex items-center justify-between text-sm font-medium">
                                    <div>
                                        <p className="text-slate-600">Hummidity</p>
                                        <p className="text-center font-bold mt-1">
                                            {dataCurrent.time ? dataCurrent.avghumidity : data?.current.humidity}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-600">Wind speed</p>
                                        <p className="text-center font-bold mt-1">
                                            {dataCurrent.time ? dataCurrent.avgvis_km : data?.current.wind_kph} km/h
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[70%] pl-5 mt-auto">
                            <WeatherRight data={data} />
                        </div>
                    </div>
                </div>
            </Spin>
        </Flex>
    );
}

export default App;
