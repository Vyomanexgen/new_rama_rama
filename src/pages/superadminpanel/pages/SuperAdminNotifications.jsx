import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

const clean = (v) => String(v || "").trim();

export default function SuperAdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "normal",
    roles: {
      superadmin: true,
      admin: true,
      manager: true,
      employee: true,
    },
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/notifications");
      setList(Array.isArray(res?.data?.notifications) ? res.data.notifications : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const title = clean(form.title);
      const msg = clean(form.message);
      if (!title || !msg) throw new Error("Title and message are required");

      const roles = Object.entries(form.roles)
        .filter(([, v]) => !!v)
        .map(([k]) => k);

      await api.post("/superadmin/notifications", {
        title,
        message: msg,
        type: form.type,
        priority: form.priority,
        target: {
          roles,
        },
      });

      setForm((p) => ({ ...p, title: "", message: "" }));
      setMessage("Notification sent");
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Failed to create notification");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => list, [list]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
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

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-900">Send System Notification</div>
        <form onSubmit={create} className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            className="border rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <input
            className="border rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            required
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={form.priority}
            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>

          <div className="md:col-span-6 flex flex-wrap gap-3 text-sm text-gray-700">
            {Object.keys(form.roles).map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.roles[r]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      roles: { ...p.roles, [r]: e.target.checked },
                    }))
                  }
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          <div className="md:col-span-6">
            <button
              className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
        <div className="text-lg font-semibold text-gray-900">Recent Notifications</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Priority</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Target Roles</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">
                    <div className="font-medium text-gray-900">{n.title}</div>
                    <div className="text-gray-600 line-clamp-1">{n.message}</div>
                  </td>
                  <td className="py-2 pr-4">{n.type || "info"}</td>
                  <td className="py-2 pr-4">{n.priority || "normal"}</td>
                  <td className="py-2 pr-4">{String(n.createdAt || "").slice(0, 19).replace("T", " ")}</td>
                  <td className="py-2 pr-4">
                    {Array.isArray(n?.target?.roles) && n.target.roles.length
                      ? n.target.roles.join(", ")
                      : "all"}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={5}>
                    No notifications.
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
