import {createContext, useCallback, useContext, useEffect, useReducer} from "react";

const CitiesContext = createContext(null);
const BASE_URL = "http://localhost:8000";

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
}

const reducer = function (state, action) {
    switch (action.type) {
        case "loading" :
            return {
                ...state,
                isLoading: true
            }
        case "cities/loaded" :
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            }
        case "city/loaded" :
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            }
        case "city/created" :
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload
            }
        case "city/deleted" :
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(city => city.id !== action.payload),
                currentCity: {}
            }
        case "rejected" :
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default :
            throw new Error("Unknown action type detected!")
    }
}

function CitiesProvider({children}) {
    const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function fetchCities() {
            try {
                dispatch({type: "loading"});
                const data = await fetch(`${BASE_URL}/cities`);
                const cities = await data.json();
                dispatch({type: "cities/loaded", payload: cities});
            } catch {
                dispatch({type: "rejected", payload: "Error during fetching cities"});
            }
        }

        fetchCities();
    }, []);

    const getCity = useCallback(async function getCity(id) {
        if (Number(id) === currentCity.id)
            return;

        try {
            dispatch({type: "loading"});
            const data = await fetch(`${BASE_URL}/cities/${id}`);
            const city = await data.json();
            dispatch({type: "city/loaded", payload: city});
        } catch {
            dispatch({type: "rejected", payload: "Error during fetching city"});
        }
    }, [currentCity.id]);

    async function addCity(city) {
        try {
            dispatch({type: "loading"});
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(city),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            dispatch({type: "city/created", payload: data});
        } catch {
            dispatch({type: "rejected", payload: "Error during creating city"});
        }
    }

    async function deleteCity(id) {
        try {
            dispatch({type: "loading"});
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE"
            });
            dispatch({type: "city/deleted", payload: id});
        } catch {
            dispatch({type: "rejected", payload: "Error during deleting city"});
        }
    }

    return (
        <CitiesContext.Provider value={{cities, isLoading, currentCity, getCity, addCity, deleteCity}}>
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("CitiesContext was used outside of CitiesProvider");

    return context;
}

export {CitiesProvider, useCities};