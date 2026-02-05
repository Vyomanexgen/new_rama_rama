import React from "react";
import { FaLightbulb, FaEdit, FaTrash } from "react-icons/fa";

export default function WhyUs() {
  const reasons = [
    {
      id: 1,
      title: "Certified Professionals",
      icon: "certificate",
      status: "Active",
      description:
        "All our security personnel are fully licensed, background-checked, and certified with extensive training in modern security protocols and emergency response.",
    },
    {
      id: 2,
      title: "24/7 Availability",
      icon: "clock",
      status: "Active",
      description:
        "Round-the-clock protection and monitoring services ensure your safety never takes a break. We're always on duty, always vigilant.",
    },
    {
      id: 3,
      title: "Advanced Technology",
      icon: "technology",
      status: "Active",
      description:
        "Modern security systems with real-time reporting, comprehensive monitoring, and state-of-the-art equipment to ensure maximum protection.",
    },
    {
      id: 4,
      title: "Competitive Pricing",
      icon: "pricing",
      status: "Active",
      description:
        "Premium security services at transparent, competitive rates. Flexible packages tailored to your budget without compromising on quality.",
    },
    {
      id: 5,
      title: "Rapid Response",
      icon: "response",
      status: "Active",
      description:
        "Swift emergency response teams trained to handle critical situations with professionalism, ensuring immediate action when it matters most.",
    },
    {
      id: 6,
      title: "Detailed Reporting",
      icon: "reporting",
      status: "Active",
      description:
        "Comprehensive incident reports, daily activity logs, and transparent communication keep you informed about all security operations.",
    },
    {
      id: 7,
      title: "Experienced Team",
      icon: "team",
      status: "Active",
      description:
        "Years of industry experience with a proven track record of protecting businesses, events, and communities across diverse sectors.",
    },
    {
      id: 8,
      title: "Customized Solutions",
      icon: "solutions",
      status: "Active",
      description:
        "Tailored security plans designed to meet your specific needs, whether corporate, residential, or event-based protection.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Why Us Management</h2>
        <p className="text-gray-500 text-sm">
          Manage reasons displayed in “Why Choose Rama & Rama” section on the homepage
        </p>
        <p className="text-gray-500 text-xs">
          ✓ {reasons.length} reason(s) currently visible on homepage
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-blue-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90">Total Reasons</p>
          <h3 className="text-3xl font-semibold">{reasons.length}</h3>
          <FaLightbulb className="text-3xl float-right opacity-90" />
        </div>

        <div className="bg-green-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90">Active on Homepage</p>
          <h3 className="text-3xl font-semibold">{reasons.length}</h3>
          <FaLightbulb className="text-3xl float-right opacity-90" />
        </div>
      </div>

      {/* Reasons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reasons.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg p-5 shadow-sm"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 text-xl">
                <FaLightbulb />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  {item.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              <button className="flex items-center gap-1 text-xs bg-gray-50 border text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                <FaEdit /> Edit
              </button>

              <button className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
