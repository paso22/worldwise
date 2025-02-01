import styles from "./Map.module.css"
import {useNavigate} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useCities} from "../contexts/CitiesContext.jsx";
import {useGeolocation} from "../hooks/useGeolocation.js";
import Button from "./Button.jsx";
import usePosition from "../hooks/usePosition.jsx";

function Map() {
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const {cities} = useCities();

    const {isLoading: isLoadingGeolocation, position: geolocationPosition, getPosition} = useGeolocation();

    const [lat, lng] = usePosition();

    useEffect(() => {
        if (lat && lng) setMapPosition([lat, lng]);
    }, [lat, lng]);

    useEffect(() => {
        if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }, [geolocationPosition])

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition &&
                <Button type="position" onClick={getPosition}>
                    {isLoadingGeolocation ? "Loading" : "Use your position"}
                </Button>}
            <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    cities.map((city) => (
                        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                            <Popup>
                                {city.cityName}
                            </Popup>
                        </Marker>
                    ))}

                <ChangePosition position={mapPosition}/>
                <DetectClick/>
            </MapContainer>
        </div>
    )
        ;
}

function ChangePosition({position}) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}

export default Map;