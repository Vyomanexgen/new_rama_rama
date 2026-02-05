import React from "react";
import { FaUserCircle, FaFingerprint } from "react-icons/fa";

export default function Attendance() {
  const employees = [
    { name: "Rajesh Kumar", role: "Corporate Security" },
    { name: "Priya Sharma", role: "Residential Security" },
    { name: "Amit Patel", role: "Corporate Security" },
    { name: "Sunita Singh", role: "Residential Security" },
    { name: "Vikram Reddy", role: "Corporate Security" },
  ];

  return (
    <div className="w-full">
      {/* ---- Date Filter ---- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border">
        <label className="text-sm font-medium text-gray-600">Select Date:</label>
        <div className="flex items-center mt-2 gap-4">
          <input
            type="date"
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm">Present: 0</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full text-sm">Late: 0</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">Absent: 0</button>
          </div>
        </div>
      </div>

      {/* ---- Mark Attendance ---- */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-semibold mb-4">Mark Attendance</h2>

        {employees.map((emp, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border rounded-lg mb-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl text-blue-600" />
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-gray-500">{emp.role}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm">
                <FaFingerprint className="text-sm" /> Present
              </button>

              <button className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100">Late</button>
              <button className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100">Half Day</button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-full">Absent</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Attendance History ---- */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Attendance History</h2>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="pb-2 text-left">Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

