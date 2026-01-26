import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLoader from "../components/common/PageLoader";

const RequireAuth = ({ redirectTo = "/" }) => {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setChecking(false), 300);
        return () => clearTimeout(timer);
    }, []);

    if (checking) {
        return <PageLoader />;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
