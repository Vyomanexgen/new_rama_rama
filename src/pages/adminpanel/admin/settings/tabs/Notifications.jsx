// import React from "react";

// export default function Notifications() {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Notifications</h2>
//       <p className="text-gray-500 mb-4">
//         Configure system alerts, app notifications, and email settings.
//       </p>

//       <div className="bg-gray-50 border rounded-lg p-6">
//         <p className="text-sm text-gray-600">
//           (Add notification settings UI here… toggles, preferences.)
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";

export default function Notifications() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    attendance: true,
    employeeUpdates: true,
    systemAlerts: true,
    weeklyReports: false,
    monthlyReports: false,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="text-slate-700">

      {/* --- TITLE --- */}
      <div className="flex items-start gap-3 mb-6">
        <div className="text-green-600 bg-green-100 p-2 rounded-lg">
          {/* Bell Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14 10V6a4 4 0 00-8 0v4a2 2 0 01-.73 1.53L4 13h12l-1.27-1.47A2 2 0 0114 10zm-7 6a3 3 0 006 0H7z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Notification Preferences</h2>
          <p className="text-gray-500 mt-1">
            Configure how you receive system notifications
          </p>
        </div>
      </div>

      {/* -------------------- SECTION 1 : Notification Channels -------------------- */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Notification Channels
        </h3>

        <div className="space-y-4">

          {/* Email */}
          <NotificationRow
            title="Email Notifications"
            desc="Receive notifications via email"
            enabled={settings.email}
            onClick={() => toggle("email")}
          />

          {/* SMS */}
          <NotificationRow
            title="SMS Notifications"
            desc="Receive notifications via SMS"
            enabled={settings.sms}
            onClick={() => toggle("sms")}
          />

          {/* Push */}
          <NotificationRow
            title="Push Notifications"
            desc="Receive browser push notifications"
            enabled={settings.push}
            onClick={() => toggle("push")}
          />
        </div>
      </div>

      {/* -------------------- SECTION 2 : Event Notifications -------------------- */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Event Notifications
        </h3>

        <div className="space-y-4">
          <NotificationRow
            title="Attendance Alerts"
            desc="Get notified about attendance issues"
            enabled={settings.attendance}
            onClick={() => toggle("attendance")}
          />

          <NotificationRow
            title="Employee Updates"
            desc="Notifications about employee changes"
            enabled={settings.employeeUpdates}
            onClick={() => toggle("employeeUpdates")}
          />

          <NotificationRow
            title="System Alerts"
            desc="Important system notifications"
            enabled={settings.systemAlerts}
            onClick={() => toggle("systemAlerts")}
          />
        </div>
      </div>

      {/* -------------------- SECTION 3 : Report Notifications -------------------- */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Report Notifications
        </h3>

        <div className="space-y-4">
          <NotificationRow
            title="Weekly Reports"
            desc="Receive weekly performance reports"
            enabled={settings.weeklyReports}
            onClick={() => toggle("weeklyReports")}
          />

          <NotificationRow
            title="Monthly Reports"
            desc="Receive monthly summary reports"
            enabled={settings.monthlyReports}
            onClick={() => toggle("monthlyReports")}
          />
        </div>
      </div>

      {/* -------------------- SAVE BUTTON -------------------- */}
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-xl shadow hover:opacity-95 transition">
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------
   REUSABLE ROW COMPONENT
-------------------------------------------- */
function NotificationRow({ title, desc, enabled, onClick }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b last:border-none">
      <div>
        <p className="font-medium text-slate-800">{title}</p>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full flex items-center transition-all px-1 
          ${enabled ? "bg-indigo-600 justify-end" : "bg-gray-300 justify-start"}
        `}
      >
        <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
      </button>
    </div>
  );
}
