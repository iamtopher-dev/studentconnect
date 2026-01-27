import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import Select from "react-select";
import apiService from "../../services/apiService";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = "#307358";
const KEY_MAPPING = {
    student: {
        firstName: "first_name",
        middleName: "middle_name",
        lastName: "family_name",
    },
    personal: {
        street: "street",
        barangay: "barangay",
        municipality: "municipality",
        province: "province",
        dob: "dob",
        sex: "sex",
        civilStatus: "civil_status",
        nationality: "nationality",
        religion: "religion",
    },
};
const RequestUpdateInformationPage = () => {
    const [search, setSearch] = useState("");
    const [request, setRequest] = useState([]);
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    useEffect(() => {
        get_request_update_information_student();
    }, []);

    const get_request_update_information_student = () => {
        apiService
            .get("staff/get-request-update-information-student")
            .then((res) => {
                console.log(res.data.data);
                setRequest(res.data.data);
            })
            .catch((err) => {
                console.error("Err", err);
            });
    };
    const openModal = (data) => {
        setSelectedRequest(data);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedRequest(null);
    };
    const filteredRequests = useMemo(() => {
        if (!search) return request;

        const lowerSearch = search.toLowerCase();
        return request.filter((item) => {
            const fullName =
                `${item.student.first_name} ${item.student.middle_name} ${item.student.family_name}`.toLowerCase();
            const studentId = item.user.student_no.toLowerCase();

            return (
                fullName.includes(lowerSearch) ||
                studentId.includes(lowerSearch)
            );
        });
    }, [search, request]);
    if (loadingScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading student...
            </div>
        );
    }
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
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
                            onChange={(e) => setSearch(e.target.value)}
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
                            {filteredRequests.map((data) => (
                                <tr key={data.user.student_no}>
                                    <td className="py-4">
                                        {data.student.family_name},{" "}
                                        {data.student.first_name}{" "}
                                        {data.student.middle_name}
                                    </td>
                                    <td className="py-4">
                                        {data.user.student_no}
                                    </td>
                                    <td className="py-4">
                                        {data.type} Information
                                    </td>
                                    <td className="py-4">
                                        <button
                                            onClick={() => openModal(data)}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            Request Update Details
                        </h2>

                        {selectedRequest && (
                            <div className="space-y-4 text-sm">
                                {/* STUDENT INFO */}
                                <div>
                                    <p className="text-gray-500">
                                        Student Name
                                    </p>
                                    <p className="font-medium">
                                        {selectedRequest.student.family_name},{" "}
                                        {selectedRequest.student.first_name}{" "}
                                        {selectedRequest.student.middle_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Student ID</p>
                                    <p className="font-medium">
                                        {selectedRequest.user.student_no}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Request Type
                                    </p>
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        {selectedRequest.type} Information
                                    </span>
                                </div>

                                {/* REQUESTED CHANGES */}
                                <div>
                                    <div className="space-y-2">
                                        {selectedRequest && (
                                            <div className="space-y-4 text-sm">
                                                {/* STUDENT INFO */}

                                                {/* REQUESTED CHANGES */}
                                                <div>
                                                    <p className="text-gray-500 mb-2">
                                                        Requested Changes
                                                    </p>

                                                    <div className="space-y-2">
                                                        {JSON.stringify(
                                                            selectedRequest.data,
                                                        )}
                                                        {Object.entries(
                                                            selectedRequest.data,
                                                        )
                                                            .filter(
                                                                ([_, value]) =>
                                                                    value !==
                                                                        null &&
                                                                    value !==
                                                                        "" &&
                                                                    value !==
                                                                        undefined,
                                                            )
                                                            .map(
                                                                ([
                                                                    key,
                                                                    newValue,
                                                                ]) => {
                                                                    const studentKey =
                                                                        KEY_MAPPING[
                                                                            selectedRequest
                                                                                .type
                                                                        ]?.[
                                                                            key
                                                                        ];

                                                                    const oldValue =
                                                                        studentKey
                                                                            ? selectedRequest
                                                                                  .student?.[
                                                                                  studentKey
                                                                              ]
                                                                            : "—";

                                                                    if (
                                                                        oldValue ===
                                                                        newValue
                                                                    )
                                                                        return null;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                key
                                                                            }
                                                                            className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg"
                                                                        >
                                                                            <div className="flex-1">
                                                                                <p className="text-gray-400 text-xs">
                                                                                    {key
                                                                                        .replace(
                                                                                            /([A-Z])/g,
                                                                                            " $1",
                                                                                        )
                                                                                        .replace(
                                                                                            /^./,
                                                                                            (
                                                                                                str,
                                                                                            ) =>
                                                                                                str.toUpperCase(),
                                                                                        )}{" "}
                                                                                    (Current)
                                                                                </p>
                                                                                <p className="font-medium text-gray-700">
                                                                                    {
                                                                                        oldValue
                                                                                    }
                                                                                </p>
                                                                            </div>

                                                                            <div className="text-gray-400 font-semibold">
                                                                                →
                                                                            </div>

                                                                            <div className="flex-1 text-right">
                                                                                <p className="text-gray-400 text-xs">
                                                                                    Requested
                                                                                </p>
                                                                                <p className="font-medium text-green-700">
                                                                                    {
                                                                                        newValue
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            <button className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2">
                                <Check size={16} />
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestUpdateInformationPage;
