import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Check, X } from "lucide-react";
import apiService from "../../services/apiService";

const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const gradeLevels = ["Grade 11", "Grade 12"];
const sections = ["A", "B", "C"];

const semesters = ["1st Semester", "2nd Semester"];
const studentTypes = ["Regular", "Irregular"];

const IncomingStudentPage = () => {
    const [incomingStudents, setIncomingStudents] = useState([]);
    const [curriculumSubjects, setCurriculumSubjects] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        family_name: "",
        first_name: "",
        middle_name: "",
        major: "",
        year_level: "",
        dob: "",
        place_of_birth: "",
        street: "",
        barangay: "",
        municipality: "",
        province: "",
        nationality: "",
        sex: "",
        civil_status: "",
        religion: "",
        email: "",
        guardian_name: "",
        guardian_contact_number: "",
        studentType: "",
        studentId: "",
        section: "",
        semester: "",
        selectedSubjects: [],
    });
useEffect(() => {
        fetchIncomingStudents();
    }, []);
    const filteredSections =
        formData.applicant_type === "SHS"
            ? sections.filter((section) => section !== "C")
            : sections;

    const fetchIncomingStudents = () => {
        apiService
            .get("staff/incoming-students")
            .then((res) => {
                setIncomingStudents(res.data.data);
                console.log(res.data.data);
            })
            .catch(console.log)
            .finally(() => setLoading(false));
    };

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

    

    const openModal = (student) => {
        setSelectedStudent(student);
        console.log(student);
        setFormData({
            family_name: student.family_name || "",
            first_name: student.first_name || "",
            middle_name: student.middle_name || "",
            major: student.major || "",
            year_level: student.year_level || "",
            dob: student.dob || "",
            place_of_birth: student.place_of_birth || "",
            street: student.street || "",
            barangay: student.barangay || "",
            municipality: student.municipality || "",
            province: student.province || "",
            nationality: student.nationality || "",
            applicant_type: student.applicant_type || "",
            sex: student.sex || "",
            civil_status: student.civil_status || "",
            religion: student.religion || "",
            email: student.email || "",
            guardian_name: student.guardian_name || "",
            guardian_contact_number: student.guardian_contact_number || "",
            studentType: "",
            studentId: "",
            section: "",
            semester: "",
            selectedSubjects: [],
        });

        fetchCurriculum(student.major);
    };

    const closeModal = () => setSelectedStudent(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (selected) => {
        setFormData((prev) => ({ ...prev, selectedSubjects: selected }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.studentId || !formData.section || !formData.semester) {
            alert("Please fill all required fields.");
            return;
        }

        apiService
            .post(
                `/staff/accept-student/${selectedStudent.student_information_id}`,
                formData,
            )
            .then(() => {
                alert("Student accepted successfully!");
                setSelectedStudent(null);
                fetchIncomingStudents();
            })
            .catch(() => alert("Failed to accept student."));
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading incoming students...
            </div>
        );
    }
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-poppins">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Incoming Students
                </h1>
                <p className="text-gray-500 mt-1">
                    Review and accept incoming student registrations
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100 text-gray-600 text-sm tracking-wide">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Applicant Type
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Course
                            </th>
                            <th className="px-6 py-4 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomingStudents.map((student) => (
                            <tr
                                key={student.id}
                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {student.family_name}, {student.first_name}{" "}
                                    {student.middle_name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {student.email}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {student.applicant_type}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {student.major}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => openModal(student)}
                                        className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition"
                                    >
                                        Accept
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Accept Student
                                </h2>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Applicant Type:
                                </h3>

                                <span
                                    className="inline-flex items-center rounded-full 
                   bg-emerald-100 text-emerald-700 
                   px-3 py-1 text-xs font-semibold"
                                >
                                    {formData.applicant_type}
                                </span>
                            </div>

                            <Section title="Student Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Family Name"
                                        value={formData.family_name}
                                        readOnly
                                    />
                                    <InputField
                                        label="First Name"
                                        value={formData.first_name}
                                        readOnly
                                    />
                                    <InputField
                                        label="Middle Name"
                                        value={formData.middle_name}
                                        readOnly
                                    />
                                    <InputField
                                        label="Major"
                                        value={formData.major}
                                        readOnly
                                    />
                                    <SelectField
                                        label="Year Level"
                                        name="year_level"
                                        value={formData.year_level}
                                        options={
                                            formData.applicant_type === "SHS"
                                                ? gradeLevels
                                                : yearLevels
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputField
                                        label="Sex"
                                        value={formData.sex}
                                        readOnly
                                    />
                                    <InputField
                                        label="Date of Birth"
                                        type="date"
                                        value={formData.dob}
                                        readOnly
                                    />
                                    <InputField
                                        label="Place of Birth"
                                        value={formData.place_of_birth}
                                        readOnly
                                    />
                                    <InputField
                                        label="Street"
                                        value={formData.street}
                                        readOnly
                                    />
                                    <InputField
                                        label="Barangay"
                                        value={formData.barangay}
                                        readOnly
                                    />
                                    <InputField
                                        label="Municipality"
                                        value={formData.municipality}
                                        readOnly
                                    />
                                    <InputField
                                        label="Province"
                                        value={formData.province}
                                        readOnly
                                    />
                                    <InputField
                                        label="Nationality"
                                        value={formData.nationality}
                                        readOnly
                                    />
                                    <InputField
                                        label="Civil Status"
                                        value={formData.civil_status}
                                        readOnly
                                    />
                                    <InputField
                                        label="Religion"
                                        value={formData.religion}
                                        readOnly
                                    />
                                    <InputField
                                        label="Email"
                                        value={formData.email}
                                        readOnly
                                    />
                                </div>
                            </Section>

                            <Section title="Guardian Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Guardian Name"
                                        value={formData.guardian_name}
                                        readOnly
                                    />
                                    <InputField
                                        label="Guardian Contact Number"
                                        value={formData.guardian_contact_number}
                                        readOnly
                                    />
                                </div>
                            </Section>

                            <Section title="Student Enrollment">
                                <SelectField
                                    label="Student Type"
                                    name="studentType"
                                    value={formData.studentType}
                                    options={studentTypes}
                                    onChange={handleChange}
                                />
                                <InputField
                                    label="Student ID"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField
                                        label="Section"
                                        name="section"
                                        value={formData.section}
                                        options={filteredSections}
                                        onChange={handleChange}
                                        required
                                    />
                                    <SelectField
                                        label="Semester"
                                        name="semester"
                                        value={formData.semester}
                                        options={semesters}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {formData.studentType === "Irregular" && (
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
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value
                                            }
                                            formatOptionLabel={(
                                                option,
                                                { context },
                                            ) =>
                                                context === "value"
                                                    ? option.label.split(
                                                          " | ",
                                                      )[0]
                                                    : option.label
                                            }
                                        />
                                    </div>
                                )}
                            </Section>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 transition"
                                >
                                    <Check className="w-5 h-5" />
                                    Accept Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomingStudentPage;

const InputField = ({
    label,
    value,
    type = "text",
    readOnly = false,
    required = false,
    name,
    onChange,
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required={required}
            className={`w-full px-5 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
    </div>
);

const SelectField = ({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        >
            <option value="">Select {label}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="font-semibold text-green-700 mb-3">{title}</h3>
        {children}
    </div>
);
