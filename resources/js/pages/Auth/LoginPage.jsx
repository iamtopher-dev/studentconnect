import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Lock, User2 } from "lucide-react";
import apiService from "../../services/apiService";
import Button from "../../components/common/Button";
import logoSchool from "../../assets/images/logo.png";
import logo from "../../assets/images/site_logo.svg";
import building from "../../assets/images/bg.png";

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
            await apiService.get("/sanctum/csrf-cookie");

            const res = await apiService.post(
                "/login",
                { identifier, password },
                { withCredentials: true },
            );

            console.log("Login response:", res.data);

            if (res.data?.status === "success") {
                const role = res.data.user.role.toUpperCase();
                console.log("User role:", role);

                switch (role) {
                    case "STAFF":
                        navigate("/staff");
                        break;
                    case "STUDENT":
                        navigate("/student/information");
                        break;
                    default:
                        alert("Unknown role. Contact admin.");
                }
            } else {
                alert(res.data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Invalid credentials");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex gap-x-6 bg-[#308f00] text-white items-center justify-center py-4 px-4">
                <div>
                    <img
                        src={logoSchool}
                        alt="Logo"
                        className="h-24 w-24 object-contain"
                    />
                </div>
                <div className="leading-tight text-center sm:text-left ">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bookosb">
                        IETI COLLEGE, Inc.
                    </h1>
                    <h6 className="text-sm sm:text-base arial">
                        5 Molina St., Alabang, Muntinlupa City
                    </h6>
                </div>
            </div>

            <div
                className="flex-1 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/60 flex items-center justify-center px-4"
                style={{ backgroundImage: `url(${building})` }}
            >
                <div className="w-full max-w-md">
                    <div className="bg-primary pt-1 rounded-t-xl rounded-xl shadow-xl">
                        <div className="p-8 bg-white rounded-xl">
                            <div className="flex justify-center mb-6">
                                <img
                                    src={logoSchool}
                                    className="h-24 w-24 object-contain"
                                    alt="Logo"
                                />
                            </div>
                            <div className="space-y-4">
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

                                <Button
                                    onClick={handleLogin}
                                    label="Sign in"
                                    variant="primary"
                                    addClass="w-full"
                                    loading={isSubmitting}
                                />

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
