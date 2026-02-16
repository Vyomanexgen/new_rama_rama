import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";

const clean = (v) => String(v || "").trim();
const isEmailDuplicateError = (e) => {
  const code = String(e?.code || "").toLowerCase();
  const msg = String(e?.response?.data?.message || e?.message || "").toLowerCase();
  return (
    code.includes("email-already") ||
    msg.includes("email already") ||
    msg.includes("already in use") ||
    (msg.includes("duplicate") && msg.includes("email"))
  );
};
const hasEmail = (arr, email) =>
  (arr || []).some((u) => String(u?.email || "").toLowerCase() === String(email || "").toLowerCase());
const titleCase = (v) => {
  const s = clean(v).toLowerCase();
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function SuperAdminManagers() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    city: "",
    zone: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/managers");
      const users = res?.data?.users || [];

      // Enforce uniqueness on email in the UI (backend should do this too, but we guard here).
      const seen = new Map(); // email -> count
      const dupes = new Map(); // email -> count
      const deduped = [];
      for (const u of users) {
        const email = String(u?.email || "").trim().toLowerCase();
        if (!email) {
          deduped.push(u);
          continue;
        }
        const next = (seen.get(email) || 0) + 1;
        seen.set(email, next);
        if (next > 1) {
          dupes.set(email, next);
          continue; // hide duplicates from the table
        }
        deduped.push(u);
      }

      setList(deduped);
    } catch (e) {
      console.error(e);
      setError("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = clean(q).toLowerCase();
    if (!needle) return list;
    return list.filter((u) => {
      const email = String(u.email || "").toLowerCase();
      const name = String(u.name || "").toLowerCase();
      const city = String(u.city || "").toLowerCase();
      const zone = String(u.zone || "").toLowerCase();
      return (
        email.includes(needle) ||
        name.includes(needle) ||
        city.includes(needle) ||
        zone.includes(needle)
      );
    });
  }, [list, q]);

  const createManager = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const email = clean(form.email).toLowerCase();
      const password = String(form.password || "");
      const name = clean(form.name);
      const city = clean(form.city);
      const zone = clean(form.zone);
      if (!name) throw new Error("Name is required");
      if (!email || !password) throw new Error("Email and password are required");
      if (hasEmail(list, email)) throw new Error("Email already exists");

      await api.post("/superadmin/managers", { email, password, name, city, zone });
      setForm({ email: "", password: "", name: "", city: "", zone: "" });
      await load();
    } catch (e) {
      console.error(e);
      setError(
        isEmailDuplicateError(e)
          ? "Email already exists"
          : e?.response?.data?.message || e?.message || "Failed to create manager"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateManager = async (uid, patch) => {
    try {
      await api.put(`/superadmin/users/${uid}`, patch);
      await load();
    } catch (e) {
      console.error(e);
      setError("Failed to update manager");
    }
  };

  const editManagerName = async (uid, currentName) => {
    const next = clean(window.prompt("Enter manager name", currentName || ""));
    if (!next) return;
    await updateManager(uid, { name: next });
  };

  const deleteManager = async (uid, email) => {
    const label = email ? `manager (${email})` : "manager";
    if (!window.confirm(`Do you want to delete this ${label}?`)) return;
    try {
      setError("");
      await api.delete(`/superadmin/users/${uid}`);
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Failed to delete manager");
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-900">Add Manager</div>
        <form onSubmit={createManager} className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Zone"
            value={form.zone}
            onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Manager"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-lg font-semibold text-gray-900">Managers</div>
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">City</th>
                <th className="py-2 pr-4">Zone</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const statusKey = String(u.status || "active").toLowerCase();
                const statusLabel = titleCase(statusKey) || "Active";
                const uid = u.id || u.uid;
                return (
                  <tr key={uid} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <span>{u.name || "Unnamed"}</span>
                        <button
                          type="button"
                          onClick={() => editManagerName(uid, u.name)}
                          className="p-1 rounded hover:bg-gray-100 text-blue-700"
                          aria-label="Edit name"
                          title="Edit name"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 pr-4">{u.email || "-"}</td>
                    <td className="py-2 pr-4">{u.city || "-"}</td>
                    <td className="py-2 pr-4">{u.zone || "-"}</td>
                    <td className="py-2 pr-4">{statusLabel}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                          onClick={() =>
                            updateManager(uid, {
                              status: statusKey === "active" ? "blocked" : "active",
                            })
                          }
                          type="button"
                        >
                          {statusKey === "active" ? "Block" : "Unblock"}
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-red-50 text-red-700 border border-red-200"
                          onClick={() => deleteManager(uid, u.email)}
                          type="button"
                          aria-label="Delete manager"
                          title="Delete manager"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={6}>
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
