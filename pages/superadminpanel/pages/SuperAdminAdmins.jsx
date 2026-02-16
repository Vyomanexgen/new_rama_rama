import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

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

export default function SuperAdminAdmins() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/admins");
      setList(res?.data?.users || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load admins");
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
      return email.includes(needle) || name.includes(needle);
    });
  }, [list, q]);

  const createAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const email = clean(form.email).toLowerCase();
      const password = String(form.password || "");
      const name = clean(form.name);
      if (!email || !password) throw new Error("Email and password are required");
      if (hasEmail(list, email)) throw new Error("Email already exists");

      await api.post("/superadmin/admins", { email, password, name });
      setForm({ email: "", password: "", name: "" });
      await load();
    } catch (e) {
      console.error(e);
      setError(
        isEmailDuplicateError(e)
          ? "Email already exists"
          : e?.response?.data?.message || e?.message || "Failed to create admin"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (uid, next) => {
    try {
      await api.put(`/superadmin/users/${uid}`, { status: next });
      await load();
    } catch (e) {
      console.error(e);
      setError("Failed to update admin");
    }
  };

  const deleteAdmin = async (uid, email) => {
    const label = email ? `admin (${email})` : "admin";
    if (!window.confirm(`Do you want to delete this ${label}?`)) return;
    try {
      setError("");
      await api.delete(`/superadmin/users/${uid}`);
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Failed to delete admin");
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
        <div className="text-lg font-semibold text-gray-900">Add Admin</div>
        <form onSubmit={createAdmin} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-lg font-semibold text-gray-900">Admins</div>
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Search by name/email"
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
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const status = String(u.status || "active");
                const uid = u.id || u.uid;
                return (
                  <tr key={uid} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{u.name || "-"}</td>
                    <td className="py-2 pr-4">{u.email || "-"}</td>
                    <td className="py-2 pr-4">{status}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                          onClick={() =>
                            toggleStatus(uid, status.toLowerCase() === "active" ? "blocked" : "active")
                          }
                          type="button"
                        >
                          {status.toLowerCase() === "active" ? "Block" : "Unblock"}
                        </button>
                        <button
                          className="px-3 py-1.5 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
                          onClick={() => deleteAdmin(uid, u.email)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={4}>
                    No admins found.
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
