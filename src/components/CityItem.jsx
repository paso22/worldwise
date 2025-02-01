import styles from "./CityItem.module.css"
import {Link} from "react-router-dom";
import {useCities} from "../contexts/CitiesContext.jsx";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

const flagemojiToPNG = (flag) => {
    const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char - 127397).toLowerCase()).join('');
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag'/>)
}

function CityItem({city}) {
    const {currentCity, deleteCity} = useCities();

    const handleDeletion = async function (e) {
        e.preventDefault();
        await deleteCity(city.id);
    }

    return (
        <li>
            <Link to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
                  className={`${styles.cityItem} ${city.id === currentCity.id ? styles['cityItem--active'] : ''}`}>
                <span className={styles.emoji}>{flagemojiToPNG(city.emoji)}</span>
                <h3 className={styles.name}>{city.cityName}</h3>
                <time className={styles.date}>({formatDate(city.date)})</time>
                <button className={styles.deleteBtn} onClick={handleDeletion}>&times;</button>
            </Link>
        </li>
    );
}

export default CityItem;