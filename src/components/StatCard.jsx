import React from "react";

export default function StatCard({ title, value, color, icon }) {
  return (
    <div className={`${color} text-white rounded-lg p-4 flex items-center justify-between shadow-sm`}>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="text-3xl opacity-70">{icon}</div>
    </div>
  );
}


