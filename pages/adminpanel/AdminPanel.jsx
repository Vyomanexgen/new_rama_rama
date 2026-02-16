import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import SidebarAdmin from "../../components/adminpanel/SidebarAdmin";

import Dashboard from "../../pages/adminpanel/admin/Dashboard";
import Employees from "../../pages/adminpanel/admin/Employees";
import Managers from "../../pages/adminpanel/admin/Managers";
import Reports from "../../pages/adminpanel/admin/Reports";
import Activity from "../../pages/adminpanel/admin/Activity";
import Services from "../../pages/adminpanel/admin/Services";
import Testimonials from "../../pages/adminpanel/admin/Testimonials";
import WhyUs from "../../pages/adminpanel/admin/WhyUs";
import Settings from "../../pages/adminpanel/admin/settings/Settings";

import {
  FaBars,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaIdCard,
} from "react-icons/fa";

import PageNotFound from "../PageNotFound";

// OPTIONAL tutorial steps
const steps = [];

export default function AdminPanel() {
  const [stepIndex, setStepIndex] = useState(steps.length);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // PAGE TITLE
  const titleMap = {
    "/admin": "Dashboard",
    "/admin/": "Dashboard",
    "/admin/dashboard": "Dashboard",
    "/admin/employees": "Employees",
    "/admin/managers": "Managers",
    "/admin/reports": "Reports",
    "/admin/activity": "Activity",
    "/admin/services": "Services",
    "/admin/testimonials": "Testimonials",
    "/admin/whyus": "Why Us",
    "/admin/settings": "Settings",
  };

  const title = titleMap[location.pathname] || "Dashboard";

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login"); // Back to admin login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // OPTIONAL TUTORIAL MODE
  if (stepIndex < steps.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h2>Admin Tutorial Step {stepIndex + 1}</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <SidebarAdmin open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
              <p className="text-gray-500 text-sm">Welcome back, Admin</p>
            </div>
          </div>

          {/* PROFILE MENU */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 shadow-sm hover:bg-gray-100"
            >
              <FaUser className="text-blue-700" />

              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <FaChevronDown className="text-gray-500 text-xs" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg z-50">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100">
                  <FaIdCard />
                  My Profile
                </button>

                <hr />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/employees" element={<Employees />} />
            <Route path="/managers" element={<Managers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activity" element={<Activity />} />

            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/whyus" element={<WhyUs />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
