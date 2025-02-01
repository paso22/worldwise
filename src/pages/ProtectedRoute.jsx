import {useAuth} from "../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated)
            navigate("/login");
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;