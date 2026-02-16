
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserClock,
  FaFingerprint,
  FaMapMarkerAlt,
  FaUsers,
  FaChartLine,
  FaCog,
  FaTimes,
  FaBell,
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const BASE = "/manager";
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
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/manager" },
    { name: "Attendance", icon: <FaUserClock />, path: "/manager/attendance" },
    { name: "Fingerprint", icon: <FaFingerprint />, path: "/manager/fingerprint" },
    { name: "Location", icon: <FaMapMarkerAlt />, path: "/manager/location" },
    { name: "Employees", icon: <FaUsers />, path: "/manager/employees" },
    { name: "Reports", icon: <FaChartLine />, path: "/manager/reports" },
    { name: "Announcements", icon: <FaBell />, path: "/manager/announcements" },
    { name: "Settings", icon: <FaCog />, path: "/manager/settings" },
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
      {/* Mobile Overlay */}
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
          <h1 className="text-lg font-semibold">Rama & Rama</h1>

          <button
            className="md:hidden text-white text-xl"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <div className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              // Prevent `/manager` (Dashboard) from partially matching all `/manager/*` routes.
              end={item.path === "/manager"}
              className={() => {
                const active = isPathActive(item.path);

                return `flex items-center space-x-3 px-5 py-3 text-sm font-medium rounded-lg w-full ${
                  active
                    ? "bg-blue-600 border-l-4 border-white"
                    : "hover:bg-blue-700/60 border-l-4 border-transparent"
                }`;
              }}
              onClick={() => {
                if (window.innerWidth < 768) setOpen(false);
              }} // Close only on mobile
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
