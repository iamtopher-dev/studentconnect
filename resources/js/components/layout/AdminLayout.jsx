import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <>
            <Sidebar userRole={`ADMIN`}/>
            <div className="p-4 sm:ml-64">
                <div className="p-4  ">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
