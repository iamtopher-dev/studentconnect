import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import apiService from "./apiService";
import PageLoader from "../components/common/PageLoader";

const RequireAuth = ({ allowedRoles = [], redirectTo = "/" }) => {
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiService.get("/get-user-logged");
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally {
                setChecking(false);
            }
        };

        fetchUser();
    }, []);

    if (checking) return <PageLoader />;

    if (!user) return <Navigate to={redirectTo} replace />;

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        if (user.role === "STAFF") return <Navigate to={"/staff"} replace />;
        if (user.role === "STUDENT")
            return <Navigate to={"/student"} replace />;
    }

    return <Outlet context={user} />;
};

export default RequireAuth;
