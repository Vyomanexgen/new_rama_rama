import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import { markAttendance } from "../../authSync";


import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import Sidebar from "../../components/employeepanel/Sidebar";

import Announcement from "./employee/Announcement";
import MyAttendance from "./employee/MyAttendance";
import Settings from "./employee/settings/Setttings";
import PageNotFound from "../PageNotFound";

// icons
import {
  FaBars,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function EmployeePanel() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  // 🔐 LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/employee/login");
    } catch (err) {
      alert("Logout failed");
      console.error(err);
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Header title map
  const titleMap = {
    "/employee": "Dashboard",
    "/employee/": "Dashboard",
    "/employee/dashboard": "Dashboard",
    "/employee/announcement": "Announcements",
    "/employee/myattendance": "My Attendance",
    "/employee/settings": "Settings",
  };
  const title = titleMap[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-md text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500">Welcome back, Employee</p>
            </div>
          </div>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                E
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">Employee</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
              {profileOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow z-50">
                <Link
                  to="/employee/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardLanding />} />
            <Route path="/dashboard" element={<DashboardLanding />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/myattendance" element={<MyAttendance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function DashboardLanding() {
  const recent = [
    {
      date: "2025-11-02",
      place: "Tech Park",
      in: "09:00 AM",
      out: "06:00 PM",
      status: "Present",
      hours: "9h",
    },
    {
      date: "2025-11-01",
      place: "Tech Park",
      in: "09:15 AM",
      out: "06:00 PM",
      status: "Late",
      hours: "8h 45m",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value="80%" />
        <StatCard title="Present Days" value="3" />
        <StatCard title="Late Arrivals" value="1" />
        <StatCard title="Absent Days" value="1" />
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Attendance</h3>
        </div>

        <div className="p-4 space-y-3">
          {recent.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
            >
              <div>
                <p className="font-medium">{r.date}</p>
                <p className="text-xs text-gray-500">{r.place}</p>
              </div>

              <div className="text-sm">
                {r.in} - {r.out}
              </div>

              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const cls =
    status === "Present"
      ? "bg-green-100 text-green-700"
      : status === "Late"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
