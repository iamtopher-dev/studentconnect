import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import apiService from "../../services/apiService";

const StudentInformationPage = () => {
    const [openModal, setOpenModal] = useState("");
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService
            .get("student/get-student-information")
            .then((res) => {
                setStudent(res.data.data);
                console.log(res.data.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const [studentInfo, setStudentInfo] = useState({
        firstName: "-",
        middleName: "-",
        lastName: "-",
        studentNumber: "-",
        yearLevel: "-",
        course: "-",
        major: "-",
    });

    const [personalInfo, setPersonalInfo] = useState({
        street: "-",
        barangay: "-",
        municipality: "-",
        province: "-",
        dob: "",
        sex: "-",
        civilStatus: "-",
        citizenship: "-",
        religion: "-",
    });

    const [guardianInfo, setGuardianInfo] = useState({
        guardianName: "-",
        guardianContact: "-",
    });

    useEffect(() => {
        if (!student) return;

        const info = student.student_information;

        setStudentInfo({
            firstName: info?.first_name || "-",
            middleName: info?.middle_name || "-",
            lastName: info?.family_name || "-",
            studentNumber: student.student_no || "-",
            yearLevel: info?.year_level || "-",
            course: info?.major || "-",
        });

        setPersonalInfo({
            street: info?.street || "-",
            barangay: info?.barangay || "-",
            municipality: info?.municipality || "-",
            province: info?.province || "-",
            dob: info?.dob || "",
            sex: info?.sex || "-",
            civilStatus: info?.civil_status || "-",
            citizenship: info?.nationality || "-",
            religion: info?.religion || "-",
        });

        setGuardianInfo({
            guardianName: info?.guardian_name || "-",
            guardianContact: info?.guardian_contact_number || "-",
        });
    }, [student]);

    useEffect(() => {
        document.body.style.overflow = openModal ? "hidden" : "auto";
    }, [openModal]);

    const handleChange = (e, type) => {
        const { name, value } = e.target;
        if (type === "student")
            setStudentInfo({ ...studentInfo, [name]: value });
        if (type === "personal")
            setPersonalInfo({ ...personalInfo, [name]: value });
        if (type === "guardian")
            setGuardianInfo({ ...guardianInfo, [name]: value });
    };

    const Modal = ({ title, data, type }) => {
        const fields =
            type === "student"
                ? ["firstName", "middleName", "lastName"] // Only keep these three
                : Object.keys(data);

        const handleRequestUpdate = () => {
            apiService
                .post("student/update-information", {
                    type,
                    data,
                })
                .then((response) => {
                    console.log(response);
                    // alert("success");
                    setOpenModal("");
                })
                .catch(console.error);
            setOpenModal("");
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                    className="absolute inset-0 backdrop-blur-sm bg-black/30"
                    onClick={() => setOpenModal("")}
                />

                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg z-10">
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                        onClick={() => setOpenModal("")}
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-lg font-semibold mb-6">{title}</h3>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {fields.map((key) => (
                            <div key={key}>
                                <label className="text-sm font-medium block mb-1">
                                    {key
                                        .replace(/([A-Z])/g, " $1") 
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1)
                                        ) 
                                        .join(" ")}
                                </label>
                                <input
                                    name={key}
                                    value={data[key]}
                                    onChange={(e) => handleChange(e, type)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-right">
                        <button
                            onClick={handleRequestUpdate}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                        >
                            Request Update
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {[
                ["Student Information", studentInfo, "student"],
                ["Personal Information", personalInfo, "personal"],
                ["Guardian Information", guardianInfo, "guardian"],
            ].map(([title, data, type]) => (
                <div key={title} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button
                            className="text-teal-600 text-sm hover:underline"
                            onClick={() => setOpenModal(type)}
                        >
                            Update
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {Object.entries(data).map(([k, v]) => (
                            <div key={k}>
                                <span className="font-medium">
                                    {k
                                        .replace(/([A-Z])/g, " $1")
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1)
                                        ) 
                                        .join(" ")}
                                    :
                                </span>{" "}
                                {v || "-"}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {openModal && (
                <Modal
                    title={`Update ${openModal} Information`}
                    data={
                        openModal === "student"
                            ? studentInfo
                            : openModal === "personal"
                            ? personalInfo
                            : guardianInfo
                    }
                    type={openModal}
                />
            )}
        </div>
    );
};

export default StudentInformationPage;
