import {useEffect, useState} from "react";

import styles from "./Form.module.css";
import Button from "./Button.jsx";
import {useNavigate} from "react-router-dom";
import BackButton from "./BackButton.jsx";
import usePosition from "../hooks/usePosition.jsx";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {useCities} from "../contexts/CitiesContext.jsx";

const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function Form() {
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const {addCity} = useCities();

    const [lat, lng] = usePosition();

    const handleSubmit = async function (e) {
        e.preventDefault();

        if (!cityName || !date) return;

        setIsLoadingGeocoding(true);

        const city = {
            "cityName": cityName,
            "country": country,
            "emoji": "",
            "date": date,
            "notes": notes,
            "position": {
                "lat": lat,
                "lng": lng
            }
        }

        await addCity(city);
        setIsLoadingGeocoding(false);
        navigate("/app/cities");
    }

    useEffect(() => {
        async function reverseGeolocation() {
            try {
                setIsLoadingGeocoding(true);
                setError("");

                const res =
                    await fetch(`${REVERSE_GEOCODE_URL}?latitude=${lat}&longitude=${lng}`);
                const data = await res.json();

                if (!data.city && !data.country)
                    throw new Error("No city found for this location. please try again");

                setCityName(data.city || data.locality || "");
                setCountry(data.countryName);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoadingGeocoding(false);
            }
        }

        reverseGeolocation();
    }, [lat, lng]);

    if (isLoadingGeocoding)
        return <Spinner/>

    if (error)
        return <Message message={error}/>

    if (!lat && !lng)
        return <Message message="To start, select location from the map"/>

    return (
        <form className={`${styles.form} ${isLoadingGeocoding ? styles.loading : ''}`}
              onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                {/* <span className={styles.flag}>{emoji}</span> */}
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    onChange={(date) => setDate(date)}
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    showMonthYearDropdown={false}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">ADD</Button>
                <BackButton/>
            </div>
        </form>
    );
}

export default Form;
