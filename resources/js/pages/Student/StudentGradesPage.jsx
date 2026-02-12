import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const StudentGradesPage = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    useEffect(() => {
        getEnrolledSubjects();
    }, []);

    const generateGradeReport = () => {
        if (!selectedYear || !selectedSemester) {
            alert("Please select both Year Level and Semester");
            return;
        }

        apiService
            .post("student/generate-grade-report", {
                year_level: selectedYear,
                semester: selectedSemester,
            })
            .then((res) => {
                setStudent(res.data.data);
                // setGrades(res.data.data);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to fetch grades");
            });
    };

    const getEnrolledSubjects = () => {
        apiService
            .get("student/get-student-information")
            .then((response) => {
                setStudent(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading student grades...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-700 text-lg">
                                    Navigation
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        Year Level
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) =>
                                            setSelectedYear(e.target.value)
                                        }
                                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="">------------</option>
                                        <option value="1st Year">
                                            1st Year
                                        </option>
                                        <option value="2nd Year">
                                            2nd Year
                                        </option>
                                        <option value="3rd Year">
                                            3rd Year
                                        </option>
                                        <option value="4th Year">
                                            4th Year
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) =>
                                            setSelectedSemester(e.target.value)
                                        }
                                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    >
                                        <option value="">------------</option>
                                        <option value="1st Semester">
                                            1st Semester
                                        </option>
                                        <option value="2nd Semester">
                                            2nd Semester
                                        </option>
                                    </select>
                                </div>

                                <button
                                    onClick={generateGradeReport}
                                    className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Display Grades
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-700 text-lg">
                                    Student Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-2 text-sm">
                                {[
                                    [
                                        "Student Number",
                                        student?.student_no || "—",
                                    ],
                                    [
                                        "Student Name",
                                        `${
                                            student?.student_information
                                                ?.family_name ?? ""
                                        }, 
                                         ${
                                             student?.student_information
                                                 ?.first_name ?? ""
                                         } 
                                         ${
                                             student?.student_information
                                                 ?.middle_name ?? ""
                                         }`.trim() || "—",
                                    ],
                                    [
                                        "School Year",
                                        student?.student_information
                                            ?.school_year || "—",
                                    ],
                                    [
                                        "Semester",
                                        student?.student_information
                                            ?.semester || "—",
                                    ],
                                    [
                                        "Course",
                                        student?.student_information?.major ||
                                            "—",
                                    ],
                                    [
                                        "Year Level",
                                        student?.student_information
                                            ?.year_level || "—",
                                    ],
                                    [
                                        "Section",
                                        student?.student_information?.section ||
                                            "—",
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex justify-between bg-gray-50 rounded-lg px-4 py-2"
                                    >
                                        <span className="text-gray-500">
                                            {label}
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-lg h-full">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-700 text-lg">
                                    Student Grades
                                </h2>
                                <span className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">
                                    ☰ Student Checklist
                                </span>
                            </div>

                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {[
                                                "Subject Code",
                                                "Subject Description",
                                                "Units",
                                                "Grade",
                                                "Remarks",
                                            ].map((head) => (
                                                <th
                                                    key={head}
                                                    className="px-4 py-3 text-left font-medium text-gray-700"
                                                >
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {student?.enrolled_subjects?.length >
                                        0 ? (
                                            student.enrolled_subjects.map(
                                                (subject) => {
                                                    const hasGrade =
                                                        subject.grades !==
                                                            null &&
                                                        subject.grades !==
                                                            undefined &&
                                                        subject.grades !== "";

                                                    const grade = hasGrade
                                                        ? Number(subject.grades)
                                                        : null;

                                                    let remark = "-";
                                                    if (
                                                        hasGrade &&
                                                        !isNaN(grade)
                                                    ) {
                                                        remark =
                                                            grade < 75
                                                                ? "Failed"
                                                                : "Passed";
                                                    }

                                                    return (
                                                        <tr
                                                            key={subject.id}
                                                            className="hover:bg-gray-50 transition"
                                                        >
                                                            <td className="px-4 py-3">
                                                                {
                                                                    subject.subject_code
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {
                                                                    subject.subject_name
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {
                                                                    subject.subject_units
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {hasGrade && subject.isReleased
                                                                    ? grade
                                                                    : "-"}
                                                            </td>
                                                            <td
                                                                className={`px-4 py-3 font-medium ${
                                                                    remark ===
                                                                    "Passed"
                                                                        ? "text-green-600"
                                                                        : remark ===
                                                                          "Failed"
                                                                        ? "text-red-600"
                                                                        : "text-gray-400"
                                                                }`}
                                                            >
                                                                {remark}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-4 py-16 text-center text-gray-400"
                                                >
                                                    No grades available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center text-xs text-gray-400">
                    Student Connect – Alabang
                </div>
            </div>
        </div>
    );
};

export default StudentGradesPage;
