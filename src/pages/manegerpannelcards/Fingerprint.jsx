import React from "react";
import { FaFingerprint } from "react-icons/fa";

export default function Fingerprint() {
  const employees = [
    { name: "Rajesh Kumar", role: "Corporate Security", status: "Registered" },
    { name: "Priya Sharma", role: "Residential Security", status: "Registered" },
    { name: "Amit Patel", role: "Corporate Security", status: "Registered" },
    { name: "Sunita Singh", role: "Residential Security", status: "Not Registered" },
    { name: "Vikram Reddy", role: "Corporate Security", status: "Registered" },
  ];

  return (
    <div className="w-full">

      {/* ---- Fingerprint Registration Status ---- */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-semibold mb-4">Fingerprint Registration Status</h2>

        {employees.map((emp, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border rounded-lg mb-3 hover:bg-gray-50 transition"
          >
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                <FaFingerprint className="text-green-700 text-xl" />
              </div>
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-gray-500">{emp.role}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm rounded-full border ${
                  emp.status === "Registered"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {emp.status}
              </span>

              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  emp.status === "Registered"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-500 text-white"
                }`}
              >
                {emp.status === "Registered" ? "Re-register" : "Register"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- How to Register Fingerprint ---- */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">How to Register Fingerprint</h2>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click the "Register" button next to the employee name</li>
          <li>Ask the employee to place their finger on the fingerprint scanner</li>
          <li>Hold steady until the registration is complete</li>
          <li>The system will confirm successful registration</li>
          <li>Employee can now use fingerprint for attendance marking</li>
        </ol>
      </div>
    </div>
  );
}

