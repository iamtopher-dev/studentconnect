import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import apiService from "../../services/apiService";

const COLLEGE_PROGRAMS = ["BSIT", "BSCPE", "BSBA"];
const COLLEGE_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const COLLEGE_SEMESTERS = ["1st Semester", "2nd Semester"];

const SHS_PROGRAMS = ["ICT", "ABM", "HE", "IA"];
const SHS_YEARS = ["Grade 11", "Grade 12"];
const SHS_SEMESTERS = ["1st Semester", "2nd Semester"];

const emptyCurriculumCollege = {
    "1st Year": { "1st Semester": [], "2nd Semester": [] },
    "2nd Year": { "1st Semester": [], "2nd Semester": [] },
    "3rd Year": { "1st Semester": [], "2nd Semester": [] },
    "4th Year": { "1st Semester": [], "2nd Semester": [] },
};

const emptyCurriculumSHS = {
    "Grade 11": { "1st Semester": [], "2nd Semester": [] },
    "Grade 12": { "1st Semester": [], "2nd Semester": [] },
};

const CurriculumPage = () => {
    const [level, setLevel] = useState("College"); // College or SHS
    const [activeProgram, setActiveProgram] = useState(COLLEGE_PROGRAMS[0]);
    const [activeYear, setActiveYear] = useState("1st Year");
    const [activeSemester, setActiveSemester] = useState("1st Semester");
    const [data, setData] = useState({
        College: {
            BSIT: emptyCurriculumCollege,
            BSCPE: emptyCurriculumCollege,
            BSBA: emptyCurriculumCollege,
        },
        SHS: {
            ICT: emptyCurriculumSHS,
            ABM: emptyCurriculumSHS,
            HE: emptyCurriculumSHS,
            IA: emptyCurriculumSHS,
        },
    });
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCurriculum = () => {
        apiService
            .get("/curriculum")
            .then((res) => {
                setData((prev) => ({
                    ...prev,
                    ...res.data,
                }));
            })
            .catch((err) => {
                console.error("Failed to fetch curriculum", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCurriculum();
    }, []);

    const PROGRAMS = level === "College" ? COLLEGE_PROGRAMS : SHS_PROGRAMS;
    const YEARS = level === "College" ? COLLEGE_YEARS : SHS_YEARS;
    const SEMESTERS = level === "College" ? COLLEGE_SEMESTERS : SHS_SEMESTERS;

    const subjects =
        data?.[level]?.[activeProgram]?.[activeYear]?.[activeSemester] || [];

    const handleAddSubject = async (subject) => {
        try {
            const payload = {
                level,
                program: activeProgram,
                year: activeYear,
                semester: activeSemester,
                ...subject,
            };

            const res = await apiService.post("/curriculum", payload);
            fetchCurriculum();
        } catch (error) {
            console.error("Failed to add subject", error);
        }
    };

    const handleDeleteSubject = async (index, id) => {
        try {
            await apiService.delete(`/curriculum/${id}`);
            fetchCurriculum();
        } catch (error) {
            console.error("Failed to delete subject", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading curriculum...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 font-poppins">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Curriculum Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Organize subjects by Level, Program, Year, and
                            Semester
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 sm:px-5 py-2.5
                       text-sm font-medium text-white shadow-md
                       hover:bg-emerald-700 transition"
                    >
                        <Plus size={16} />
                        Add Subject
                    </button>
                </div>

                <div className="flex gap-2 sm:gap-3 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
                    {["College", "SHS"].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => {
                                setLevel(lvl);
                                setActiveProgram(
                                    lvl === "College"
                                        ? COLLEGE_PROGRAMS[0]
                                        : SHS_PROGRAMS[0],
                                );
                                setActiveYear(
                                    lvl === "College"
                                        ? COLLEGE_YEARS[0]
                                        : SHS_YEARS[0],
                                );
                                setActiveSemester("1st Semester");
                            }}
                            className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition
                ${
                    level === lvl
                        ? "bg-emerald-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 sm:gap-3 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
                    {PROGRAMS.map((prog) => (
                        <button
                            key={prog}
                            onClick={() => setActiveProgram(prog)}
                            className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition
                ${
                    activeProgram === prog
                        ? "bg-emerald-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
                        >
                            {prog}
                        </button>
                    ))}
                </div>

                {/* YEAR TABS */}
                <div className="flex gap-2 sm:gap-3 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
                    {YEARS.map((year) => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition
                ${
                    activeYear === year
                        ? "bg-emerald-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {SEMESTERS.map((sem) => (
                        <button
                            key={sem}
                            onClick={() => setActiveSemester(sem)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition
          ${
              activeSemester === sem
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
                        >
                            {sem}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-md overflow-x-auto sm:overflow-x-hidden">
                    <table className="w-full min-w-[600px] text-sm hidden sm:table">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                                    Code
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left font-medium">
                                    Subject
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-center font-medium">
                                    Units
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-16 text-center text-gray-400"
                                    >
                                        No subjects added
                                    </td>
                                </tr>
                            ) : (
                                subjects.map((sub, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 sm:px-6 py-3 font-medium text-gray-800">
                                            {sub.code}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-gray-700">
                                            {sub.name}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-center">
                                            {sub.units}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-right">
                                            <div className="inline-flex gap-2 sm:gap-3">
                                                {/* <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={16} />
                                                </button> */}
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSubject(
                                                            i,
                                                            sub.id,
                                                        )
                                                    }
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {subjects.length > 0 && (
                            <tfoot className="bg-gray-100 text-gray-800 font-medium">
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-4 sm:px-6 py-3 text-right"
                                    >
                                        Total Units:{" "}
                                        {subjects.reduce(
                                            (sum, sub) =>
                                                sum + Number(sub.units),
                                            0,
                                        )}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>

                    <div className="sm:hidden flex flex-col gap-4 py-4">
                        {subjects.length === 0 ? (
                            <p className="text-center text-gray-400">
                                No subjects added
                            </p>
                        ) : (
                            <>
                                {subjects.map((sub, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">
                                                {sub.code}
                                            </span>
                                            <div className="inline-flex gap-2">
                                                <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSubject(
                                                            i,
                                                            sub.id,
                                                        )
                                                    }
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">
                                            {sub.name}
                                        </p>
                                        <p className="text-right font-medium">
                                            {sub.units} Units
                                        </p>
                                    </div>
                                ))}
                                <div className="bg-gray-100 rounded-xl p-4 text-right font-medium">
                                    Total Units:{" "}
                                    {subjects.reduce(
                                        (sum, sub) => sum + Number(sub.units),
                                        0,
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {openModal && (
                    <AddSubjectModal
                        onClose={() => setOpenModal(false)}
                        onSave={handleAddSubject}
                        level_txt={
                            level === "College" ? "Units" : "Number of Hours"
                        }
                    />
                )}
            </div>
        </div>
    );
};

/* ---------------- MODAL ---------------- */
const AddSubjectModal = ({ onClose, onSave, level_txt }) => {
    const [form, setForm] = useState({ code: "", name: "", units: "" });

    const submit = () => {
        if (!form.code || !form.name || !form.units) return;
        onSave({ ...form, units: Number(form.units) });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add Subject
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <ModernInput
                        placeholder="Subject Code"
                        onChange={(e) =>
                            setForm({ ...form, code: e.target.value })
                        }
                    />
                    <ModernInput
                        placeholder="Subject Name"
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                    <ModernInput
                        type="number"
                        placeholder={level_txt}
                        onChange={(e) =>
                            setForm({ ...form, units: e.target.value })
                        }
                    />
                </div>

                <button
                    onClick={submit}
                    className="mt-6 w-full rounded-xl bg-emerald-600 py-3
                     text-sm font-medium text-white shadow-md
                     hover:bg-emerald-700 transition"
                >
                    Save Subject
                </button>
            </div>
        </div>
    );
};

const ModernInput = ({ type = "text", placeholder, onChange }) => (
    <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700
               placeholder-gray-400 outline-none focus:outline-none focus:ring-0
               focus:bg-white focus:shadow-sm transition"
    />
);

export default CurriculumPage;
