import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import MainLayout from "../components/layout/MainLayout";
import NotFoundPage from "../pages/Error/NotFoundPage";
import StudentLayout from "../components/layout/StudentLayout";
import StaffLayout from "../components/layout/StaffLayout";
import StaffDashboardPage from "../pages/Staff/StaffDashboardPage.jsx";
import RequireAuth from "../services/RequireAuth.jsx";
import IncomingStudentPage from "../pages/Staff/IncomingStudentPage.jsx";
import StudentInformationPage from "../pages/Student/StudentInformationPage.jsx";
import StudentEnrolledSubjects from "../pages/Student/StudentEnrolledSubjects.jsx";
import StudentGradesPage from "../pages/Student/StudentGradesPage.jsx";
import CurriculumPage from "../pages/Staff/CurriculumPage.jsx";
import StudentPage from "../pages/Staff/StudentPage.jsx";
import StudentGradingPage from "../pages/Staff/StudentGradingPage.jsx";
import SchedulePage from "../pages/Staff/SchedulePage.jsx";
import StudentSchedulePage from "../pages/Student/StudentSchedulePage.jsx";
import RequestUpdateInformationPage from "../pages/Staff/RequestUpdateInformationPage.jsx";
const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* Staff */}
                <Route element={<RequireAuth />}>
                    <Route path="/staff" element={<StaffLayout />}>
                        <Route index element={<StaffDashboardPage />} />
                        <Route
                            path="incoming-student"
                            element={<IncomingStudentPage />}
                        />
                        <Route path="curriculum" element={<CurriculumPage />} />
                        <Route path="student" element={<StudentPage />} />
                        <Route
                            path="student-grading"
                            element={<StudentGradingPage />}
                        />
                        <Route path="schedule" element={<SchedulePage />} />
                        <Route path="request-update-information" element={<RequestUpdateInformationPage />} />
                    </Route>
                </Route>

                {/* Student */}
                <Route element={<RequireAuth />}>
                    <Route path="/student" element={<StudentLayout />}>
                        {/* <Route index element={<StudentPage />} /> */}
                        <Route
                            path="information"
                            element={<StudentInformationPage />}
                        />
                        <Route
                            path="enrolled-subjects"
                            element={<StudentEnrolledSubjects />}
                        />
                        <Route path="grades" element={<StudentGradesPage />} />
                        <Route
                            path="schedule"
                            element={<StudentSchedulePage />}
                        />
                    </Route>
                </Route>

                {/* Admin */}

                {/* Errors */}
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/404" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
