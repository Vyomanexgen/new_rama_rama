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

export default function SuperAdminGuards() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    managerId: "",
    managerEmail: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const [empRes, mgrRes] = await Promise.all([
        api.get("/superadmin/employees"),
        api.get("/superadmin/managers"),
      ]);

      setEmployees(empRes?.data?.employees || []);
      setManagers(mgrRes?.data?.users || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = clean(q).toLowerCase();
    if (!needle) return employees;
    return employees.filter((g) => {
      const email = String(g.email || "").toLowerCase();
      const name = String(g.name || "").toLowerCase();
      const dept = String(g.department || "").toLowerCase();
      return email.includes(needle) || name.includes(needle) || dept.includes(needle);
    });
  }, [employees, q]);

  const createEmployee = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const email = clean(form.email).toLowerCase();
      const tempPassword = String(form.password || "");
      const name = clean(form.name);
      const department = clean(form.department);
      const managerId = clean(form.managerId);
      const managerEmail =
        clean(form.managerEmail) ||
        (managerId ? clean(managers.find((m) => (m.id || m.uid) === managerId)?.email) : "");

      if (!email || !tempPassword) throw new Error("Email and password are required");
      if (hasEmail(employees, email)) throw new Error("Email already exists");

      await api.post("/superadmin/employees", {
        email,
        tempPassword,
        name,
        department,
        managerId,
        managerEmail,
      });

      setForm({ email: "", password: "", name: "", department: "", managerId: "", managerEmail: "" });
      await load();
    } catch (e) {
      console.error(e);
      setError(
        isEmailDuplicateError(e)
          ? "Email already exists"
          : e?.response?.data?.message || e?.message || "Failed to create employee"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async (row) => {
    const email = row?.email || "";
    const uid =
      row?.uid ||
      row?.firebaseUid ||
      row?.userId ||
      (String(row?.id || "").length >= 20 ? row.id : "");
    if (!uid) {
      setError("Cannot delete employee: missing uid");
      return;
    }
    const label = email ? `employee (${email})` : "employee";
    if (!window.confirm(`Do you want to delete this ${label}?`)) return;
    try {
      setError("");
      await api.delete(`/superadmin/users/${uid}`);
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Failed to delete employee");
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
        <div className="text-lg font-semibold text-gray-900">Add Employee</div>
        <form onSubmit={createEmployee} className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
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
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={form.managerId}
            onChange={(e) => setForm((p) => ({ ...p, managerId: e.target.value }))}
          >
            <option value="">Assign Manager</option>
            {managers.map((m) => (
              <option key={m.id || m.uid} value={m.id || m.uid}>
                {m.name || m.email}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Employee"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-lg font-semibold text-gray-900">Employees</div>
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Search by name/email/department"
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
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Manager</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">{g.name || "-"}</td>
                  <td className="py-2 pr-4">{g.email || "-"}</td>
                  <td className="py-2 pr-4">{g.department || "-"}</td>
                  <td className="py-2 pr-4">{g.managerEmail || g.managerId || "-"}</td>
                  <td className="py-2 pr-4">
                    <button
                      className="px-3 py-1.5 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
                      type="button"
                      onClick={() => deleteEmployee(g)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={5}>
                    No employees found.
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
