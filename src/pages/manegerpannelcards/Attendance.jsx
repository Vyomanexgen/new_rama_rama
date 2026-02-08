import React, { useEffect, useMemo, useState } from "react";
import { FaUserCircle, FaFingerprint } from "react-icons/fa";
import { managerApi } from "../../api/managerApi";

export default function Attendance() {
  const formatTime = (value) => {
    if (!value) return "--";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "--";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const loadAttendance = async (date) => {
    try {
      setLoading(true);
      setError("");
      const res = await managerApi.attendance(date);
      setEmployees(res.data?.employees || []);
    } catch (e) {
      console.error("ATTENDANCE LOAD ERROR:", e);
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance(selectedDate);
  }, [selectedDate]);

  const setStatus = async (employeeId, status) => {
    try {
      setSavingId(employeeId);
      await managerApi.verifyAttendance({
        employeeId,
        status,
        date: selectedDate,
      });
      await loadAttendance(selectedDate);
    } catch (e) {
      console.error("ATTENDANCE VERIFY ERROR:", e);
      const msg = e?.response?.data?.message || "Failed to update attendance";
      alert(msg);
    } finally {
      setSavingId(null);
    }
  };

  const counts = useMemo(() => {
    const all = employees.map((e) => e.attendanceStatus || e.status).filter(Boolean);
    return {
      present: all.filter((s) => s === "Present").length,
      late: all.filter((s) => s === "Late").length,
      halfDay: all.filter((s) => s === "Half Day").length,
      absent: all.filter((s) => s === "Absent").length,
    };
  }, [employees]);

  return (
    <div className="w-full">
      {/* ---- Date Filter ---- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border">
        <label className="text-sm font-medium text-gray-600">Select Date:</label>
          <div className="flex items-center mt-2 gap-4">
            <input
              type="date"
              className="border px-3 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm"
            >
              Present: {counts.present}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-full text-sm"
            >
              Late: {counts.late}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm"
            >
              Absent: {counts.absent}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Mark Attendance ---- */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-semibold mb-4">Mark Attendance</h2>
        {error && (
          <div className="mb-3 text-sm text-red-600">{error}</div>
        )}
        {loading && (
          <div className="mb-3 text-sm text-gray-500">Loading...</div>
        )}

        {employees.map((emp) => (
          <div
            key={emp.id || emp.email || emp.name}
            className="flex items-center justify-between p-3 border rounded-lg mb-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl text-blue-600" />
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-gray-500">
                  {emp.department || emp.dept || emp.role || "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Login: {formatTime(emp.lastLoginAt)}
                  <span className="mx-1">•</span>
                  Marked: {formatTime(emp.attendanceTime)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus(emp.id, "Present")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  (emp.attendanceStatus || emp.status) === "Present"
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                }`}
                disabled={savingId === emp.id}
              >
                <FaFingerprint className="text-sm" /> Present
              </button>

              <button
                type="button"
                onClick={() => setStatus(emp.id, "Late")}
                className={`px-3 py-1 text-sm rounded-full ${
                  (emp.attendanceStatus || emp.status) === "Late"
                    ? "bg-red-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
                disabled={savingId === emp.id}
              >
                Late
              </button>
              <button
                type="button"
                onClick={() => setStatus(emp.id, "Half Day")}
                className={`px-3 py-1 text-sm rounded-full ${
                  (emp.attendanceStatus || emp.status) === "Half Day"
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
                disabled={savingId === emp.id}
              >
                Half Day
              </button>
              <button
                type="button"
                onClick={() => setStatus(emp.id, "Absent")}
                className={`px-3 py-1 text-sm rounded-full ${
                  (emp.attendanceStatus || emp.status) === "Absent"
                    ? "bg-red-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
                disabled={savingId === emp.id}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Attendance History ---- */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Attendance History</h2>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="pb-2 text-left px-2">Employee</th>
              <th className="pb-2 text-left px-2">Login</th>
              <th className="pb-2 text-left px-2">Marked</th>
              <th className="pb-2 text-left px-2">Status</th>
              <th className="pb-2 text-left px-2">Location</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}

            {employees.map((emp) => (
              <tr key={emp.id} className="border-b">
                <td className="py-3 text-left px-2">{emp.name}</td>
                <td className="py-3 text-left px-2">{formatTime(emp.lastLoginAt)}</td>
                <td className="py-3 text-left px-2">{formatTime(emp.attendanceTime)}</td>
                <td className="py-3 text-left px-2">{emp.attendanceStatus || "--"}</td>
                <td className="py-3 text-left px-2">{emp.locationStatus?.status || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
