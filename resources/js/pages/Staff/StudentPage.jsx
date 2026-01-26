import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import Select from "react-select";
import apiService from "../../services/apiService";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = "#307358";

const StudentPage = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [students, setStudents] = useState([]);
    const [curriculumSubjects, setCurriculumSubjects] = useState([]);
    const [openModalIrregular, setOpenModalIrregular] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [formData, setFormData] = useState({
        selectedSubjects: [],
    });

    const fetchCurriculum = (major) => {
        if (!major) return;
        apiService
            .get(`/curriculum/${major}`)
            .then((res) => {
                const subjectsFromApi = res.data.data.map((s) => ({
                    value: `${s.id}`,
                    label: `${s.code} | ${s.subject_name}`,
                }));
                setCurriculumSubjects(subjectsFromApi);
            })
            .catch(console.error);
    };

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = () => {
        apiService
            .get("staff/student")
            .then((response) => {
                const apiStudents = response.data.data;
                const formattedStudents = apiStudents.map((student) => {
                    const info = student.student_information || {};
                    const fullName = `${info.family_name || ""} ${
                        info.first_name || ""
                    } ${info.middle_name || ""}`.trim();

                    return {
                        id: student.id,
                        student_type: info.student_type,
                        student_information_id: info.student_information_id,
                        fullName,
                        studentId: student.student_no || "N/A",
                        address: `${info.street || ""}, ${
                            info.barangay || ""
                        }, ${info.municipality || ""}, ${
                            info.province || ""
                        }, ${info.nationality || ""}`,
                        section: info.section || "N/A",
                        major: info.major || "N/A",
                        dob: info.dob || "N/A",
                        phone: info.guardian_contact_number || "N/A",
                    };
                });

                setStudents(formattedStudents);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    };

    const reEnrollStudent = (student) => {
        if (student.student_type !== "REGULAR") {
            setSelectedStudent(student);
            setOpenModalIrregular(true);
            fetchCurriculum(student.major);
            return;
        }

        apiService
            .get(`staff/re-enroll-regular/${student.student_information_id}`)
            .then(() => {
                alert("Student re-enrolled successfully");
                getStudents();
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to re-enroll student");
            });
    };

    const closeModal = () => {
        setOpenModalIrregular(false);
        setFormData({ selectedSubjects: [] });
        setSelectedStudent(null);
    };

    const handleSubjectChange = (selected) => {
        setFormData({ selectedSubjects: selected });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedStudent || formData.selectedSubjects.length === 0) {
            alert("Please select subjects");
            return;
        }

        apiService
            .post("staff/re-enroll-irregular", {
                student_information_id: selectedStudent.student_information_id,
                subjects: formData.selectedSubjects.map((s) => s.value),
            })
            .then((response) => {
                alert("Student re-enrolled successfully");
                console.log(response)
                closeModal();
                getStudents();
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to re-enroll student");
            });
    };

    const filteredStudents = useMemo(() => {
        return students.filter(
            (s) =>
                (s.fullName?.toLowerCase() || "").includes(
                    search.toLowerCase()
                ) ||
                (s.studentId?.toLowerCase() || "").includes(
                    search.toLowerCase()
                )
        );
    }, [students, search]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = filteredStudents.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    Students List
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                    Home / Students
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
                                setSearch(e.target.value);
                                setPage(1);
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
                                <th className="pb-4">Student Id</th>
                                <th className="pb-4">Address</th>
                                <th className="pb-4">Section</th>
                                <th className="pb-4">Course</th>
                                <th className="pb-4">Date of Birth</th>
                                <th className="pb-4">Phone</th>
                                <th className="pb-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStudents.map((s) => (
                                <tr key={s.id}>
                                    <td className="py-4">{s.fullName}</td>
                                    <td className="py-4">{s.studentId}</td>
                                    <td className="py-4">{s.address}</td>
                                    <td className="py-4">{s.section}</td>
                                    <td className="py-4">{s.major}</td>
                                    <td className="py-4">{s.dob}</td>
                                    <td className="py-4">{s.phone}</td>
                                    <td className="py-4">
                                        <button
                                            onClick={() => reEnrollStudent(s)}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            Re-enroll
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* IRREGULAR MODAL (UNCHANGED UI) */}
            {openModalIrregular && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Re-enroll Student
                                </h2>
                                <button onClick={closeModal} type="button">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                    Curriculum Subjects
                                </label>
                                <Select
                                    isMulti
                                    options={curriculumSubjects}
                                    value={formData.selectedSubjects}
                                    onChange={handleSubjectChange}
                                    classNamePrefix="react-select"
                                    placeholder="Select subjects..."
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    formatOptionLabel={(option, { context }) =>
                                        context === "value"
                                            ? option.label.split(" | ")[0]
                                            : option.label
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2 border rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Re-enroll Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPage;
