import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { loadAnnouncements } from "../../../utils/announcementStore";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const load = () => setAnnouncements(loadAnnouncements());
    load();
    const handler = () => load();
    window.addEventListener("announcements:update", handler);
    return () => window.removeEventListener("announcements:update", handler);
  }, []);

  const toneStyles = {
    info: { bg: "bg-blue-50", iconColor: "text-blue-600" },
    success: { bg: "bg-green-50", iconColor: "text-green-600" },
    warning: { bg: "bg-yellow-50", iconColor: "text-yellow-600" },
  };

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
        {announcements.map((item, idx) => {
          const tone = toneStyles[item.tone] || toneStyles.info;
          return (
          <div
            key={idx}
            className={`${tone.bg} rounded-xl p-4 border flex flex-col gap-2`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm ${tone.iconColor}`}
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
        )})}
      </div>
    </div>
  );
}
