import React, { useState } from "react";
import BG_IMAGE_URL from "../../assets/images/bg3.jpg";
import SCHOOL_LOGO from "../../assets/images/site_logo.svg";
import ILLUSTRATION from "../../assets/images/vector.png";
import apiService from "../../services/apiService";

const inputStyle =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500";
const labelStyle = "text-xs font-medium text-gray-600 mb-1";

const Field = ({ label, required = false, children }) => (
    <div className="flex flex-col">
        <label className={labelStyle}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        applicant_type: "",
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        for (const key in formData) {
            if (!formData[key]) {
                alert(`Please fill up the ${key.replace("_", " ")}`);
                return;
            }
        }

        apiService
            .post("/admissions", formData)
            .then((response) => {
                alert(response.data.message);
                setFormData({
                    applicant_type: "",
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
                });
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to submit admission. Please check your input.");
            });
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
                <div className="bg-green-600 text-white flex flex-col justify-between">
                    <div className="bg-white rounded-br-[80px] p-6">
                        <img src={SCHOOL_LOGO} alt="Logo" className="h-10" />
                    </div>
                    <div className="flex justify-center px-6">
                        <img
                            src={ILLUSTRATION}
                            alt="Illustration"
                            className="w-56 object-contain"
                        />
                    </div>
                    <div className="text-center pb-8 px-4">
                        <h2 className="text-xl font-bold">Student Admission</h2>
                        <p className="text-xs opacity-80 mt-1">
                            Please complete all required details
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="md:col-span-2 bg-gray-50 p-5 space-y-4 overflow-y-auto max-h-[80vh]"
                >
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-green-700 mb-3">
                            Admission Application
                        </h3>
                        <div>
                            <Field
                                label="What type of applicant are you?"
                                required
                            >
                                <select
                                    name="applicant_type"
                                    value={formData.applicant_type}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="SHS">
                                        Senior High School
                                    </option>
                                    <option value="COLLEGE">College</option>
                                </select>
                            </Field>
                        </div>
                    </div>
                    {/* STUDENT INFO */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-green-700 mb-3">
                            Student Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Field label="Family Name" required>
                                <input
                                    name="family_name"
                                    value={formData.family_name}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="First Name" required>
                                <input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Middle Name" required>
                                <input
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field
                                label={
                                    formData.applicant_type === "SHS"
                                        ? "Strand"
                                        : "Course"
                                }
                                required
                            >
                                <select
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select</option>
                                    {formData.applicant_type === "SHS" && (
                                        <>
                                            <option value="ICT">
                                                Information and Communications
                                                Technology
                                            </option>
                                            <option value="HE">
                                                Home Economics
                                            </option>
                                            <option value="ABM">
                                                Accountancy, Business, and
                                                Management
                                            </option>
                                            <option value="IA">
                                                Industrial Arts
                                            </option>
                                        </>
                                    )}

                                    {formData.applicant_type === "COLLEGE" && (
                                        <>
                                            <option value="BSIT">BSIT</option>
                                            <option value="BSCPE">BSCPE</option>
                                            <option value="BSBA">BSBA</option>
                                        </>
                                    )}
                                </select>
                            </Field>
                            <Field
                                label={
                                    formData.applicant_type === "SHS"
                                        ? "Grade"
                                        : "Curriculum Year"
                                }
                                required
                            >
                                <select
                                    name="year_level"
                                    value={formData.year_level}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select</option>
                                    {formData.applicant_type === "SHS" && (
                                        <>
                                            <option value="Grade 11">
                                                Grade 11
                                            </option>
                                            <option value="Grade 12">
                                                Grade 12
                                            </option>
                                        </>
                                    )}
                                    {formData.applicant_type === "COLLEGE" && (
                                        <>
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
                                        </>
                                    )}
                                </select>
                            </Field>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-green-700 mb-3">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Field label="Date of Birth" required>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Place of Birth" required>
                                <input
                                    name="place_of_birth"
                                    value={formData.place_of_birth}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Street" required>
                                <input
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Barangay" required>
                                <input
                                    name="barangay"
                                    value={formData.barangay}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Municipality" required>
                                <input
                                    name="municipality"
                                    value={formData.municipality}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Province" required>
                                <input
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Sex" required>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </Field>
                            <Field label="Civil Status" required>
                                <select
                                    name="civil_status"
                                    value={formData.civil_status}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </Field>
                            <Field label="Nationality" required>
                                <input
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Religion" required>
                                <input
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Email" required>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-green-700 mb-3">
                            Guardian Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Field label="Guardian Name" required>
                                <input
                                    name="guardian_name"
                                    value={formData.guardian_name}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Guardian Contact Number" required>
                                <input
                                    name="guardian_contact_number"
                                    value={formData.guardian_contact_number}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-md font-semibold text-sm shadow transition focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Submit Admission
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
