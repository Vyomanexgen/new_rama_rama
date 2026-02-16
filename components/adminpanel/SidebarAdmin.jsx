import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaHistory,
  FaShieldAlt,
  FaStar,
  FaCogs,
  FaTimes,
} from "react-icons/fa";

export default function SidebarAdmin({ open, setOpen }) {
  const location = useLocation();

  const BASE = "/admin";
  const normalizePath = (path) => {
    if (!path) return "/";
    const trimmed = path.replace(/\/+$/, "");
    return trimmed || "/";
  };
  const stripBase = (path) => {
    const p = normalizePath(path);
    if (p === BASE) return "/";
    if (p.startsWith(`${BASE}/`)) return p.slice(BASE.length) || "/";
    return p;
  };

  const currentAbs = normalizePath(location.pathname);
  const currentLocal = normalizePath(stripBase(currentAbs));

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
    { name: "Employees", icon: <FaUsers />, path: "/admin/employees" },
    { name: "Managers", icon: <FaUserTie />, path: "/admin/managers" },
    { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { name: "Activity", icon: <FaHistory />, path: "/admin/activity" },
    { name: "Services", icon: <FaShieldAlt />, path: "/admin/services" },
    { name: "Testimonials", icon: <FaStar />, path: "/admin/testimonials" },
    { name: "Why Us", icon: <FaStar />, path: "/admin/whyus" },
    { name: "Settings", icon: <FaCogs />, path: "/admin/settings" },
  ];

  const isPathActive = (toPath) => {
    const itemAbs = normalizePath(toPath);
    const itemLocal = normalizePath(stripBase(itemAbs));

    if (itemLocal === "/") {
      return (
        currentLocal === "/" ||
        currentLocal === "/dashboard" ||
        currentLocal.startsWith("/dashboard/")
      );
    }

    return currentLocal === itemLocal || currentLocal.startsWith(`${itemLocal}/`);
  };

  return (
    <>
      {/* Overlay for Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white w-64 shadow-xl z-30 transform 
        transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <div>
            <h1 className="text-lg font-semibold">Rama & Rama</h1>
            <p className="text-xs opacity-75">Admin Panel</p>
          </div>

          <button
            className="md:hidden text-white text-xl"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <div className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => {
                const active = isPathActive(item.path) || isActive;

                return `flex items-center space-x-3 px-5 py-3 text-sm font-medium rounded-lg w-full ${
                  active
                    ? "bg-blue-600 border-l-4 border-white"
                    : "hover:bg-blue-700/60 border-l-4 border-transparent"
                }`;
              }}
              onClick={() => {
                if (window.innerWidth < 768) setOpen(false);
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
