import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartWeather = ({ dataWeather }) => {
    const currentTime = Number(dataWeather?.location?.localtime.split(" ")[1].split(":")[0]);
    const [selectedMetric, setSelectedMetric] = useState("temp_c");
    const data = useSelector((state) => state.dataChart);
    const getCurrentHourIndex = () => {
        // const currentHour = new Date().getHours();
        return data?.findIndex((item) => new Date(item.time.replace(/-/g, "/")).getHours() === currentTime);
    };

    const [currentTimeIndex, setCurrentTimeIndex] = useState(getCurrentHourIndex());

    useEffect(() => {
        setCurrentTimeIndex(getCurrentHourIndex());
    }, [data]);

    const chartData = {
        labels: data.map((item) => `${item.time.split(" ")[1]}`),
        datasets: [
            {
                label: selectedMetric === "temp_c" ? "Temp(°C)" : selectedMetric === "uv" ? "UV" : "Humidity(%)",
                data: data.map((item) =>
                    selectedMetric === "temp_c" ? item.temp_c : selectedMetric === "uv" ? item.uv : item.humidity
                ),
                borderColor:
                    selectedMetric === "temp_c"
                        ? "rgb(255, 99, 132)"
                        : selectedMetric === "uv"
                        ? "rgb(54, 162, 235)"
                        : "rgb(75, 192, 192)",
                backgroundColor:
                    selectedMetric === "temp_c"
                        ? "rgba(255, 99, 132, 0.2)"
                        : selectedMetric === "uv"
                        ? "rgba(54, 162, 235, 0.2)"
                        : "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: data.map((_, index) => (index === currentTimeIndex ? 5 : 0)),
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.dataset.label + ": " + tooltipItem.formattedValue;
                    },
                },
            },
        },
        scales: {
            x: {
                display: false,
                grid: {
                    display: false,
                },
            },
            y: {
                display: false,
                grid: {
                    display: false,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="flex flex-col items-center rounded-lg bg-[#fff] pb-3 mt-8 mb-4">
            <select
                value={selectedMetric}
                className="p-1 border rounded outline-none mb-2 cursor-pointer"
                onChange={(e) => setSelectedMetric(e.target.value)}
            >
                <option value="temp_c">Temperature</option>
                <option value="uv">UV</option>
                <option value="humidity">Humidity</option>
            </select>
            <div className="w-full">
                <Line data={chartData} options={chartOptions} height={200} />
            </div>
        </div>
    );
};

ChartWeather.propTypes = {
    dataWeather: PropTypes.shape({
        location: PropTypes.shape({
            localtime: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default ChartWeather;
