import React, { useEffect, useState } from "react";
import { Users, UserPlus } from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import apiService from "../../services/apiService";

const StaffDashboardPage = () => {
    const [data, setData] = useState({
        total_students: 0,
        total_incoming_students: 0,
        incoming_per_year: [],
        gender_count: { male: 0, female: 0 },
    });

    useEffect(() => {
        get_dashboard_data();
    }, []);

    const get_dashboard_data = () => {
        apiService
            .get("staff/dashboard")
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((err) => {
                console.error("Error", err);
            });
    };

    // Transform backend data for Recharts
    const chartData = data.incoming_per_year.map((item) => ({
        year: item.year,
        students: item.count,
    }));

    const genderData = [
        { name: "Male", value: data.gender_count.male },
        { name: "Female", value: data.gender_count.female },
    ];

    const COLORS = ["#3b82f6", "#f472b6"]; // blue for male, pink for female

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">
                            {data.total_students}
                        </h2>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white group-hover:scale-110 transition-transform">
                        <Users size={26} />
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">New Incoming Students</p>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">
                            {data.total_incoming_students}
                        </h2>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 text-white group-hover:scale-110 transition-transform">
                        <UserPlus size={26} />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Students by Gender
                    </h2>
                </div>

                <div className="h-72 flex justify-center items-center">
                    <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip
                                formatter={(value) => `${value} students`}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboardPage;