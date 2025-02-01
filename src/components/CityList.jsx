import styles from "./CityList.module.css"
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import CityItem from "./CityItem.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";

function CityList() {
    const {isLoading, cities} = useCities();

    if (isLoading)
        return <Spinner/>;

    if (cities.length === 0)
        return <Message message="There is no data available right now"/>;

    return (
        <div className={styles.cityList}>
            <ul>
                {cities.map(city => <CityItem key={city.id} city={city}/>)}
            </ul>
        </div>
    );
}

export default CityList;