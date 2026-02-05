import React from "react";
import { FaBriefcase, FaUsers, FaRupeeSign, FaPlus, FaUserShield } from "react-icons/fa";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Corporate Security",
      status: "Active",
      category: "Corporate",
      description:
        "Comprehensive security solutions for offices, businesses, and corporate environments with trained personnel and monitoring.",
      activeClients: 24,
      price: "₹50,000/month",
      features: [
        "Trained Security Guards",
        "Visitor Management",
        "Parking Security",
        "Employee Safety",
        "24/7 Monitoring",
      ],
    },
    {
      id: 2,
      name: "Apartment/Building Security",
      status: "Active",
      category: "Residential",
      description:
        "Residential security services for gated communities, apartment complexes, and residential buildings with professional guards.",
      activeClients: 18,
      price: "₹35,000/month",
      features: [
        "Gate Security",
        "Visitor Screening",
        "Patrol Services",
        "Emergency Response",
        "CCTV Monitoring",
      ],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Service Management</h2>
          <p className="text-green-600 text-sm mt-1">
            ✓ {services.length} service(s) currently visible on homepage
          </p>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80">
          <FaPlus /> Add New Service
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaBriefcase size={35} />
          <div>
            <p className="text-sm">Total Services</p>
            <h3 className="text-xl font-semibold">{services.length}</h3>
          </div>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaUserShield size={35} />
          <div>
            <p className="text-sm">Active Services</p>
            <h3 className="text-xl font-semibold">{services.length}</h3>
          </div>
        </div>

        <div className="bg-purple-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaUsers size={35} />
          <div>
            <p className="text-sm">Total Clients</p>
            <h3 className="text-xl font-semibold">
              {services.reduce((acc, s) => acc + s.activeClients, 0)}
            </h3>
          </div>
        </div>

        <div className="bg-orange-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaRupeeSign size={35} />
          <div>
            <p className="text-sm">Avg Monthly Rate</p>
            <h3 className="text-xl font-semibold">₹43k</h3>
          </div>
        </div>
      </div>

      {/* Services List */}
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white p-6 rounded-xl shadow-md border mb-5"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="text-blue-600">
                <FaUserShield size={40} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">{service.name}</h3>

                {/* Status & Category Badge */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {service.status}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {service.category}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 max-w-2xl text-sm">
                  {service.description}
                </p>

                {/* Stats under card */}
                <div className="flex items-center gap-6 text-sm mt-3">
                  <p className="flex items-center gap-2 text-blue-600">
                    <FaUsers /> {service.activeClients} Active Clients
                  </p>
                  <p className="text-green-600 font-medium">{service.price}</p>
                  <p className="flex items-center gap-2 text-purple-600">
                    ⭐ {service.features.length} Features
                  </p>
                </div>

                {/* Feature List */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.features.map((f, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs border"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Delete Buttons */}
            <div className="flex gap-2">
              <button className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300">
                <FaEdit className="text-gray-700" />
              </button>
              <button className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600">
                <FaTrash className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Tips Box */}
      <div className="bg-white p-6 rounded-xl shadow-md border mt-8">
        <h3 className="font-semibold text-lg mb-3">Service Management Tips</h3>
        <ul className="text-gray-600 text-sm space-y-2">
          <li>• Keep service descriptions clear and concise for better client understanding</li>
          <li>• Update pricing regularly based on market trends and operational costs</li>
          <li>• Monitor client count to identify popular services</li>
          <li>• Add or remove features based on client feedback</li>
          <li>• Ensure all active services have adequate staff allocation</li>
          <li>• <strong>Note:</strong> Only "Active" services will appear on the public homepage</li>
        </ul>
      </div>
    </div>
  );
}
