import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import Select from "react-select";
import apiService from "../../services/apiService";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = "#307358";

const RequestUpdateInformationPage = () => {
    const [search, setSearch] = useState("");
    const [loadingScreen, setLoadingScreen] = useState(false);

    if (loadingScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading student...
            </div>
        );
    }
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    Request Update Information List
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    View and update request information
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                {/* SEARCH */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h2
                        className="font-semibold text-lg sm:text-xl"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Students Information
                    </h2>

                    <div className="relative w-full sm:w-64">
                        <Search
                            size={16}
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => {
                               
                            }}
                            placeholder="Search by name or student id"
                            className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 text-sm sm:text-base rounded-xl w-full focus:outline-none"
                            style={{
                                backgroundColor: "#E6F0EE",
                                border: `1px solid ${PRIMARY_COLOR}`,
                                color: "#000",
                            }}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto sm:overflow-x-hidden">
                    <table className="w-full text-sm hidden sm:table">
                        <thead>
                            <tr className="text-gray-400 text-left">
                                <th className="pb-4">Name</th>
                                <th className="pb-4">Student ID</th>
                                <th className="pb-4">Request Update</th>
                                <th className="pb-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td className="py-4">dwa</td>
                                <td className="py-4">dwa</td>
                                <td className="py-4">dwa</td>
                                <td className="py-4">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequestUpdateInformationPage;
