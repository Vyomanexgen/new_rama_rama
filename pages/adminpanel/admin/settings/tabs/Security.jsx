// import React from "react";

// export default function Security() {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
//       <p className="text-gray-500 mb-4">
//         Configure password policies, 2FA, and access restrictions.
//       </p>

//       <div className="bg-gray-50 border rounded-lg p-6">
//         <p className="text-sm text-gray-600">
//           (Add security settings UI here… password rules, 2FA setup.)
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";

export default function Security() {
  const [settings, setSettings] = useState({
    twoFA: false,
    ipWhitelist: false,
    auditLogging: true,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="text-slate-700">

      {/* Title */}
      <div className="flex items-start gap-3 mb-6">
        <div className="text-indigo-600 bg-indigo-100 p-2 rounded-lg">
          {/* Shield Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l7 4v5c0 5-3.8 9.4-7 10-3.2-.6-7-5-7-10V7l7-4z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Security Settings</h2>
          <p className="text-gray-500 mt-1">
            Manage security and access control
          </p>
        </div>
      </div>

      {/* Alert Box */}
      <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 flex items-start gap-3">
        {/* Alert icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M4.93 19h14.14L12 3 4.93 19z"
          />
        </svg>

        <p>
          <span className="font-medium">Security Best Practices</span> <br />
          Enable two-factor authentication and regular password updates to keep
          your system secure. Monitor audit logs regularly.
        </p>
      </div>

      {/* Authentication Section */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Authentication
        </h3>

        <div className="space-y-5">

          {/* 2FA */}
          <Row
            title="Two-Factor Authentication"
            desc="Require 2FA for all users"
            enabled={settings.twoFA}
            onClick={() => toggle("twoFA")}
          />

          {/* IP Whitelisting */}
          <Row
            title="IP Whitelisting"
            desc="Restrict access to specific IP addresses"
            enabled={settings.ipWhitelist}
            onClick={() => toggle("ipWhitelist")}
          />

          {/* Audit Logging */}
          <Row
            title="Audit Logging"
            desc="Log all system activities"
            enabled={settings.auditLogging}
            onClick={() => toggle("auditLogging")}
          />
        </div>
      </div>

      {/* Session & Password */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-6">
          Session & Password Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Session Timeout */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Session Timeout (minutes)
            </label>
            <input
              type="text"
              defaultValue="30"
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Password Expiry */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password Expiry (days)
            </label>
            <input
              type="text"
              defaultValue="90"
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Max Login Attempts */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Max Login Attempts
            </label>
            <input
              type="text"
              defaultValue="5"
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
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

          Save Security Settings
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   Reusable Row Component
------------------------- */
function Row({ title, desc, enabled, onClick }) {
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
