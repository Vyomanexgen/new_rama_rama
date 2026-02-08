import React from "react";

export default function ActionButton({ label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-black text-white px-4 py-2 rounded-md transition ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
      }`}
    >
      {label}
    </button>
  );
}
