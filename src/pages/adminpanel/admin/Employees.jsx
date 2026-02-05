import React, { useState } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const Employees = () => {
  const [employees] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh@ramarama.com", role: "Security Guard", dept: "Corporate", status: "Active" },
    { id: 2, name: "Priya Sharma", email: "priya@ramarama.com", role: "Security Guard", dept: "Residential", status: "Active" },
    { id: 3, name: "Amit Patel", email: "amit@ramarama.com", role: "Security Guard", dept: "Corporate", status: "Active" },
    { id: 4, name: "Sunita Singh", email: "sunita@ramarama.com", role: "Security Guard", dept: "Residential", status: "Inactive" },
  ]);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-6 sm:p-10 w-full bg-gray-50 min-h-screen">
      
      {/* Search + Add Employee */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full sm:w-2/3 px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
          onClick={() => setOpenModal(true)}
        >
          <FaUserPlus size={18} /> Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50 text-gray-700 font-semibold">
            <tr>
              <th className="py-4 px-4 text-left">Name</th>
              <th className="py-4 px-4 text-left">Email</th>
              <th className="py-4 px-4 text-left">Role</th>
              <th className="py-4 px-4 text-left">Department</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm">
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                    {emp.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800">{emp.name}</span>
                </td>
                <td className="py-4 px-4">{emp.email}</td>
                <td className="py-4 px-4">{emp.role}</td>
                <td className="py-4 px-4">{emp.dept}</td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold ${
                      emp.status === "Active"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-center flex justify-center gap-2">
                  <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 flex items-center gap-1">
                    <FaEdit size={14} className="text-blue-600" /> Edit
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1">
                    <FaTrash size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Add Employee Popup Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">

            {/* Close Button */}
            <button
              className="absolute right-6 top-6 text-gray-600 text-2xl"
              onClick={() => setOpenModal(false)}
            >
              ✖
            </button>

            <h2 className="text-3xl font-bold text-blue-800 mb-6">
              Add New Employee
            </h2>

            {/* Form Fields */}
            <form className="space-y-6">
              <div>
                <label className="font-medium">Full Name *</label>
                <input type="text" placeholder="e.g., Rajesh Kumar"
                  className="w-full bg-gray-100 border rounded-lg p-3 mt-1" />
              </div>

              <div>
                <label className="font-medium">Email Address *</label>
                <input type="email" placeholder="e.g., rajesh@ramarama.com"
                  className="w-full bg-gray-100 border rounded-lg p-3 mt-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Role/Position *</label>
                  <input type="text" placeholder="e.g., Security Guard"
                    className="w-full bg-gray-100 border rounded-lg p-3 mt-1" />
                </div>
                <div>
                  <label className="font-medium">Department *</label>
                  <input type="text" placeholder="e.g., Corporate"
                    className="w-full bg-gray-100 border rounded-lg p-3 mt-1" />
                </div>
              </div>

              <div>
                <label className="font-medium">Status</label>
                <select className="w-full bg-gray-100 border rounded-lg p-3 mt-1">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button className="flex-1 bg-black text-white py-3 rounded-lg text-lg font-semibold">
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="flex-1 border py-3 rounded-lg text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;
