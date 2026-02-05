import React from "react";

export default function TrackStatus({ color, label, count, icon }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div className="text-right">
        <p className="text-gray-700 text-sm">{label}</p>
        <p className="font-semibold text-lg">{count}</p>
      </div>
    </div>
  );
}
