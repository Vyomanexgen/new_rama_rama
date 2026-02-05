import React from "react";
import { FaBell } from "react-icons/fa";

export default function Announcement() {
  const announcements = [
    {
      title: "Monthly Safety Training",
      date: "2025-11-01",
      message:
        "All security personnel are required to attend the monthly safety training session on November 10, 2025.",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Uniform Distribution",
      date: "2025-10-30",
      message:
        "New uniforms will be distributed on November 5, 2025. Please collect from the admin office.",
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Shift Schedule Update",
      date: "2025-10-28",
      message:
        "Please check the updated shift schedule for November. Contact your manager for any conflicts.",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 w-full">
      {/* Header */}
      <h2 className="text-xl font-semibold text-slate-800">
        Company Announcements
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Stay updated with latest news and updates
      </p>

      {/* Announcement List */}
      <div className="space-y-4">
        {announcements.map((item, idx) => (
          <div
            key={idx}
            className={`${item.bg} rounded-xl p-4 border flex flex-col gap-2`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm ${item.iconColor}`}
                >
                  <FaBell />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              <span className="text-sm text-slate-500">{item.date}</span>
            </div>

            <p className="text-sm text-slate-600 mt-1">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
