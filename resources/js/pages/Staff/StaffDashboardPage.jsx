import React from "react";
import {
    Users,
    UserPlus,
    BookOpen,
    Calendar,
} from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const stats = [
    {
        label: "Total Students",
        value: "0",
        icon: Users,
        bg: "from-green-500 to-emerald-500",
    },
    {
        label: "New Incoming Students",
        value: "0",
        icon: UserPlus,
        bg: "from-blue-500 to-sky-500",
    },
    // {
    //     label: "Total Curriculum",
    //     value: "12",
    //     icon: BookOpen,
    //     bg: "from-purple-500 to-violet-500",
    // },
    // {
    //     label: "Total Student This year",
    //     value: "24",
    //     icon: Calendar,
    //     bg: "from-orange-500 to-amber-500",
    // },
];

const incomingStudentsByYear = [
    { year: "2021", students: 320 },
    { year: "2022", students: 410 },
    { year: "2023", students: 520 },
    { year: "2024", students: 680 },
    { year: "2025", students: 740 },
];

const StaffDashboardPage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-gray-800">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm text-gray-500">
                                {item.label}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {item.value}
                            </h2>
                        </div>

                        <div
                            className={`p-4 rounded-xl bg-gradient-to-br ${item.bg} text-white group-hover:scale-110 transition-transform`}
                        >
                            <item.icon size={26} />
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Incoming Students by Year
                    </h2>
                    <span className="text-sm text-gray-400">
                        Last 5 Years
                    </span>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={incomingStudentsByYear}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                            />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 25px rgba(0,0,0,0.1)",
                                }}
                                labelStyle={{ fontWeight: 600 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#3b82f6" }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div> */}
        </div>
    );
};

export default StaffDashboardPage;
