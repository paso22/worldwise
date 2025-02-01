import styles from "./CountryList.module.css"
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import CountryItem from "./CountryItem.jsx";
import {useCities} from "../contexts/CitiesContext.jsx";



function CountryList() {
    const {cities, isLoading} = useCities();

    if (isLoading)
        return <Spinner/>;

    if (cities.length === 0)
        return <Message message="There is no data available right now"/>;

    const countries = cities.reduce((uniqueCountries, city) => {
        if (!uniqueCountries.map(country => country.country).includes(city.country)) {
            return [...uniqueCountries, {country: city.country, emoji: city.emoji}];
        }
        return uniqueCountries;
    }, []);

    return (
        <div className={styles.countryList}>
            <ul>
                {countries.map(country => <CountryItem key={country.country} country={country}/>)}
            </ul>
        </div>
    );
}

export default CountryList;