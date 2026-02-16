import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserTie,
  FaUsers,
  FaBuilding,
  FaGlobe,
  FaBullhorn,
  FaBell,
  FaChartBar,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";

export default function SidebarSuperAdmin({ open, setOpen }) {
  const location = useLocation();

  const BASE = "/superadmin";
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
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/superadmin" },
    { name: "Admins", icon: <FaUserShield />, path: "/superadmin/admins" },
    { name: "Managers", icon: <FaUserTie />, path: "/superadmin/managers" },
    { name: "Employees", icon: <FaUsers />, path: "/superadmin/guards" },
    { name: "Company Details", icon: <FaBuilding />, path: "/superadmin/company" },
    { name: "Website Content", icon: <FaGlobe />, path: "/superadmin/content" },
    { name: "Announcements", icon: <FaBullhorn />, path: "/superadmin/announcements" },
    { name: "Notifications", icon: <FaBell />, path: "/superadmin/notifications" },
    { name: "Reports", icon: <FaChartBar />, path: "/superadmin/reports" },
    { name: "Activity Logs", icon: <FaClipboardList />, path: "/superadmin/logs" },
  ];

  const isPathActive = (toPath) => {
    const itemAbs = normalizePath(toPath);
    const itemLocal = normalizePath(stripBase(itemAbs));

    if (itemLocal === "/") {
      return currentLocal === "/" || currentLocal === "/dashboard";
    }

    return currentLocal === itemLocal || currentLocal.startsWith(`${itemLocal}/`);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white w-72 shadow-xl z-30 transform
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <div>
            <h1 className="text-lg font-semibold">Rama & Rama</h1>
            <p className="text-xs opacity-75">Super Admin</p>
          </div>

          <button
            className="md:hidden text-white text-xl"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-4 space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              // Prevent `/superadmin` (Dashboard) from partially matching all `/superadmin/*` routes.
              end={item.path === "/superadmin"}
              className={() => {
                // Use our own matcher so only the current page is highlighted.
                // (React Router's `isActive` would otherwise treat `/superadmin` as active for all nested routes.)
                const active = isPathActive(item.path);
                return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  active
                    ? "bg-blue-600 border-l-4 border-white"
                    : "hover:bg-blue-700/60 border-l-4 border-transparent"
                }`;
              }}
              onClick={() => {
                if (window.innerWidth < 768) setOpen(false);
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
