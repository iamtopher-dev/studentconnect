import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import Select from "react-select";
import apiService from "../../services/apiService";
import Button from "../../components/common/Button";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = "#307358";

const StudentPage = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [students, setStudents] = useState([]);
    const [curriculumSubjects, setCurriculumSubjects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [applicantTypeFilter, setApplicantTypeFilter] = useState("ALL");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingIds, setLoadingIds] = useState([]);

    const [nextSubjectEnrolled,setNextSubjectenrolled] = useState([])

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
        console.log("Show Me ", students);
    }, []);

    const getStudents = () => {
        apiService
            .get("staff/student")
            .then((response) => {
                const apiStudents = response.data.data;

                const formattedStudents = apiStudents.map((student) => {
                    console.log();
                    const info = student.student_information || {};
                    const fullName = `${info.family_name || ""} ${
                        info.first_name || ""
                    } ${info.middle_name || ""}`.trim();

                    return {
                        id: student.id,
                        applicant_type: info.applicant_type,
                        student_type: info.student_type,
                        student_information_id: info.student_information_id,
                        fullName,
                        year_level: info.year_level,
                        semester: info.semester,
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
                        enrolled_subjects: student.enrolled_subjects || [],
                    };
                });

                setStudents(formattedStudents);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            })
            .finally(() => setLoadingScreen(false));
    };

    const reEnrollStudent = (student) => {
        console.log("Re-enrolling student:", student);
        // setLoadingIds((prev) => [...prev, student.id]);
        const allReleased =
            student.enrolled_subjects.length > 0 &&
            student.enrolled_subjects.every((sub) => sub.isReleased === 1);

        if (!allReleased) {
            Swal.fire({
                title: "Grades Not Released",
                text: "Some grades are still pending release. Please complete all entries before releasing.",
                icon: "warning",
            });
            setLoadingIds((prev) => prev.filter((id) => id !== student.id));
            return;
        }

        console.log(student);
        apiService
            .get(`staff/re-enroll/${student.student_information_id}`)
            .then((resp) => {
                console.log("resultsa", resp);
                const subjectsFromApi = resp.data.data.map((s) => ({
                    value: `${s.id}`,
                    label: `${s.code} | ${s.subject_name}`,
                }));
                setFormData({ selectedSubjects: subjectsFromApi })
                // Swal.fire({
                //     title: "Success",
                //     text: "Student re-enrolled successfully",
                //     icon: "success",
                //     confirmButtonColor: PRIMARY_COLOR,
                // });
                // getStudents();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                // setLoadingIds((prev) => prev.filter((id) => id !== student.id));
            });
        setSelectedStudent(student);
        setOpenModal(true);
        fetchCurriculum(student.major);
    };

    const closeModal = () => {
        setOpenModal(false);
        setFormData({ selectedSubjects: [] });
        setSelectedStudent(null);
    };

    const handleSubjectChange = (selected) => {
        setFormData({ selectedSubjects: selected });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoadingIds((prev) => [...prev, selectedStudent.id]);
        if (!selectedStudent || formData.selectedSubjects.length === 0) {
            alert("Please select subjects");
            return;
        }

        apiService
            .post("staff/re-enroll-submit", {
                student_information_id: selectedStudent.student_information_id,
                subjects: formData.selectedSubjects.map((s) => s.value),
            })
            .then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Student re-enrolled successfully",
                    icon: "success",
                    confirmButtonColor: PRIMARY_COLOR,
                });
                closeModal();
                getStudents();
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to re-enroll student",
                    icon: "error",
                    confirmButtonColor: PRIMARY_COLOR,
                });
            })
            .finally(() => {
                setLoadingIds((prev) =>
                    prev.filter((id) => id !== selectedStudent.id),
                );
            });
    };

    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            const matchesSearch =
                (s.fullName?.toLowerCase() || "").includes(
                    search.toLowerCase(),
                ) ||
                (s.studentId?.toLowerCase() || "").includes(
                    search.toLowerCase(),
                );

            const matchesApplicantType =
                applicantTypeFilter === "ALL" ||
                s.applicant_type === applicantTypeFilter;

            return matchesSearch && matchesApplicantType;
        });
    }, [students, search, applicantTypeFilter]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

    const paginatedStudents = filteredStudents.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
    );

    if (loadingScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading student...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    Student List
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                    Home / Students
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                    <h2
                        className="font-semibold text-lg sm:text-xl"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Student Information
                    </h2>

                    <div className="relative w-full sm:w-64">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by name or student number"
                            className="pl-9 pr-3 py-2.5 text-sm rounded-xl w-full focus:outline-none"
                            style={{
                                backgroundColor: "#E6F0EE",
                                border: `1px solid ${PRIMARY_COLOR}`,
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {["ALL", "SHS", "COLLEGE"].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setApplicantTypeFilter(type);
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                applicantTypeFilter === type
                                    ? "text-white bg-[#037c03]"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400 text-left">
                                <th className="pb-4">Name</th>
                                <th className="pb-4">Student Number</th>
                                <th className="pb-4">Address</th>
                                <th className="pb-4">Section</th>
                                <th className="pb-4">Semester</th>

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
                                    <td
                                        className="py-4 truncate max-w-xs"
                                        title={s.address}
                                    >
                                        {s.address}
                                    </td>
                                    <td className="py-4">{s.section}</td>
                                    <td className="py-4">{s.semester}</td>
                                    <td className="py-4">{s.major}</td>

                                    <td className="py-4">{s.dob}</td>
                                    <td className="py-4">{s.phone}</td>
                                    <td className="py-4">
                                        {(s.year_level === "4th Year" &&
                                            s.semester === "2nd Semester") ||
                                        (s.year_level === "Grade 12" &&
                                            s.semester === "2nd Semester") ? (
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                                                Graduating
                                            </span>
                                        ) : (
                                            <Button
                                                key={s.id}
                                                type="button"
                                                label={"Re-enroll"}
                                                variant="primary"
                                                addClass=""
                                                loading={loadingIds.includes(
                                                    s.id,
                                                )}
                                                onClick={() =>
                                                    reEnrollStudent(s)
                                                }
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {openModal && (
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

                                <Button
                                    type="submit"
                                    label={"Re-enroll Student"}
                                    variant="primary"
                                    addClass=""
                                    loading={isSubmitting}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPage;
