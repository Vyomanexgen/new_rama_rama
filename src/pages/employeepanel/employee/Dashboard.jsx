import React from "react";
import { markAttendance } from "../../../authSync";


function StatCard({title, value, caption, color}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[160px]">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-semibold mt-2 ${color || "text-portalBlue"}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{caption}</div>
    </div>
  );
}


export default function Dashboard() {
  const attendance = [
    {date: "2025-11-02", place: "Tech Park, Sector 18", time: "09:00 AM - 06:00 PM", status: "Present"},
    {date: "2025-11-01", place: "Tech Park, Sector 18", time: "09:00 AM - 06:00 PM", status: "Present"},
    {date: "2025-10-31", place: "Tech Park, Sector 18", time: "09:15 AM - 06:00 PM", status: "Late"},
    {date: "2025-10-30", place: "Tech Park, Sector 18", time: "09:00 AM - 06:00 PM", status: "Present"},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div className="text-sm text-gray-500">Welcome back, Rajesh Kumar</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-indigo-600 text-white w-10 h-10 flex items-center justify-center">R</div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Attendance Rate" value="80.0%" caption="Last 30 days" />
        <StatCard title="Present Days" value="3" caption="Out of 5 days" />
        <StatCard title="Late Arrivals" value="1" caption="This month" color="text-yellow-500" />
        <StatCard title="Absent Days" value="1" caption="This month" color="text-red-500" />
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 portal-modal">
        <h3 className="font-semibold text-lg mb-4">Recent Attendance</h3>
        <div className="space-y-3">
          {attendance.map((a, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
              <div>
                <div className="text-sm font-medium">{a.date}</div>
                <div className="text-xs text-gray-400">{a.place}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{a.time}</div>
                <div className={`mt-1 text-xs inline-block px-3 py-1 rounded-full ${a.status === "Present" ? "bg-green-100 text-green-800" : a.status === "Late" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                  {a.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

