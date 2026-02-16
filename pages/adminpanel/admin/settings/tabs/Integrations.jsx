import React, { useState } from "react";

export default function Integrations() {
  const [form, setForm] = useState({
    emailProvider: "SMTP",
    smsProvider: "Twilio",
    paymentGateway: "Stripe",
    cloudProvider: "AWS S3",
    apiKey: "",
    webhook: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="text-slate-700">

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="text-indigo-600 bg-indigo-100 p-2 rounded-lg">
          {/* Plug Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-3-3v6m5.5-10.5l-3 3m-7 7l-3 3m12-3h.01M6 6h.01"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Third-Party Integrations</h2>
          <p className="text-gray-500 mt-1">
            Connect with external services and APIs
          </p>
        </div>
      </div>

      {/* Integration Security Warning */}
      <div className="bg-purple-50 border border-purple-200 text-purple-700 px-5 py-4 rounded-xl mb-8 flex items-start gap-3">
        {/* Shield Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7 4v5c0 5-3.8 9.4-7 10-3.2-.6-7-5-7-10V7l7-4z"
          />
        </svg>

        <p>
          <span className="font-medium">Integration Security</span> <br />
          Keep your API keys and credentials secure. Never share them publicly
          or commit them to version control.
        </p>
      </div>

      {/* Communication Services */}
      <SectionCard title="Communication Services">
        <SelectField
          label="Email Service Provider"
          value={form.emailProvider}
          options={["SMTP", "SendGrid", "Mailgun"]}
          onChange={(v) => handleChange("emailProvider", v)}
        />

        <SelectField
          label="SMS Provider"
          value={form.smsProvider}
          options={["Twilio", "Nexmo", "Plivo"]}
          onChange={(v) => handleChange("smsProvider", v)}
        />
      </SectionCard>

      {/* Payment & Storage */}
      <SectionCard title="Payment & Storage">
        <SelectField
          label="Payment Gateway"
          value={form.paymentGateway}
          options={["Stripe", "Razorpay", "PayPal"]}
          onChange={(v) => handleChange("paymentGateway", v)}
        />

        <SelectField
          label="Cloud Storage Provider"
          value={form.cloudProvider}
          options={["AWS S3", "Google Cloud Storage", "Azure Blob"]}
          onChange={(v) => handleChange("cloudProvider", v)}
        />
      </SectionCard>

      {/* API Configuration */}
      <SectionCard title="API Configuration">
        <div>
          <label className="block text-sm text-gray-600 mb-1">API Key</label>
          <input
            type="text"
            placeholder="Enter your API key"
            className="w-full bg-gray-100 border rounded-lg px-3 py-2 outline-none"
            value={form.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Webhook URL</label>
          <input
            type="text"
            placeholder="https://your-domain.com/webhook"
            className="w-full bg-gray-100 border rounded-lg px-3 py-2 outline-none"
            value={form.webhook}
            onChange={(e) => handleChange("webhook", e.target.value)}
          />
        </div>
      </SectionCard>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-xl shadow hover:opacity-95 transition">

          {/* Save Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

          Save Integration Settings
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   REUSABLE COMPONENTS
------------------------- */

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-5">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border rounded-lg px-3 py-2 outline-none text-gray-700 shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
