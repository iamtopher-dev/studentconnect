import React, { useState, useMemo, useEffect } from "react";
import { Search, Pencil, Upload, X, Check } from "lucide-react";
import * as XLSX from "xlsx";
import apiService from "../../services/apiService";

const PRIMARY_COLOR = "#307358";

const StudentGradingPage = () => {
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editableSubjects, setEditableSubjects] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = () => {
        apiService
            .get("staff/student")
            .then((response) => {
                console.log("API response:", response);
                const formattedStudents = response.data.data.map((student) => {
                    const info = student.student_information || {};

                    return {
                        id: student.id,
                        fullName: `${info.family_name || ""}, ${info.first_name || ""
                            } ${info.middle_name || ""}`.trim(),
                        studentId: student.student_no || "N/A",
                        major: info.major || "N/A",
                        year_level: info.year_level || "N/A",
                        enrolled_subjects: student.enrolled_subjects || [],
                    };
                });
                setStudents(formattedStudents);
            })
            .finally(() => setLoadingScreen(false));
    };

    const filteredStudents = useMemo(() => {
        return students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                s.studentId.toLowerCase().includes(search.toLowerCase()),
        );
    }, [students, search]);

    const handleExcelUpload = (file) => {
        if (!file) return;
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            const sheetData = XLSX.utils.sheet_to_json(firstSheet, {
                header: 1,
                defval: "",
            });

            console.log("row 14 ito", sheetData[14]);

            const newStudents = sheetData
                .slice(14)
                .filter((row) => row[1] && typeof row[1] === "string")
                .map((row, index) => ({
                    id: index + 1,
                    fullName: row[1],
                    finalGrade: row[76],
                }));

            console.log("results", newStudents);
            setLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    const saveGradesByExcel = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);

            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const sheetData = XLSX.utils.sheet_to_json(firstSheet, {
                    header: 1,
                    defval: "",
                });

                const course = sheetData[2][2];
                const section = sheetData[3][2];
                const subjectCode = sheetData[4][2];

                const grades = sheetData
                    .slice(14)
                    .filter((row) => row[1] && typeof row[1] === "string")
                    .map((row) => ({
                        fullName: row[1],
                        finalGrade: row[76],
                    }));

                const payload = {
                    course: course,
                    section: section,
                    grades: grades,
                    subjectCode: subjectCode,
                };

                apiService
                    .post("staff/save-student-grades-by-excel", payload)
                    .then((response) => {
                        console.log(response);
                        alert("Grades saved successfully!");
                        setModalOpen(false);
                        setSelectedFile(null);
                        document.getElementById("excelInput").value = null;
                        setLoading(false);
                        getStudents();
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to save grades.");
                        setLoading(false);
                    });
            };

            reader.readAsArrayBuffer(selectedFile);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const confirmUpload = () => {
        saveGradesByExcel();
    };

    const openUploadExcelModal = () => {
        setModalOpen(true);
        setSelectedFile(null);
        document.getElementById("excelInput").value = null;
    };

    const openEditGrades = (student) => {
        setSelectedStudent(student);
        setEditableSubjects(
            student.enrolled_subjects.map((s) => ({
                ...s,
                grades: s.grades ?? "",
            })),
        );
        setEditModalOpen(true);
    };

    const releaseGrades = (userId, subjects) => {
        console.log(subjects)
        apiService
            .post(`staff/release-grades-students/${userId}`, {subjects:subjects})
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to release grades");
                setLoading(false);
            });
    }

    const handleGradeChange = (id, value) => {
        setEditableSubjects((prev) =>
            prev.map((s) =>
                s.student_subject_id === id ? { ...s, grades: value } : s,
            ),
        );
    };

    const saveGrades = async () => {
        if (!selectedStudent) return;

        try {
            setLoading(true);

            const payload = {
                student_id: selectedStudent.id,
                grades: editableSubjects.map((s) => ({
                    student_subject_id: s.student_subject_id,
                    grade: s.grades,
                })),
            };

            console.log("Payload to be sent:", payload);
            // Call API
            await apiService.post("staff/save-student-grades", payload);

            setStudents((prev) =>
                prev.map((s) =>
                    s.id === selectedStudent.id
                        ? { ...s, enrolled_subjects: editableSubjects }
                        : s,
                ),
            );

            setEditModalOpen(false);
            setSelectedStudent(null);
            setEditableSubjects([]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to save grades:", error);
            setLoading(false);
            alert("Failed to save grades. Please try again.");
        }
    };
    if (loadingScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading student grading...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    Student Grading
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Academic Management / Grading
                </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search
                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search student"
                        className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 text-sm sm:text-base"
                        style={{ outlineColor: PRIMARY_COLOR }}
                    />
                </div>

                <button
                    onClick={() => openUploadExcelModal()}
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-medium shadow-sm hover:opacity-90 w-full sm:w-auto"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    <Upload size={18} />
                    <span className="text-sm sm:text-base">Upload Excel</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredStudents.map((s) => (
                    <div
                        key={s.id}
                        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex justify-between mb-3 sm:mb-4">
                            <div className="overflow-hidden">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                                    {s.fullName}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 truncate">
                                    {s.studentId}
                                </p>
                                <p
                                    className="text-xs sm:text-sm font-medium truncate"
                                    style={{ color: PRIMARY_COLOR }}
                                >
                                    {s.major} · {s.year_level}
                                </p>
                            </div>

                            <button
                                onClick={() => openEditGrades(s)}
                                className="text-slate-400 hover:text-slate-600 ml-2 flex-shrink-0"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm max-h-40 overflow-y-auto">
                            {s.enrolled_subjects.map((sub) => (
                                <div
                                    key={sub.student_subject_id}
                                    className="flex justify-between"
                                >
                                    <span className="text-slate-600 truncate">
                                        {sub.subject_name}
                                    </span>
                                    <span className="font-medium">
                                        {sub.grades ?? "—"}
                                    </span>
                                </div>
                            ))}

                        </div>
                        <button
                            onClick={() => releaseGrades(s.student_information_id,s.enrolled_subjects)}
                            className="flex items-center w-full text-sm justify-center gap-2 px-5 sm:px-6 py-1 sm:py-2 rounded-xl text-white font-medium shadow-sm hover:opacity-90 w-full sm:w-auto"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            <span className="text-sm sm:text-base">Release Grades</span>
                        </button>
                    </div>
                ))}
            </div>

            {editModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-5 sm:p-7 relative shadow-xl">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg sm:text-xl font-semibold mb-1">
                            Edit Grades
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
                            {selectedStudent.fullName}
                        </p>

                        <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                            {editableSubjects.map((sub) => (
                                <div
                                    key={sub.student_subject_id}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-slate-700 truncate text-xs sm:text-sm">
                                        {sub.subject_name}
                                    </span>
                                    <input
                                        value={sub.grades}
                                        onChange={(e) =>
                                            handleGradeChange(
                                                sub.student_subject_id,
                                                e.target.value,
                                            )
                                        }
                                        className="w-16 sm:w-24 text-center bg-slate-100 rounded-xl py-1 sm:py-2 text-xs sm:text-sm outline-none focus:ring-2"
                                        style={{ outlineColor: PRIMARY_COLOR }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={saveGrades}
                            className="mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-xl text-white font-medium"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            <Check size={18} className="inline mr-2" />
                            Save Grades
                        </button>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 relative shadow-xl">
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setSelectedFile(null);
                                document.getElementById("excelInput").value =
                                    null;
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                            Upload Excel File
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mb-5">
                            Select a properly formatted Excel file to import
                            grades.
                        </p>

                        {/* DROP AREA */}
                        <div
                            onClick={() =>
                                document.getElementById("excelInput").click()
                            }
                            className="border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-slate-400 transition"
                        >
                            <Upload
                                className="mx-auto mb-3 text-slate-400"
                                size={36}
                            />

                            {!selectedFile ? (
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Click to select Excel file
                                </p>
                            ) : (
                                <p className="text-sm sm:text-base text-slate-700 font-medium truncate">
                                    📄 {selectedFile.name}
                                </p>
                            )}

                            <input
                                id="excelInput"
                                type="file"
                                accept=".xlsx,.xls,.xlsb,.xlsm"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setSelectedFile(file);
                                    handleExcelUpload(file);
                                }}
                            />
                        </div>

                        <button
                            onClick={confirmUpload}
                            disabled={!selectedFile}
                            className={`mt-4 sm:mt-6 w-full py-2 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition
                ${selectedFile
                                    ? "text-white"
                                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                }`}
                            style={{
                                backgroundColor: selectedFile
                                    ? PRIMARY_COLOR
                                    : undefined,
                            }}
                        >
                            <Check size={18} />
                            Confirm Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentGradingPage;
