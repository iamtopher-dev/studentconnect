import React, { useState } from "react";
import building from "../../assets/images/building.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Lock, User2 } from "lucide-react";
import logo from "../../assets/images/site_logo.svg";
import Button from "../../components/common/Button";
import apiService from "../../services/apiService";
// import header from "../../assets/images/header.png"

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
                            "Unknown role. Please contact the administrator."
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
        <div
            className="bg-cover bg-no-repeat h-screen w-full bg-blend-overlay bg-black/80 flex items-center justify-center"
            style={{ backgroundImage: `url(${building})` }}
        >
            {/* <img src={header} className="w-full h-52"  alt="" /> */}
            <div className="bg-primary pt-1 rounded-t-xl w-full max-w-sm rounded-xl">
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="justify-items-center mb-4">
                        <img src={logo} className="h-32 w-32" alt="Logo" />
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <User2 size={17} className="text-gray-500" />
                            </div>
                            <input
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5"
                                placeholder="Email or Student no."
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <Lock size={17} className="text-gray-500" />
                            </div>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5"
                                placeholder="Password"
                            />
                        </div>

                        <Button
                            onClick={handleLogin}
                            label={"Sign in"}
                            variant="primary"
                            addClass="w-full"
                            loading={isSubmitting}
                        />
                        {/* <Button
              onClick={handleLogin}
              label="Sign up"
              variant="primary"
              addClass="w-full"
              loading={isSubmitting}
            /> */}

                        <p className="text-sm text-center">
                            Don't have an account?{" "}
                            <NavLink to="/register" className="text-primary">
                                Sign up
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
