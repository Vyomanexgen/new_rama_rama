import React, { useEffect, useMemo, useState } from "react";
import { FaBell, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { loadAnnouncements, saveAnnouncements } from "../../utils/announcementStore";

const toneStyles = {
  info: { bg: "bg-blue-50", icon: "text-blue-600" },
  success: { bg: "bg-green-50", icon: "text-green-600" },
  warning: { bg: "bg-yellow-50", icon: "text-yellow-600" },
};

const emptyForm = {
  id: "",
  title: "",
  date: "",
  message: "",
  tone: "info",
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnnouncements(loadAnnouncements());
  }, []);

  const sorted = useMemo(() => {
    return [...announcements].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [announcements]);

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.message.trim() || !form.date) {
      setError("Title, date, and message are required.");
      return;
    }

    const next = [...announcements];
    if (form.id) {
      const idx = next.findIndex((a) => a.id === form.id);
      if (idx >= 0) next[idx] = { ...form };
    } else {
      next.unshift({
        ...form,
        id: `a_${Date.now()}`,
      });
    }
    setAnnouncements(next);
    saveAnnouncements(next);
    resetForm();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title || "",
      date: item.date || "",
      message: item.message || "",
      tone: item.tone || "info",
    });
  };

  const handleDelete = (id) => {
    const next = announcements.filter((a) => a.id !== id);
    setAnnouncements(next);
    saveAnnouncements(next);
    if (form.id === id) resetForm();
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Announcement Dashboard</h2>
        <p className="text-sm text-slate-500">
          Create, edit, and manage announcements shown on the employee side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {form.id ? "Edit Announcement" : "Create Announcement"}
          </h3>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Title</label>
              <input
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Date</label>
              <input
                type="date"
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Type</label>
              <select
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Message</label>
              <textarea
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm min-h-[120px]"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write the announcement..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
              >
                {form.id ? <FaEdit /> : <FaPlus />} {form.id ? "Update" : "Create"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Current Announcements</h3>
          {sorted.length === 0 && (
            <div className="text-sm text-slate-500">No announcements yet.</div>
          )}
          <div className="space-y-4">
            {sorted.map((item) => {
              const tone = toneStyles[item.tone] || toneStyles.info;
              return (
                <div
                  key={item.id}
                  className={`${tone.bg} rounded-xl p-4 border flex flex-col gap-2`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm ${tone.icon}`}
                      >
                        <FaBell />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500">{item.date || "--"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-xs rounded-md border bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs rounded-md border bg-white text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{item.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
