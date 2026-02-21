import React, { useState } from "react";
import building from "../../assets/images/bg.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Lock, User2 } from "lucide-react";
import logo from "../../assets/images/site_logo.svg";
import Button from "../../components/common/Button";
import apiService from "../../services/apiService";
import header from "../../assets/images/header.png";
// import header from "../../assets/images/header.png"
import logoSchool from "../../assets/images/logo.png";
const LoginPage = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            alert("Please fill in all fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await apiService.post("/login", {
                identifier,
                password,
            });

            if (response.status === 200 && response.data.status === "success") {
                const { data, token } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(data));

                switch (data.role) {
                    case "STAFF":
                        navigate("/staff");
                        break;
                    case "ADMIN":
                        navigate("/admin");
                        break;
                    case "STUDENT":
                        navigate("/student");
                        break;
                    default:
                        alert(
                            "Unknown role. Please contact the administrator.",
                        );
                }
            } else {
                alert(response.data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            const message =
                error.response?.data?.message ||
                "Invalid credentials. Please try again.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex gap-x-6 bg-[#037c03] text-white items-center justify-center py-4 px-4">
                <div>
                    <img
                        src={logoSchool}
                        alt="Logo"
                        className="h-24 w-24 object-contain"
                    />
                </div>

                <div className="leading-tight text-center sm:text-left">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                        IETI COLLEGE, Inc.
                    </h1>
                    <h6 className="text-sm sm:text-base">
                        5 Molina St., Alabang, Muntinlupa City
                    </h6>
                </div>
            </div>

            {/* Background Section */}
            <div
                className="flex-1 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/60 flex items-center justify-center px-4"
                style={{ backgroundImage: `url(${building})` }}
            >
                <div className="w-full max-w-md">
                    <div className="bg-primary pt-1 rounded-t-xl rounded-xl shadow-xl">
                        <div className="p-8 bg-white rounded-xl">
                            <div className="flex justify-center mb-6">
                                <img
                                    src={logo}
                                    className="h-24 w-24 object-contain"
                                    alt="Logo"
                                />
                            </div>

                            <div className="space-y-4">
                                {/* Identifier */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <User2
                                            size={17}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <input
                                        value={identifier}
                                        onChange={(e) =>
                                            setIdentifier(e.target.value)
                                        }
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                                        placeholder="Email or Student no."
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock
                                            size={17}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <input
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        type="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                                        placeholder="Password"
                                    />
                                </div>

                                {/* Button */}
                                <Button
                                    onClick={handleLogin}
                                    label={"Sign in"}
                                    variant="primary"
                                    addClass="w-full"
                                    loading={isSubmitting}
                                />

                                {/* Register */}
                                <p className="text-sm text-center">
                                    Don't have an account?{" "}
                                    <NavLink
                                        to="/register"
                                        className="text-primary font-medium hover:underline"
                                    >
                                        Sign up
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
