import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default MainLayout;
