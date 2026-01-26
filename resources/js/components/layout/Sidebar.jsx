import React, { useState } from "react";
import { SiderBarLinkSingle } from "../common/SideBarLink";
import { LayoutDashboard, Users, UserPlus, UserCheck, LogIn } from "lucide-react";

import apiService from "../../services/apiService";
import logo from "../../assets/images/site_logo.svg";

const Sidebar = ({ userRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    apiService
      .post("logout")
      .finally(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      });
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-gray-500 rounded-lg sm:hidden hover:bg-gray-200 transition"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="px-4 py-6 flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-16 mb-4" />
            <span className="text-lg font-semibold text-gray-700">Student Connect</span>
          </div>

          {/* Links */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {userRole === "ADMIN" && (
              <>
                <SiderBarLinkSingle
                  url="/admin"
                  label="Dashboard"
                  icon={<LayoutDashboard size={20} />}
                />
                <p className="px-2 mt-4 mb-1 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Users
                </p>
                <SiderBarLinkSingle
                  url="/admin/teacher"
                  label="Teachers"
                  icon={<Users size={20} />}
                />
                <p className="px-2 mt-4 mb-1 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Management
                </p>
                <SiderBarLinkSingle
                  url="/admin/curriculum"
                  label="Curriculum"
                  icon={<Users size={20} />}
                />
              </>
            )}

            {userRole === "STAFF" && (
              <>
                <SiderBarLinkSingle
                  url="/staff"
                  label="Dashboard"
                  icon={<LayoutDashboard size={20} />}
                />
                <p className="px-2 mt-4 mb-1 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Incoming Student
                </p>
                <SiderBarLinkSingle
                  url="/staff/incoming-student"
                  label="New Student"
                  icon={<UserPlus size={20} />}
                />
                <p className="px-2 mt-4 mb-1 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Students
                </p>
                <SiderBarLinkSingle
                  url="/staff/student"
                  label="Student List"
                  icon={<UserCheck size={20} />}
                />
                <SiderBarLinkSingle
                  url="/staff/student-grading"
                  label="Grading"
                  icon={<UserCheck size={20} />}
                />

                <SiderBarLinkSingle
                  url="/staff/request-update-information"
                  label="Request Update Information"
                  icon={<UserCheck size={20} />}
                />
                <p className="px-2 mt-4 mb-1 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Settings
                </p>
                <SiderBarLinkSingle
                  url="/staff/curriculum"
                  label="Curriculum"
                  icon={<UserCheck size={20} />}
                />

                <SiderBarLinkSingle
                  url="/staff/schedule"
                  label="Class Schedule"
                  icon={<UserCheck size={20} />}
                />
              </>
            )}

            {userRole === "STUDENT" && (
              <>
                
                <SiderBarLinkSingle
                  url="/student/information"
                  label="Student Information"
                  icon={<LayoutDashboard size={20} />}
                />
                <SiderBarLinkSingle
                  url="/student/schedule"
                  label="Class Schedule"
                  icon={<LayoutDashboard size={20} />}
                />
                <SiderBarLinkSingle
                  url="/student/enrolled-subjects"
                  label="Enrolled Subjects"
                  icon={<LayoutDashboard size={20} />}
                />
                <SiderBarLinkSingle
                  url="/student/grades"
                  label="Grades"
                  icon={<LayoutDashboard size={20} />}
                />
              </>
            )}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <LogIn size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 sm:hidden z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
