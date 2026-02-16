import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

const toDate = (v) => {
  if (!v) return null;
  if (typeof v?.toDate === "function") return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const typeFromAction = (action, scope) => {
  const a = String(action || "").toLowerCase();
  const s = String(scope || "").toLowerCase();
  if (a.startsWith("auth.") || a.includes("login") || s === "auth") return "Login";
  if (a.startsWith("attendance.") || s === "attendance") return "Attendance";
  if (a.startsWith("announcement.") || s === "announcement") return "Announcement";
  if (a.startsWith("fingerprint.") || s === "fingerprint") return "Fingerprint";
  return "Other";
};

const describe = (x) => {
  const action = String(x?.action || "");
  const meta = x?.meta || {};
  const type = typeFromAction(action, x?.scope);

  if (type === "Fingerprint") {
    const who = meta.employeeName || meta.name || meta.email || meta.employeeId || "-";
    const flags = [];
    if (meta.startVerified) flags.push("start verified");
    if (meta.endVerified) flags.push("end verified");
    if (meta.startRegistered) flags.push("start registered");
    if (meta.endRegistered) flags.push("end registered");
    return `${action}: ${who}${flags.length ? ` (${flags.join(", ")})` : ""}`;
  }

  if (type === "Login") {
    const who = meta.email || meta.uid || "-";
    return `${action}: ${who}`;
  }

  if (type === "Attendance") {
    const who = meta.email || meta.employeeId || "-";
    const st = meta.status ? `, ${meta.status}` : "";
    return `${action}: ${who}${st}`;
  }

  if (type === "Announcement") {
    const title = meta.title || "-";
    return `${action}: ${title}`;
  }

  return action || "-";
};

export default function SuperAdminLogs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all"); // all | login | attendance | announcement | fingerprint

  const load = async (activeTab = tab) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/activity-logs", {
        params: {
          type: activeTab,
          limit: 200,
        },
      });
      setItems(Array.isArray(res?.data?.logs) ? res.data.logs : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-lg font-semibold text-gray-900">Activity Logs</div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "all", label: "Activity Logs" },
              { key: "login", label: "Login Logs" },
              { key: "attendance", label: "Attendance Logs" },
              { key: "announcement", label: "Announcement Logs" },
              { key: "fingerprint", label: "Fingerprint Logs" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  tab === t.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="mt-4 overflow-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4 w-44">Time</th>
                  <th className="py-2 pr-4 w-32">Type</th>
                  <th className="py-2 pr-4 w-40">Scope</th>
                  <th className="py-2 pr-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr key={x.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 text-gray-600">
                      {toDate(x.createdAt)?.toLocaleString?.() || "--"}
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {typeFromAction(x.action, x.scope)}
                    </td>
                    <td className="py-3 pr-4">{x.scope || "-"}</td>
                    <td className="py-3 pr-4 text-gray-700">
                      <div className="font-medium text-gray-900">{describe(x)}</div>
                      <div className="mt-1 text-xs text-gray-500 whitespace-pre-wrap break-words">
                        {JSON.stringify(x.meta || {}, null, 2)}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-500" colSpan={4}>
                      No logs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
