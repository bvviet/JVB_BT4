import { useEffect } from "react";
import Card from "./Card";
import Chart from "./Chart";
import { useDispatch } from "react-redux";
import { startLoading } from "../../redux/slices/loadingSlice";

// eslint-disable-next-line react/prop-types
const WeatherRight = ({ data }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!data) {
            dispatch(startLoading(true));
        } else {
            dispatch(startLoading(false));
        }
    }, [dispatch, data]);
    return (
        <div>
            <Chart dataWeather={data} />
            {data ? <Card data={data} /> : <p>Loading</p>}
        </div>
    );
};
export default WeatherRight;
