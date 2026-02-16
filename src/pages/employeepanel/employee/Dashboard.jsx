import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { employeeApi } from "../../../api/employeeApi";

function StatCard({ title, value, caption, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[160px]">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-semibold mt-2 ${color || "text-portalBlue"}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{caption}</div>
    </div>
  );
}

const normalizeStatus = (status) => {
  if (!status) return null;
  const v = String(status).trim().toLowerCase();
  if (v === "half day" || v === "halfday") return "Half Day";
  if (v === "present") return "Present";
  if (v === "late") return "Late";
  if (v === "absent") return "Absent";
  return status;
};

const formatTime = (value) => {
  if (!value) return "--";
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatShiftTime = (value) => {
  if (!value) return "--";
  const v = String(value);
  if (/am|pm/i.test(v)) return v;
  const parts = v.split(":");
  if (parts.length < 2) return v;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return v;
  const period = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

export default function Dashboard() {
  const [name, setName] = useState("Employee");
  const [records, setRecords] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [assignmentError, setAssignmentError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) setName(user.displayName);
    else if (user?.email) setName(user.email.split("@")[0]);
  }, []);

  useEffect(() => {
    let active = true;
    const loadAssignment = async () => {
      try {
        setAssignmentError("");
        const res = await employeeApi.myAssignment();
        if (!active) return;
        setAssignment(res.data || null);
      } catch (e) {
        console.error("ASSIGNMENT LOAD ERROR:", e);
        if (!active) return;
        setAssignmentError("Failed to load assigned location");
      }
    };

    loadAssignment();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "attendance"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setRecords(list);
    });

    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const last30 = [];
    const now = new Date();
    for (const r of records) {
      const d = r.date ? new Date(r.date) : null;
      if (!d || Number.isNaN(d.getTime())) continue;
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) last30.push(r);
    }

    const counts = { present: 0, late: 0, absent: 0, halfDay: 0 };
    for (const r of last30) {
      const s = normalizeStatus(r.status);
      if (s === "Present") counts.present += 1;
      else if (s === "Late") counts.late += 1;
      else if (s === "Absent") counts.absent += 1;
      else if (s === "Half Day") counts.halfDay += 1;
    }

    const total = last30.length || 0;
    const attended = counts.present + counts.late + counts.halfDay;
    const rate = total ? Math.round((attended / total) * 1000) / 10 : 0;

    return { ...counts, total, rate };
  }, [records]);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const recent = records.slice(0, 5).map((r) => ({
    ...r,
    status: normalizeStatus(r.status),
  }));

  const assignedLocation = assignment?.assignedLocation || null;
  const workSchedule = assignment?.workSchedule || null;
  const locationLabel =
    assignedLocation?.name ||
    assignedLocation?.label ||
    assignedLocation?.address ||
    "Not assigned";
  const shiftLabel =
    workSchedule?.startTime || workSchedule?.endTime
      ? `Shift: ${formatShiftTime(workSchedule?.startTime)} - ${formatShiftTime(workSchedule?.endTime)}`
      : "Shift time not set";
  const mapsUrl =
    assignment?.mapsUrl ||
    (assignedLocation?.lat != null && assignedLocation?.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${assignedLocation.lat},${assignedLocation.lng}`
      : assignedLocation?.address || assignedLocation?.label || assignedLocation?.name
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          assignedLocation.address || assignedLocation.label || assignedLocation.name
        )}`
      : null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div className="text-sm text-gray-500">Welcome back, {name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-indigo-600 text-white w-10 h-10 flex items-center justify-center">
            {initials || "E"}
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard title="Attendance Rate" value={`${stats.rate}%`} caption="Last 30 days" />
        <StatCard title="Present Days" value={stats.present} caption={`Out of ${stats.total} days`} />
        <StatCard title="Late Arrivals" value={stats.late} caption="Last 30 days" color="text-yellow-500" />
        <StatCard title="Absent Days" value={stats.absent} caption="Last 30 days" color="text-red-500" />
      </div>

      <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Assigned Location</div>
            <div className="mt-2 text-lg font-semibold text-gray-800">
              {mapsUrl ? (
                <button
                  type="button"
                  onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
                  className="text-portalBlue hover:underline"
                  title="Open in Google Maps"
                >
                  {locationLabel}
                </button>
              ) : (
                <span>{locationLabel}</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">{shiftLabel}</div>
            {assignmentError && (
              <div className="text-xs text-red-500 mt-2">{assignmentError}</div>
            )}
          </div>
          {mapsUrl && (
            <button
              type="button"
              onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-portalBlue text-portalBlue hover:bg-portalBlue hover:text-white transition"
            >
              Open Map
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 portal-modal">
        <h3 className="font-semibold text-lg mb-4">Recent Attendance</h3>
        <div className="space-y-3">
          {recent.length === 0 && (
            <div className="text-sm text-gray-500">No attendance records found</div>
          )}

          {recent.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
              <div>
                <div className="text-sm font-medium">{a.date || "--"}</div>
                <div className="text-xs text-gray-400">
                  {a.location?.lat?.toFixed?.(4)}, {a.location?.lng?.toFixed?.(4)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{formatTime(a.time || a.createdAt || a.updatedAt)}</div>
                <div
                  className={`mt-1 text-xs inline-block px-3 py-1 rounded-full ${
                    a.status === "Present"
                      ? "bg-green-100 text-green-800"
                      : a.status === "Late"
                      ? "bg-yellow-100 text-yellow-800"
                      : a.status === "Half Day"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {a.status || "--"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
