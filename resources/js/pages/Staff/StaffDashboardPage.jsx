import React, { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    TrendingUp,
    GraduationCap,
    School,
    Award,
} from "lucide-react";

import {
    BarChart,
    Bar,
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


const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

const StaffDashboardPage = () => {
    const [data, setData] = useState({
        overview: {},
        acceptance_rate: 0,
        top_program: {},
        by_major: [],
        by_year_level: [],
        student_type: [],
        by_school_year: [],
        monthly_registrations: [],
        age_distribution: [],
    });

    useEffect(() => {
        apiService
            .get("staff/dashboard")
            .then((res) => {
                console.log(res.data)
                setData(res.data)
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Staff Dashboard
                </h1>
                <div className="text-sm text-gray-500">
                    Academic Overview & Analytics
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Students"
                    value={data.overview.total_students}
                    icon={<Users />}
                    color="from-blue-500 to-indigo-500"
                />

                <DashboardCard
                    title="Approved Students"
                    value={data.overview.approved_students}
                    icon={<UserCheck />}
                    color="from-green-500 to-emerald-500"
                />

                <DashboardCard
                    title="Pending Applications"
                    value={data.overview.pending_students}
                    icon={<UserX />}
                    color="from-yellow-500 to-orange-500"
                />

                <DashboardCard
                    title="Acceptance Rate"
                    value={`${data.acceptance_rate}%`}
                    icon={<TrendingUp />}
                    color="from-purple-500 to-pink-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students by Major */}
                <Card title="Students by Major">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.by_major}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                fill="#6366f1"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Students by Year Level */}
                <Card title="Students by Year Level">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.by_year_level}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                fill="#10b981"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Student Type Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.student_type}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                label
                            >
                                {data.student_type.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment by School Year */}
                <Card title="Enrollment by School Year">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.by_school_year}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Monthly Registrations">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.monthly_registrations}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#f43f5e"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Age Distribution */}
                <Card title="Age Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.age_distribution}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {data.age_distribution.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Most Enrolled Program
                        </p>
                        <h2 className="text-2xl font-bold text-gray-800 mt-2">
                            {data.top_program?.major}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {data.top_program?.total} students
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        <Award size={30} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center hover:shadow-xl transition">
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {value || 0}
            </h2>
        </div>
        <div className={`p-4 rounded-xl text-white bg-gradient-to-br ${color}`}>
            {icon}
        </div>
    </div>
);

const Card = ({ title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

export default StaffDashboardPage;
