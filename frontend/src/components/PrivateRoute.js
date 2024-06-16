import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const PrivateRoute = ({ element }) => {
    const { auth, loading } = useAuth();
    const location = useLocation();

    if(loading) return <Loading />

    return auth?.accessToken ? element : <Navigate to='/login' state={{ from: location }} replace />
}

export default PrivateRoute;