import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";

import Login from "./components/Login";
import Signup from "./components/Signup";

import SuperAdminPanel from "./pages/superadminpanel/SuperAdminPanel";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import ManagerPanel from "./pages/manegerpannelcards/ManagerPanel";
import EmployeePanel from "./pages/employeepanel/EmployeePanel";

import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

export default function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/superadmin") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/employee") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ScrollToHash enabled={!hideNavbar} />

      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public Pages */}
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/services" element={<Navigate to="/#services" replace />} />
          <Route path="/testimonials" element={<Navigate to="/#testimonials" replace />} />
          <Route path="/whyus" element={<Navigate to="/#whyus" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-specific Login Routes */}
          <Route path="/superadmin/login" element={<Login role="superadmin" />} />
          <Route path="/admin/login" element={<Login role="admin" />} />
          <Route path="/manager/login" element={<Login role="manager" />} />
          <Route path="/employee/login" element={<Login role="employee" />} />

          {/* Protected Panel Routes */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute role="superadmin">
                <SuperAdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/*"
            element={
              <ProtectedRoute role="manager">
                <ManagerPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/*"
            element={
              <ProtectedRoute role="employee">
                <EmployeePanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
