import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

export default function CompanyInfo() {
  const [formData, setFormData] = useState({
    companyName: "",
    regNumber: "",
    gstNumber: "",
    phoneNumber: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Company Information
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Basic information about your organization
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">

        {/* First Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              onChange={handleChange}
              placeholder="Rama & Rama"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Registration Number
            </label>
            <input
              type="text"
              name="regNumber"
              onChange={handleChange}
              placeholder="RR-2024-001"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Tax ID / GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              onChange={handleChange}
              placeholder="GST123456789"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Phone Number *
            </label>
            <input
              type="text"
              name="phoneNumber"
              onChange={handleChange}
              placeholder="+91-22-1234-5678"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="contact@ramarama.com"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Website
            </label>
            <input
              type="text"
              name="website"
              onChange={handleChange}
              placeholder="www.ramarama.com"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className="text-gray-700 font-medium text-sm">
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            onChange={handleChange}
            placeholder="123 Security Boulevard, Business District"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* City State Zip */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="text-gray-700 font-medium text-sm">
              City *
            </label>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              placeholder="Mumbai"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              State / Province *
            </label>
            <input
              type="text"
              name="state"
              onChange={handleChange}
              placeholder="Maharashtra"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              ZIP / Postal Code *
            </label>
            <input
              type="text"
              name="zip"
              onChange={handleChange}
              placeholder="400001"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-gray-700 font-medium text-sm">
            Company Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            rows="3"
            placeholder="Leading provider of corporate and residential security services"
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2 ml-auto"
          >
            <FaSave size={16} />
            Save Company Settings
          </button>
        </div>
      </div>
    </div>
  );
}
