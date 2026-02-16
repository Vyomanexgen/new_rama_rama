import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { writeActivityLog } from "../../../utils/activityLog";

const clean = (v) => String(v || "").trim();

export default function SuperAdminAnnouncements() {
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const snap = await getDocs(
        query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(20))
      );
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const title = clean(form.title);
      const message = clean(form.message);
      const audience = clean(form.audience) || "all";
      if (!message) throw new Error("Message is required");

      await addDoc(collection(db, "announcements"), {
        title,
        message,
        audience, // all | admins | managers | employees
        createdAt: serverTimestamp(),
      });

      await writeActivityLog({
        scope: "superadmin",
        action: "announcement.send",
        meta: { audience, title: title || "(no title)" },
      });

      setForm({ title: "", message: "", audience: "all" });
      await load();
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const preview = useMemo(() => {
    return {
      title: clean(form.title) || "(No title)",
      message: clean(form.message) || "(No message)",
      audience: form.audience,
    };
  }, [form]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-900">Send Announcement</div>
        <form onSubmit={send} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={form.audience}
            onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
          >
            <option value="all">All users</option>
            <option value="admins">Only Admins</option>
            <option value="managers">Only Managers</option>
            <option value="employees">Only Employees</option>
          </select>
          <input
            className="border rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            required
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60 md:col-span-4"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
          <div className="text-xs text-gray-500">Preview</div>
          <div className="mt-1 font-semibold text-gray-900">{preview.title}</div>
          <div className="mt-1 text-sm text-gray-700">{preview.message}</div>
          <div className="mt-2 text-xs text-gray-500">Audience: {preview.audience}</div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">Recent Announcements</div>
        </div>
        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((a) => (
              <div key={a.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-gray-900">{a.title || "Announcement"}</div>
                  <div className="text-xs text-gray-500">{a.audience || "all"}</div>
                </div>
                <div className="mt-1 text-sm text-gray-700">{a.message}</div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-gray-500">No announcements yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
