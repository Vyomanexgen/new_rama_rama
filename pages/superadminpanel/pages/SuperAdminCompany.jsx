import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const clean = (v) => String(v || "").trim();

export default function SuperAdminCompany() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    address: "",
    phone: "",
    altPhone: "",
    email: "",
    altEmail: "",
    logoUrl: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/company");
      const data = res?.data?.company || {};
      setForm({
        companyName: data.companyName || "",
        address: data.address || "",
        phone: data.phone || "",
        altPhone: data.altPhone || "",
        email: data.email || "",
        altEmail: data.altEmail || "",
        logoUrl: data.logoUrl || "",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.put("/superadmin/company", {
        companyName: clean(form.companyName),
        address: clean(form.address),
        phone: clean(form.phone),
        altPhone: clean(form.altPhone),
        email: clean(form.email),
        altEmail: clean(form.altEmail),
        logoUrl: clean(form.logoUrl),
      });
      setMessage("Saved");
    } catch (e) {
      console.error(e);
      setError("Failed to save company details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
          {message}
        </div>
      )}

      <form onSubmit={save} className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <div className="text-lg font-semibold text-gray-900">Company Details</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Company Name</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.companyName}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Logo URL</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.logoUrl}
              onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Address</div>
          <textarea
            className="border rounded-lg px-3 py-2 w-full min-h-24"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Phone</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Alternate Phone</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.altPhone}
              onChange={(e) => setForm((p) => ({ ...p, altPhone: e.target.value }))}
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Email</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Alternate Email</div>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={form.altEmail}
              onChange={(e) => setForm((p) => ({ ...p, altEmail: e.target.value }))}
            />
          </div>
        </div>

        <button className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
