// import React from "react";
// import FormField from "../../../../../components/FormField";

// export default function CompanyInfo() {
//   return (
//     <>
//       <div className="flex items-start space-x-6">
//         <div className="flex-none w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
//           <svg xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M3 7v4a1 1 0 001 1h3m10-6h3a1 1 0 011 1v4M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold text-slate-800">
//             Company Information
//           </h2>
//           <p className="text-sm text-slate-500 mt-1">
//             Basic information about your organization
//           </p>
//         </div>
//       </div>

//       <form className="mt-6 space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <FormField label="Company Name *" defaultValue="Rama & Rama" />
//           <FormField label="Registration Number" defaultValue="RR-2024-001" />

//           <FormField label="Tax ID / GST Number" defaultValue="GST123456789" />
//           <FormField label="Phone Number *" defaultValue="+91-22-1234-5678" />

//           <FormField label="Email Address *" defaultValue="contact@ramarama.com" />
//           <FormField label="Website" defaultValue="www.ramarama.com" />

//           <div className="md:col-span-2">
//             <label className="block text-sm text-slate-600 mb-2">Street Address *</label>
//             <input
//               className="w-full rounded-md bg-gray-100 px-4 py-3 text-sm text-slate-800"
//               defaultValue="123 Security Boulevard, Business District"
//             />
//           </div>

//           <FormField label="City *" defaultValue="Mumbai" />
//           <FormField label="State / Province *" defaultValue="Maharashtra" />
//           <FormField label="ZIP / Postal Code *" defaultValue="400001" />
//         </div>

//         <div>
//           <label className="block text-sm text-slate-600 mb-2">Company Description</label>
//           <textarea
//             defaultValue="Leading provider of corporate and residential security services"
//             className="w-full rounded-md bg-gray-100 px-4 py-3 text-sm text-slate-800"
//             rows={4}
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             className="inline-flex items-center gap-2 bg-indigo-900 text-white px-4 py-3 rounded-lg shadow hover:opacity-95"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4" fill="none" viewBox="0 0 24 24"
//               stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M5 13l4 4L19 7" />
//             </svg>
//             Save Company Settings
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }




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
