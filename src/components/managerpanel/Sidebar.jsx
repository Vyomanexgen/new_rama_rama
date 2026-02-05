
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserClock,
  FaFingerprint,
  FaMapMarkerAlt,
  FaUsers,
  FaChartLine,
  FaCog,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const current = location.pathname;

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/manager" },
    { name: "Attendance", icon: <FaUserClock />, path: "/manager/attendance" },
    { name: "Fingerprint", icon: <FaFingerprint />, path: "/manager/fingerprint" },
    { name: "Location", icon: <FaMapMarkerAlt />, path: "/manager/location" },
    { name: "Employees", icon: <FaUsers />, path: "/manager/employees" },
    { name: "Reports", icon: <FaChartLine />, path: "/manager/reports" },
    { name: "Settings", icon: <FaCog />, path: "/manager/settings" },
  ];

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
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-5 py-3 text-sm font-medium rounded-lg
                ${
                  current === item.path
                    ? "bg-blue-600"
                    : "hover:bg-blue-700/60"
                }
              `}
              onClick={() => {
                if (window.innerWidth < 768) setOpen(false);
              }} // Close only on mobile
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
