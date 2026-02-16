import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaBoxes,
  FaBell,
  FaCheckCircle,
  FaCalendarPlus,
} from "react-icons/fa";

export default function Dashboard() {
  const quickActions = [
    { label: "Manage Employees", color: "bg-black text-white" },
    { label: "Manage Managers", color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
    { label: "Manage Services", color: "bg-black text-white" },
    { label: "View Activity", color: "bg-emerald-600 text-white" },
    { label: "Add Employee", color: "bg-black text-white" },
    { label: "Add Service", color: "bg-black text-white" },
  ];

  const recent = [
    { title: "New employee added", subtitle: "Vikram Reddy joined as Senior Guard", time: "2 hours ago", color: "bg-blue-50" },
    { title: "Manager assigned", subtitle: "Lakshmi Iyer assigned to Residential Security", time: "5 hours ago", color: "bg-emerald-50" },
    { title: "Profile updated", subtitle: "Sunita Singh status changed to Inactive", time: "1 day ago", color: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-6">
      {/* summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="rounded-lg p-5 text-white bg-gradient-to-r from-blue-500 to-blue-400">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Total Employees</p>
              <p className="text-2xl font-semibold mt-2">5 <br/> <span className="text-sm opacity-80">4 active</span></p>
            </div>
            <div className="text-3xl opacity-90"><FaUsers /></div>
          </div>
        </div>

        <div className="rounded-lg p-5 text-white bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Total Managers</p>
              <p className="text-2xl font-semibold mt-2">3 <br/> <span className="text-sm opacity-80">2 departments</span></p>
            </div>
            <div className="text-3xl opacity-90"><FaUserTie /></div>
          </div>
        </div>

        <div className="rounded-lg p-5 text-white bg-gradient-to-r from-orange-400 to-rose-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Services & Clients</p>
              <p className="text-2xl font-semibold mt-2">2 <br/> <span className="text-sm opacity-80">42 clients</span></p>
            </div>
            <div className="text-3xl opacity-90"><FaBoxes /></div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recent.map((r, idx) => (
            <div key={idx} className={`${r.color} p-4 rounded-md flex justify-between items-center`}>
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-gray-600">{r.subtitle}</p>
              </div>
              <div className="text-sm text-gray-500">{r.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((q, i) => (
            <button key={i} className={`py-3 rounded-md ${q.color} hover:opacity-90 transition`}>
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

