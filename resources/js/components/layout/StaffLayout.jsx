import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const StaffLayout = () => {
    return (
        <>
            <Sidebar userRole={`STAFF`} />
            <div className="p-4 sm:ml-64">
                <div className="p-4  ">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default StaffLayout;
