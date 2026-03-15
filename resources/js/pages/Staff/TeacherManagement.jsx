import React, { useState, useEffect } from "react";
import { Search, X, Check, Trash2, Plus } from "lucide-react";
import Select from "react-select";
import apiService from "../../services/apiService";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";

const ITEMS_PER_PAGE = 10;
const PRIMARY_COLOR = "#307358";

const TeacherManagementPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);

    const [teachers, setTeachers] = useState([]);

    const [form, setForm] = useState({
        name: "",
    });

    const closeModal = () => {
        setOpenModal(false);
        setForm({ name: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =============================
       FETCH TEACHERS
    ============================== */

    const fetchTeachers = async () => {
        try {
            setLoadingScreen(true);

            const response = await apiService.get("/staff/teachers");

            setTeachers(response.data.data ?? response.data);
        } catch (error) {
            console.error("Failed to load teachers", error);
        } finally {
            setLoadingScreen(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    /* =============================
       CREATE TEACHER
    ============================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name) return;

        try {
            setIsSubmitting(true);

            const response = await apiService.post("/staff/teachers", form);

            setTeachers((prev) => [...prev, response.data.data]);

            closeModal();
        } catch (error) {
            console.error("Failed to save teacher", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =============================
       DELETE TEACHER
    ============================== */

    const handleDelete = async (teacher_id) => {
        if (!window.confirm("Are you sure you want to delete this teacher?"))
            return;

        try {
            await apiService.delete(`/staff/teachers/${teacher_id}`);

            setTeachers((prev) =>
                prev.filter((teacher) => teacher.teacher_id !== teacher_id),
            );
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

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
                <div className="flex justify-end"></div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 mt-5">
                    <h2
                        className="font-semibold text-lg sm:text-xl"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Teacher Information
                    </h2>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#037c03] px-4 sm:px-5 py-2.5
                       text-sm font-medium text-white shadow-md
                       hover:bg-emerald-700 transition"
                    >
                        <Plus size={16} />
                        Add Subject
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400 text-left">
                                <th className="pb-4">Name</th>
                                <th className="pb-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {teachers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="2"
                                        className="py-6 text-center text-gray-400"
                                    >
                                        No teachers found
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => (
                                    <tr key={teacher.teacher_id}>
                                        <td className="py-4">{teacher.name}</td>

                                        <td className="py-4">
                                            <Button
                                                type="button"
                                                label={"Remove"}
                                                addClass="bg-red-500 text-white"
                                                icon={Trash2}
                                                onClick={() =>
                                                    handleDelete(
                                                        teacher.teacher_id,
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
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
                                    Teacher Information
                                </h2>

                                <button onClick={closeModal} type="button">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div>
                                <InputField
                                    name="name"
                                    label="Teacher Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    type="text"
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
                                    label={"Save"}
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

export default TeacherManagementPage;
