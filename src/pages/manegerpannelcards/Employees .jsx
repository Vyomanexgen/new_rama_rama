import React from "react";
import { FaSearch, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const employees = [
  {
    name: "Rajesh Kumar",
    dept: "Corporate Security",
    location: "Tech Park – Gate 1",
    status: "Registered",
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    dept: "Residential Security",
    location: "Sunset Apartments",
    status: "Registered",
    initials: "PS",
  },
  {
    name: "Amit Patel",
    dept: "Corporate Security",
    location: "Tech Park – Gate 2",
    status: "Registered",
    initials: "AP",
  },
  {
    name: "Sunita Singh",
    dept: "Residential Security",
    location: "Green Valley Complex",
    status: "Not Registered",
    initials: "SS",
  },
  {
    name: "Vikram Reddy",
    dept: "Corporate Security",
    location: "Business Tower Lobby",
    status: "Registered",
    initials: "VR",
  },
];

export default function Employees() {
  return (
    <div className="w-full px-4 lg:px-6 py-4">
      
      {/* 🔵 Employee Directory Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
          Employee Directory
        </h2>
        <p className="text-gray-600">View and manage all security personnel</p>
        </div>
        
        
        <div className="mt-3 md:mt-0 relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 🔵 Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Employees" value="5" bg="bg-blue-500" />
        <SummaryCard title="Corporate Security" value="3" bg="bg-green-600" />
        <SummaryCard title="Residential Security" value="2" bg="bg-purple-600" />
        <SummaryCard title="Fingerprint Registered" value="4" bg="bg-orange-500" />
      </div>

      {/* 🔵 All Employees */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          All Employees
        </h3>

        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b">
              <th className="py-2">Name</th>
              <th>Department</th>
              <th>Assigned Location</th>
              <th>Fingerprint Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={index}
                className="border-b text-sm text-gray-700 hover:bg-gray-50"
              >
                {/* Profile */}
                <td className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {emp.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                  </div>
                </td>

                {/* Department */}
                <td>{emp.dept}</td>

                {/* Location */}
                <td className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-blue-500 text-sm" />
                  {emp.location}
                </td>

                {/* Fingerprint Status */}
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      emp.status === "Registered"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button className="text-blue-600 font-medium hover:underline">
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔵 Employee Management Guide */}
      <div className="bg-white shadow-md rounded-xl p-4 mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Employee Management Guide
        </h3>

        <ul className="list-disc ml-5 text-gray-700 text-sm space-y-2">
          <li>Use the search bar to quickly find specific employees</li>
          <li>Click “Track” to view real-time location of any employee</li>
          <li>Register fingerprints for employees to enable biometric attendance</li>
          <li>View assigned locations for each security personnel</li>
          <li>Monitor fingerprint registration status at a glance</li>
        </ul>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, value, bg }) => (
  <div className={`${bg} text-white rounded-xl p-4 shadow-md`}>
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);
