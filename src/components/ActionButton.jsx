import React from "react";

export default function ActionButton({ label }) {
  return (
    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">
      {label}
    </button>
  );
}

