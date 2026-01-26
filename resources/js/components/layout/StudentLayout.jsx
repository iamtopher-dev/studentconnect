import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
    return (
        <>
            <Sidebar userRole={`STUDENT`} />
            <div className="p-4 sm:ml-64">
                <div className="p-4  ">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default StudentLayout;
