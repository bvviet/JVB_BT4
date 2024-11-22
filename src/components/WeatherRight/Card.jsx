import { Modal } from "antd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMonthName } from "../../utils";
import { useDispatch } from "react-redux";
import { setDataCharts } from "../../redux/slices/chartSlice";
import { removeCurrent, setCurrent } from "../../redux/slices/currentSlice";

const Card = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const dispatch = useDispatch();
    const date = new Date().getDate();

   
    useEffect(() => {
        if (data?.forecast?.forecastday?.length > 0) {
            // Set selectedData cho ngày đầu tiên trong mảng nếu chưa có dữ liệu chọn
            const firstDay = data.forecast.forecastday[0];
            setSelectedData(firstDay);

            const daydefault = (firstDay?.hour || []).map((item) => ({
                time: item.time,
                temp_c: item.temp_c,
                uv: item.uv,
                humidity: item.humidity,
            }));

            dispatch(setDataCharts(daydefault));
        }
    }, [data, dispatch]);

    const showModal = (value) => {
        setSelectedData(value);
        setIsModalOpen(true);
    };

    const setDataChart = (value) => {
        if (selectedData?.date !== value?.date) {
            // Check if the date has changed before updating
            setSelectedData(value); // Update the selected data
            const transformedData = (value?.hour || []).map((item) => ({
                time: item.time,
                temp_c: item.temp_c,
                uv: item.uv,
                humidity: item.humidity,
            }));
            dispatch(setDataCharts(transformedData)); // Dispatch only when data changes
        }
        if (date !== Number(value.date.split("-")[2])) {
            console.log({ value });

            const current = {
                time: value.date,
                avgtemp_c: value.day.avgtemp_c,
                icon: value.day.condition.icon,
                text: value.day.condition.text,
                avghumidity: value.day.avghumidity,
                avgvis_km: value.day.avgvis_km,
            };
            dispatch(
                setCurrent({
                    time: current.time,
                    avgtemp_c: current.avgtemp_c,
                    icon: current.icon,
                    text: current.text,
                    avghumidity: current.avghumidity,
                    avgvis_km: current.avgvis_km,
                })
            );
        } else {
            dispatch(removeCurrent());
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const currentTime = new Date().getDate();

    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                {data?.forecast.forecastday?.map((value, index) => (
                    <div
                        key={index}
                        className={`${
                            selectedData?.date.split("-")[2] === value?.date.split("-")[2]
                                ? "bg-sky-500 text-white"
                                : ""
                        } flex flex-col justify-center items-center text-xs px-4 py-3 rounded-xl`}
                        onDoubleClick={() => showModal(value)}
                        onClick={() => setDataChart(value)}
                    >
                        <p className="font-semibold text-xs">
                            {value?.date.split("-")[2] === String(currentTime)
                                ? "Today"
                                : getMonthName(value?.date).slice(0, 3)}{" "}
                            {value?.date.split("-")[2]}
                        </p>
                        <img src={value?.day?.condition?.icon} alt="" />
                        <p>Humidity</p>
                        <p>{value?.day?.avghumidity}%</p>
                    </div>
                ))}
            </div>
            <Modal
                title={`Weather Details for ${selectedData?.date || "Selected Day"}`}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedData ? (
                    <div className="grid grid-cols-6 gap-3 items-center justify-center">
                        {(selectedData?.hour || [])
                            .filter((_, index) => index % 2 === 0) // Lấy các giờ chẵn
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col justify-center items-center text-xs px-4 py-3 rounded-xl border`}
                                >
                                    <p className="font-semibold text-xs">{item?.time.split(" ")[1]}</p>
                                    <img src={item?.condition?.icon} alt="" className="w-10 h-10" />
                                    <p>Humidity</p>
                                    <p>{item?.humidity}%</p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </Modal>
        </>
    );
};

// Định nghĩa kiểu là `any`
Card.propTypes = {
    data: PropTypes.any.isRequired,
};

export default Card;
