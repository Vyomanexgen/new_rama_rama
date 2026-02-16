import React, { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import NotificationBell from "../../components/NotificationBell";

import SidebarSuperAdmin from "../../components/superadminpanel/SidebarSuperAdmin";
import PageNotFound from "../PageNotFound";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAdmins from "./pages/SuperAdminAdmins";
import SuperAdminManagers from "./pages/SuperAdminManagers";
import SuperAdminGuards from "./pages/SuperAdminGuards";
import SuperAdminCompany from "./pages/SuperAdminCompany";
import SuperAdminContent from "./pages/SuperAdminContent";
import SuperAdminAnnouncements from "./pages/SuperAdminAnnouncements";
import SuperAdminReports from "./pages/SuperAdminReports";
import SuperAdminLogs from "./pages/SuperAdminLogs";
import SuperAdminNotifications from "./pages/SuperAdminNotifications";

export default function SuperAdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const titleMap = {
    "/superadmin": "Dashboard",
    "/superadmin/": "Dashboard",
    "/superadmin/dashboard": "Dashboard",
    "/superadmin/admins": "Admin Management",
    "/superadmin/managers": "Manager Management",
    "/superadmin/guards": "Employee Management",
    "/superadmin/company": "Company Details",
    "/superadmin/content": "Website Content",
    "/superadmin/announcements": "Announcement Center",
    "/superadmin/reports": "Reports",
    "/superadmin/logs": "Activity Logs",
    "/superadmin/notifications": "Notification Center",
  };

  const title = titleMap[location.pathname] || "Super Admin";

  useEffect(() => {
    function onDoc(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/superadmin/login");
    } catch (e) {
      console.error(e);
      alert("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarSuperAdmin open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
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
              <p className="text-sm text-gray-500">Welcome back, Super Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-full"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  SA
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold">Super Admin</p>
                  <p className="text-xs text-gray-500">System</p>
                </div>
                {profileOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow z-50">
                  <Link
                    to="/superadmin/company"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Company Details
                  </Link>
                  <Link
                    to="/superadmin/notifications"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Notification Center
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
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<SuperAdminDashboard />} />
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admins" element={<SuperAdminAdmins />} />
            <Route path="/managers" element={<SuperAdminManagers />} />
            <Route path="/guards" element={<SuperAdminGuards />} />
            <Route path="/company" element={<SuperAdminCompany />} />
            <Route path="/content" element={<SuperAdminContent />} />
            <Route path="/announcements" element={<SuperAdminAnnouncements />} />
            <Route path="/reports" element={<SuperAdminReports />} />
            <Route path="/logs" element={<SuperAdminLogs />} />
            <Route path="/notifications" element={<SuperAdminNotifications />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
