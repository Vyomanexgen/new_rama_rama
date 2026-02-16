
import React from "react";
import {
  FiUploadCloud,
  FiInfo,
  FiImage,
} from "react-icons/fi";

export default function Branding() {
  return (
    <div className="text-slate-700 w-full">

      {/* Title Section */}
      <div className="flex items-center gap-3 mb-4">
        <FiImage className="text-indigo-600 text-2xl" />
        <h2 className="text-xl font-semibold">Branding & Appearance</h2>
      </div>

      <p className="text-gray-500 mb-6">
        Customize the look and feel of your application
      </p>

      {/* Info Box */}
      <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-4 mb-8 flex items-start gap-3">
        <FiInfo className="text-indigo-600 mt-1 text-xl" />
        <p className="text-sm text-indigo-700 leading-relaxed">
          <strong>Branding Guidelines</strong><br />
          Changes to branding settings will be reflected across all user interfaces.
          Make sure your brand colors meet accessibility standards (WCAG 2.1).
        </p>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary */}
        <div>
          <label className="text-sm font-medium text-slate-700">Primary Color</label>
          <input
            type="color"
            defaultValue="#1f3a8a"
            className="w-full h-12 rounded-md mt-2 cursor-pointer border border-gray-300"
          />
        </div>

        {/* Secondary */}
        <div>
          <label className="text-sm font-medium text-slate-700">Secondary Color</label>
          <input
            type="color"
            defaultValue="#f5b800"
            className="w-full h-12 rounded-md mt-2 cursor-pointer border border-gray-300"
          />
        </div>

        {/* Accent */}
        <div>
          <label className="text-sm font-medium text-slate-700">Accent Color</label>
          <input
            type="color"
            defaultValue="#22c55e"
            className="w-full h-12 rounded-md mt-2 cursor-pointer border border-gray-300"
          />
        </div>
      </div>

      {/* Company Tagline */}
      <div className="mt-8">
        <label className="text-sm font-medium text-slate-700">
          Company Tagline
        </label>
        <input
          type="text"
          className="w-full mt-2 px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-sm"
          placeholder="Your Trusted Security Partner"
          defaultValue="Your Trusted Security Partner"
        />
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Company Logo */}
        <div className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <FiUploadCloud className="text-3xl text-gray-500 mb-2" />
          <p className="text-gray-500 text-sm mb-4">
            Upload your company logo<br />
            <span className="text-xs">(PNG, JPG or SVG, max 2MB)</span>
          </p>

          <label className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg cursor-pointer hover:bg-gray-800 transition">
            Choose File
            <input type="file" className="hidden" />
          </label>
        </div>

        {/* Favicon */}
        <div className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <FiUploadCloud className="text-3xl text-gray-500 mb-2" />
          <p className="text-gray-500 text-sm mb-4">
            Upload favicon<br />
            <span className="text-xs">(ICO or PNG, 32x32px)</span>
          </p>

          <label className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg cursor-pointer hover:bg-gray-800 transition">
            Choose File
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-10">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Branding Settings
        </button>
      </div>
    </div>
  );
}


