import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUserClock,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFingerprint,
  FaUser,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarker,
  FaBars,
  FaIdCard,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import Sidebar from "../../components/managerpanel/Sidebar";
import StatCard from "../../components/StatCard";
import TrackStatus from "../../components/TrackStatus";
import ActionButton from "../../components/ActionButton";
import { managerApi } from "../../api/managerApi";

// Pages
import Attendance from "./Attendance";
import Fingerprint from "./Fingerprint";
import Location from "./Location ";
import Employees from "./Employees ";
import Reports from "./Reports ";
import Announcements from "./Announcements";
import Settings from "./manager/settings/Settings";
import PageNotFound from "../PageNotFound";

const steps = [
  { title: "Welcome to Manager Panel", step: "Step 1 of 5", description: "Track attendance, manage your team, and monitor employee locations in real-time.", tip: "Navigate using the sidebar menu or use keyboard shortcuts." },
  { title: "Attendance Tracking", step: "Step 2 of 5", description: "View daily attendance records.", tip: "" },
  { title: "Fingerprint Registration", step: "Step 3 of 5", description: "Register employee fingerprints.", tip: "" },
  { title: "Location Tracking", step: "Step 4 of 5", description: "Monitor employee locations.", tip: "" },
  { title: "Team Reports", step: "Step 5 of 5", description: "Access analytics reports.", tip: "" },
];

export default function ManagerPanel() {
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const location = useLocation();

  // 🔐 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/manager/login");
    } catch (e) {
      alert("Logout failed");
      console.error(e);
    }
  };

  const nextStep = () => setStepIndex((p) => Math.min(p + 1, steps.length));
  const prevStep = () => setStepIndex((p) => Math.max(p - 1, 0));
  const skipTutorial = () => setStepIndex(steps.length);

  const pageTitles = {
    "/manager": "Dashboard",
    "/manager/attendance": "Attendance Management",
    "/manager/fingerprint": "Fingerprint Registration",
    "/manager/location": "Location Tracking",
    "/manager/employees": "Employee Management",
    "/manager/reports": "Reports & Analytics",
    "/manager/announcements": "Announcements",
    "/manager/settings": "Settings",
  };

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const quickActions = [
    { label: "Mark Attendance", path: "/manager/attendance" },
    { label: "Register Fingerprint", path: "/manager/fingerprint" },
    { label: "Track Location", path: "/manager/location" },
    { label: "View Employees", path: "/manager/employees" },
    { label: "View Reports", path: "/manager/reports" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setDashboardError("");
        const res = await managerApi.dashboard();
        setDashboardData(res.data);
      } catch (e) {
        console.error("DASHBOARD LOAD ERROR:", e);
        setDashboardError("Failed to load dashboard");
      }
    };
    load();
  }, []);

  // Tutorial
  if (stepIndex < steps.length) {
    const current = steps[stepIndex];
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow max-w-md w-full relative">
          <button onClick={skipTutorial} className="absolute top-3 right-3">✕</button>
          <h2 className="text-xl font-semibold mb-2">{current.title}</h2>
          <p className="text-gray-600 mb-4">{current.description}</p>
          <div className="flex justify-between">
            <button onClick={skipTutorial}>Skip</button>
            <div>
              {stepIndex > 0 && <button onClick={prevStep}>Back</button>}
              <button onClick={nextStep} className="ml-2">
                {stepIndex === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{currentTitle}</h1>
              <p className="text-sm text-gray-500">Welcome back, Manager</p>
            </div>
          </div>

          {/* Profile */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 border px-3 py-2 rounded-md"
            >
              <FaUser />
              <div className="text-left">
                <p className="text-sm font-semibold">Manager</p>
                <p className="text-xs text-gray-500">Department Head</p>
              </div>
              <FaChevronDown />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border shadow z-50">
                <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
                  <FaIdCard /> My Profile
                </button>
                <hr />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {dashboardError && (
                    <div className="mb-4 text-sm text-red-600">{dashboardError}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                    <StatCard
                      title="Present Today"
                      value={dashboardData?.totals?.presentToday ?? 0}
                      color="bg-green-500"
                      icon={<FaCheckCircle />}
                    />
                    <StatCard
                      title="Late Today"
                      value={dashboardData?.totals?.lateToday ?? 0}
                      color="bg-yellow-500"
                      icon={<FaUserClock />}
                    />
                    <StatCard
                      title="Absent Today"
                      value={dashboardData?.totals?.absentToday ?? 0}
                      color="bg-red-500"
                      icon={<FaUsers />}
                    />
                    <StatCard
                      title="Half Day"
                      value={dashboardData?.totals?.halfDayToday ?? 0}
                      color="bg-blue-500"
                      icon={<FaCalendarAlt />}
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <TrackStatus
                        color="text-green-600"
                        label="Within Range"
                        count={dashboardData?.locationSummary?.withinRange ?? 0}
                        icon={<FaCheckCircle />}
                      />
                      <TrackStatus
                        color="text-red-600"
                        label="Out of Range"
                        count={dashboardData?.locationSummary?.outOfRange ?? 0}
                        icon={<FaTimesCircle />}
                      />
                      <TrackStatus
                        color="text-gray-600"
                        label="Not Tracked"
                        count={dashboardData?.locationSummary?.notTracked ?? 0}
                        icon={<FaMapMarker />}
                      />
                    </div>
                  </div>

                <div className="flex gap-3 flex-wrap">
                  {quickActions.map((action) => (
                    <ActionButton
                      key={action.path}
                      label={action.label}
                      onClick={() => navigate(action.path)}
                    />
                  ))}
                </div>
              </>
            }
          />
            <Route path="/dashboard" element={
              <>
                {dashboardError && (
                  <div className="mb-4 text-sm text-red-600">{dashboardError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    title="Present Today"
                    value={dashboardData?.totals?.presentToday ?? 0}
                    color="bg-green-500"
                    icon={<FaCheckCircle />}
                  />
                  <StatCard
                    title="Late Today"
                    value={dashboardData?.totals?.lateToday ?? 0}
                    color="bg-yellow-500"
                    icon={<FaUserClock />}
                  />
                  <StatCard
                    title="Absent Today"
                    value={dashboardData?.totals?.absentToday ?? 0}
                    color="bg-red-500"
                    icon={<FaUsers />}
                  />
                  <StatCard
                    title="Half Day"
                    value={dashboardData?.totals?.halfDayToday ?? 0}
                    color="bg-blue-500"
                    icon={<FaCalendarAlt />}
                  />
                </div>

                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TrackStatus
                      color="text-green-600"
                      label="Within Range"
                      count={dashboardData?.locationSummary?.withinRange ?? 0}
                      icon={<FaCheckCircle />}
                    />
                    <TrackStatus
                      color="text-red-600"
                      label="Out of Range"
                      count={dashboardData?.locationSummary?.outOfRange ?? 0}
                      icon={<FaTimesCircle />}
                    />
                    <TrackStatus
                      color="text-gray-600"
                      label="Not Tracked"
                      count={dashboardData?.locationSummary?.notTracked ?? 0}
                      icon={<FaMapMarker />}
                    />
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {quickActions.map((action) => (
                    <ActionButton
                      key={action.path}
                      label={action.label}
                      onClick={() => navigate(action.path)}
                    />
                  ))}
                </div>
              </>
            } />

            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fingerprint" element={<Fingerprint />} />
            <Route path="/location" element={<Location />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
