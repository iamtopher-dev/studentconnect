import React, { useEffect } from "react";
import apiService from "../../services/apiService";

const StudentEnrolledSubjects = () => {
    const [student, setStudent] = React.useState([null]);
    useEffect(() => {
        getEnrolledSubjects();
    }, []);
    const getEnrolledSubjects = () => {
        apiService
            .get("student/get-student-information")
            .then((response) => {
                setStudent(response.data.data);
                console.log(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="min-h-screen  p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Information */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Student Information
                    </h2>

                    <div className="space-y-4 text-sm">
                        {[
                            ["Student Number", student?.student_no || "—"],
                            [
                                "Student Name",
                                `${student.student_information?.family_name}, 
                                ${student.student_information?.first_name} 
                                ${student.student_information?.middle_name}`,
                            ],
                            [
                                "School Year",
                                `${student.student_information?.school_year}` ||
                                    "—",
                            ],
                            [
                                "Semester",
                                `${student.student_information?.semester}` ||
                                    "—",
                            ],
                            [
                                "Course",
                                `${student.student_information?.major}` || "—",
                            ],
                            [
                                "Year Level",
                                `${student.student_information?.year_level}` ||
                                    "—",
                            ],
                            [
                                "Section",
                                `${student.student_information?.section}` ||
                                    "—",
                            ],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium text-gray-800">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enrolled Subjects */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Enrolled Subjects
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 text-left">
                                    <th className="px-3 py-2 font-medium">
                                        Course Code
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                        Course Title
                                    </th>
                                    <th className="px-3 py-2 font-medium text-center">
                                        Units
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-700">
                                {student.enrolled_subjects &&
                                student.enrolled_subjects.length > 0 ? (
                                    student.enrolled_subjects.map((subject) => (
                                        <tr className="hover:bg-gray-50 rounded-lg transition">
                                            <td className="px-3 py-3">{subject.subject_code}</td>
                                            <td className="px-3 py-3 text-gray-400">
                                                {subject.subject_name}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                {subject.subject_units}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="hover:bg-gray-50 rounded-lg transition">
                                        <td className="px-3 py-3">—</td>
                                        <td className="px-3 py-3 text-gray-400">
                                            No enrolled subjects
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            —
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-center text-gray-400 mt-8">
                STUDENT CONNECT – ALABANG
            </p>
        </div>
    );
};

export default StudentEnrolledSubjects;
