// import React from "react";
// export default function Activity() {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-2">Activity</h2>
//       <p className="text-gray-500 mb-4">View system activity and logs.</p>
//       <div className="bg-white rounded-lg p-6 border shadow-sm">Activity UI placeholder.</div>
//     </div>
//   );
// }



import React, { useState } from "react";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaUserTie,
  FaUserShield,
  FaClipboardCheck,
  FaDatabase,
  FaUserAlt,
  FaBuilding,
} from "react-icons/fa";

export default function Activity() {
  const stats = [
    { label: "Success", value: 5, icon: <FaCheckCircle className="text-green-600 text-xl" /> },
    { label: "Info", value: 1, icon: <FaInfoCircle className="text-blue-600 text-xl" /> },
    { label: "Warning", value: 1, icon: <FaExclamationTriangle className="text-yellow-500 text-xl" /> },
    { label: "Error", value: 1, icon: <FaTimesCircle className="text-red-600 text-xl" /> },
  ];

  const allTimeline = [
    {
      icon: <FaUserTie className="text-green-600 text-2xl" />,
      tag: "employee",
      action: "Added",
      desc: "Vikram Reddy added as Senior Guard",
      user: "Admin",
      date: "2025-11-02 14:30",
      status: "success",
    },
    {
      icon: <FaUserShield className="text-green-600 text-2xl" />,
      tag: "manager",
      action: "Assigned",
      desc: "Lakshmi Iyer assigned to Residential Security",
      user: "Admin",
      date: "2025-11-02 12:15",
      status: "success",
    },
    {
      icon: <FaClipboardCheck className="text-blue-600 text-2xl" />,
      tag: "services",
      action: "Updated",
      desc: "Service pricing updated",
      user: "Admin",
      date: "2025-11-01 16:00",
      status: "info",
    },
    {
      icon: <FaUserAlt className="text-yellow-500 text-2xl" />,
      tag: "employee",
      action: "Status Changed",
      desc: "Sunita Singh marked as Inactive",
      user: "Admin",
      date: "2025-11-01 16:45",
      status: "warning",
    },
    {
      icon: <FaClipboardCheck className="text-green-600 text-2xl" />,
      tag: "attendance",
      action: "Marked",
      desc: "12 employees marked present for today",
      user: "Manager",
      date: "2025-11-02 09:00",
      status: "success",
    },
    {
      icon: <FaDatabase className="text-green-600 text-2xl" />,
      tag: "system",
      action: "Backup",
      desc: "Database backup completed successfully",
      user: "System",
      date: "2025-11-02 03:00",
      status: "success",
    },
    {
      icon: <FaBuilding className="text-green-600 text-2xl" />,
      tag: "services",
      action: "New Client",
      desc: "New client onboarded for Apartment Security",
      user: "Admin",
      date: "2025-11-01 14:20",
      status: "success",
    },
    {
      icon: <FaUserAlt className="text-red-600 text-2xl" />,
      tag: "employee",
      action: "Login Failed",
      desc: "Multiple failed login attempts detected",
      user: "Rajesh Kumar",
      date: "2025-11-01 11:30",
      status: "error",
    },
  ];

  const [filter, setFilter] = useState("all");

  const filteredTimeline =
    filter === "all"
      ? allTimeline
      : allTimeline.filter((item) => item.tag === filter);

  const filterOptions = [
    { label: "All Activities", value: "all" },
    { label: "Employee", value: "employee" },
    { label: "Manager", value: "manager" },
    { label: "Services", value: "services" },
    { label: "Attendance", value: "attendance" },
  ];

  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-2xl font-semibold mb-2">Activity</h2>
      <p className="text-gray-500 mb-4">View system activity and logs.</p>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 ">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Dropdown Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter By
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full sm:w-64 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
        <h3 className="text-xl font-semibold mb-4">Activity Timeline</h3>

        <div className="space-y-4">
          {filteredTimeline.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-start gap-4 bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 transition"
            >
              <div>{item.icon}</div>

              <div className="flex-1">
                <span className="text-xs bg-gray-200 rounded px-2 py-1 mr-2">
                  {item.tag}
                </span>
                <span className="text-gray-700 font-semibold">{item.action}</span>

                <p className="text-gray-600 mt-1">{item.desc}</p>

                <div className="text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:gap-4">
                  <span>👤 {item.user}</span>
                  <span>📅 {item.date}</span>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full capitalize mt-2 sm:mt-0 ${
                  item.status === "success"
                    ? "bg-green-100 text-green-700"
                    : item.status === "info"
                    ? "bg-blue-100 text-blue-700"
                    : item.status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
