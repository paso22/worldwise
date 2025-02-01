import {createContext, useContext, useReducer} from "react";

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext(null);

const initialState = {
    user: null,
    isAuthenticated: false
}

const reducer = function (state, action) {
    switch (action.type) {
        case "login" :
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            }
        case "logout" :
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }
        default :
            throw new Error("Unknown action type detected");
    }
}

function AuthProvider({children}) {
    const [{user, isAuthenticated}, dispath] = useReducer(reducer, initialState);

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
            dispath({type: "login", payload: FAKE_USER});
    }

    function logout() {
        dispath({type: "logout"});
    }

    return <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
        {children}
    </AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error("Authentication context was used outside of provider");
    return context;
}

export {AuthProvider, useAuth};