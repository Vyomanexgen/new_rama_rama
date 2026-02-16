import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

function Card({ label, value, sub }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}

export default function SuperAdminReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/superadmin/reports", { params: { days: 30 } });
      setData(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = useMemo(() => {
    const range = data?.range;
    const totals = data?.totals || {};
    const counts = data?.attendanceCounts || {};
    const sub = range ? `${range.start} to ${range.end}` : "";

    return [
      { label: "Employees", value: totals.employees ?? 0, sub },
      { label: "Attendance Records", value: totals.attendanceRecords ?? 0, sub },
      { label: "Attendance %", value: `${data?.attendancePercent ?? 0}%`, sub },
      { label: "Present", value: counts.present ?? 0, sub },
      { label: "Late", value: counts.late ?? 0, sub },
      { label: "Absent", value: counts.absent ?? 0, sub },
      { label: "Half Day", value: counts["half-day"] ?? 0, sub },
    ];
  }, [data]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} label={c.label} value={c.value} sub={c.sub} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="text-lg font-semibold text-gray-900">Top Employees (Last 30 days)</div>
          <div className="mt-3 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Attendance %</th>
                  <th className="py-2 pr-4">Present</th>
                  <th className="py-2 pr-4">Late</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topEmployees || []).map((e) => (
                  <tr key={e.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{e.name || "-"}</td>
                    <td className="py-2 pr-4">{e.email || "-"}</td>
                    <td className="py-2 pr-4">{e.attendancePercent ?? 0}%</td>
                    <td className="py-2 pr-4">{e.present ?? 0}</td>
                    <td className="py-2 pr-4">{e.late ?? 0}</td>
                  </tr>
                ))}
                {!(data?.topEmployees || []).length && (
                  <tr>
                    <td className="py-3 text-gray-500" colSpan={5}>
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="text-lg font-semibold text-gray-900">Manager-wise Summary</div>
          <div className="mt-3 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Manager</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Employees</th>
                </tr>
              </thead>
              <tbody>
                {(data?.managerSummary || []).map((m) => (
                  <tr key={m.managerId} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{m.name || "-"}</td>
                    <td className="py-2 pr-4">{m.email || "-"}</td>
                    <td className="py-2 pr-4">{m.employeesCount ?? 0}</td>
                  </tr>
                ))}
                {!(data?.managerSummary || []).length && (
                  <tr>
                    <td className="py-3 text-gray-500" colSpan={3}>
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-lg font-semibold text-gray-900">Department-wise Summary</div>
          <div className="mt-3 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Department</th>
                  <th className="py-2 pr-4">Employees</th>
                </tr>
              </thead>
              <tbody>
                {(data?.departmentSummary || []).map((d) => (
                  <tr key={d.department} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{d.department}</td>
                    <td className="py-2 pr-4">{d.employeesCount ?? 0}</td>
                  </tr>
                ))}
                {!(data?.departmentSummary || []).length && (
                  <tr>
                    <td className="py-3 text-gray-500" colSpan={2}>
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
