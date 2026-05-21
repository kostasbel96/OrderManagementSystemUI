import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;