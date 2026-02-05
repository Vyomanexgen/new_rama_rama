import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import WhyUs from "./pages/WhyUs";
import ContactUs from "./pages/ContactUs";

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

      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/whyus" element={<WhyUs />} />
          <Route path="/contact" element={<ContactUs />} />

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
