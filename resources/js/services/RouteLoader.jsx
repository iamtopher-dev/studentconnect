import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";

const RouteLoader = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300); 

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!loading) return null;

    return <PageLoader />;
};

export default RouteLoader;
