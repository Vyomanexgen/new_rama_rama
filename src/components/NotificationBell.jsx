import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import api from "../services/api";

const typeToColor = (type) => {
  const t = String(type || "info").toLowerCase();
  if (t === "success") return "text-green-700 bg-green-50 border-green-200";
  if (t === "warning") return "text-yellow-800 bg-yellow-50 border-yellow-200";
  if (t === "error") return "text-red-700 bg-red-50 border-red-200";
  return "text-blue-700 bg-blue-50 border-blue-200";
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/me");
      setUnread(Number(res && res.data && res.data.unread ? res.data.unread : 0));
      setItems(Array.isArray(res && res.data && res.data.notifications) ? res.data.notifications : []);
    } catch (e) {
      console.error("notifications load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const markRead = async (id) => {
    try {
      await api.post("/notifications/" + id + "/read");
      await load();
    } catch (e) {
      console.error("markRead failed", e);
    }
  };

  const top = items.slice(0, 8);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="relative p-2 rounded-full border bg-white hover:bg-gray-50"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        aria-label="Notifications"
        title="Notifications"
      >
        <FaBell className="text-gray-700" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold text-gray-900">Notifications</div>
            <div className="text-xs text-gray-500">
              {loading ? "Loading..." : String(unread) + " unread"}
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            {!top.length && (
              <div className="p-4 text-sm text-gray-500">No notifications.</div>
            )}

            {top.map((n) => (
              <button
                key={n.id}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                onClick={() => markRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      "mt-0.5 px-2 py-1 text-xs rounded-md border " + typeToColor(n.type)
                    }
                  >
                    {String(n.type || "info").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{n.title}</div>
                    <div className="mt-0.5 text-sm text-gray-600 line-clamp-2">{n.message}</div>
                    {n.createdAt && (
                      <div className="mt-1 text-xs text-gray-400">
                        {String(n.createdAt).slice(0, 19).replace("T", " ")}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
            Click a notification to mark it as read.
          </div>
        </div>
      )}
    </div>
  );
}
