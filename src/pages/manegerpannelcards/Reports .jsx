import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";
import { managerApi } from "../../api/managerApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const fmtPercent = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "0%";
  return `${Math.round(Number(value) * 10) / 10}%`;
};

const shortDate = (value) => {
  if (!value) return "--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
};

export default function Reports() {
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [weeklyRes, monthlyRes, employeesRes] = await Promise.all([
          managerApi.reportsWeekly(),
          managerApi.reportsMonthly(),
          managerApi.employees(),
        ]);
        setWeekly(weeklyRes.data || null);
        setMonthly(monthlyRes.data || null);
        setEmployees(employeesRes.data?.employees || []);
      } catch (e) {
        console.error("REPORTS LOAD ERROR:", e);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const monthlySummary = monthly?.monthlySummary || {};
    const totalRecords = monthlySummary.totalRecords || 0;
    const present = monthlySummary.present || 0;
    const late = monthlySummary.late || 0;
    const absent = monthlySummary.absent || 0;
    const halfDay = monthlySummary.halfDay || 0;
    const attended = present + late + halfDay;
    const attendanceRate = totalRecords ? (attended / totalRecords) * 100 : 0;

    return {
      totalEmployees: employees.length,
      present,
      late,
      absent,
      halfDay,
      totalRecords,
      attendanceRate,
    };
  }, [monthly, employees]);

  const weeklyTrend = weekly?.weeklyTrend || [];
  const weeklyLabels = weeklyTrend.map((d) => shortDate(d.date));

  const weeklyData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Absent",
        data: weeklyTrend.map((d) => d.absent || 0),
        backgroundColor: "#ff4d4d",
      },
      {
        label: "Late",
        data: weeklyTrend.map((d) => d.late || 0),
        backgroundColor: "#facc15",
      },
      {
        label: "Present",
        data: weeklyTrend.map((d) => d.present || 0),
        backgroundColor: "#22c55e",
      },
      {
        label: "Half Day",
        data: weeklyTrend.map((d) => d["half-day"] || 0),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const distribution = monthly?.distribution || {};
  const pieData = {
    labels: ["Present", "Absent", "Late", "Half Day"],
    datasets: [
      {
        data: [
          distribution.present || 0,
          distribution.absent || 0,
          distribution.late || 0,
          distribution["half-day"] || 0,
        ],
        backgroundColor: ["#22c55e", "#ef4444", "#eab308", "#3b82f6"],
      },
    ],
  };

  const deptStats = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => {
      const dept = emp.department || emp.dept || "Unassigned";
      const percent = emp.attendanceSummary?.attendancePercent || 0;
      if (!map.has(dept)) map.set(dept, { total: 0, count: 0 });
      const current = map.get(dept);
      current.total += percent;
      current.count += 1;
    });

    return Array.from(map.entries()).map(([dept, val]) => ({
      dept,
      avg: val.count ? Math.round(val.total / val.count) : 0,
    }));
  }, [employees]);

  const deptData = {
    labels: deptStats.map((d) => d.dept),
    datasets: [
      {
        label: "Attendance %",
        data: deptStats.map((d) => d.avg),
        backgroundColor: "#2563eb",
      },
    ],
  };

  const deptOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { suggestedMin: 0, suggestedMax: 100 },
    },
  };

  const lineData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Attendance %",
        data: weeklyTrend.map((d) => {
          const total = (d.present || 0) + (d.late || 0) + (d.absent || 0) + (d["half-day"] || 0);
          const attended = (d.present || 0) + (d.late || 0) + (d["half-day"] || 0);
          return total ? Math.round((attended / total) * 100) : 0;
        }),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
      },
    ],
  };

  const topPerformers = (monthly?.topPerformers || [])
    .slice(0, 5)
    .map((p, i) => ({
      rank: i + 1,
      name: p.name || p.email || "-",
      dept: p.department || p.dept || "-",
      attendance: p.attendancePercent || 0,
    }));

  const fallbackTop = employees
    .map((e) => ({
      name: e.name || e.fullName || e.email || "-",
      dept: e.department || e.dept || "-",
      attendance: e.attendanceSummary?.attendancePercent || 0,
    }))
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const topList = topPerformers.length ? topPerformers : fallbackTop;

  const exportReport = async () => {
    try {
      const range = monthly?.range || {};
      const res = await managerApi.reportsExport({
        format: "csv",
        start: range.start,
        end: range.end,
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manager-report-${range.start || "latest"}-${range.end || "latest"}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("EXPORT ERROR:", e);
      alert("Failed to export report");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Reports & Analytics</h1>
      <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>

      <div className="flex justify-between items-center mt-4">
        <button className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">This Month</button>
        <button className="px-4 py-2 bg-black text-white rounded-lg" onClick={exportReport}>
          Export Report
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      {loading && <div className="mt-3 text-sm text-gray-500">Loading reports...</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {[
          {
            title: "Overall Attendance",
            value: fmtPercent(summary.attendanceRate),
            stat: "",
            color: "text-green-600",
            icon: "✓",
          },
          {
            title: "Total Employees",
            value: String(summary.totalEmployees),
            stat: "",
            color: "text-blue-600",
            icon: "👥",
          },
          {
            title: "Late Arrivals",
            value: String(summary.late),
            stat: "",
            color: "text-yellow-600",
            icon: "⏰",
          },
          {
            title: "Absent Days",
            value: String(summary.absent),
            stat: "",
            color: "text-red-600",
            icon: "⚠️",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className={`font-semibold ${item.color}`}>{item.icon} {item.stat}</div>
            <h3 className="text-gray-800">{item.title}</h3>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Weekly Attendance Trends</h2>
          <Bar data={weeklyData} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Attendance Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Department Performance</h2>
          {deptStats.length ? <Bar data={deptData} options={deptOptions} /> : <div className="text-sm text-gray-500">No department data</div>}
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Attendance Trend (Last 7 Days)</h2>
          <Line data={lineData} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <h2 className="font-semibold mb-3">Top Performing Employees</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-600">
              <tr>
                <th>Rank</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {topList.map((e) => (
                <tr key={`${e.rank}-${e.name}`} className="border-b">
                  <td className="py-2">{e.rank}</td>
                  <td>{e.name}</td>
                  <td>{e.dept}</td>
                  <td>
                    <div className="bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${e.attendance}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
              {!topList.length && (
                <tr>
                  <td colSpan={4} className="py-3 text-sm text-gray-500 text-center">
                    No employee data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <h2 className="font-semibold mb-3">AI-Powered Insights & Recommendations</h2>

        <div className="bg-green-100 p-4 rounded-lg mb-3">
          <p className="font-semibold">Overall Performance</p>
          <p className="text-gray-700">
            Attendance rate is {fmtPercent(summary.attendanceRate)} across the last 30 days.
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg mb-3">
          <p className="font-semibold">Attention Required</p>
          <p className="text-gray-700">
            Late arrivals this period: {summary.late}. Keep monitoring punctuality.
          </p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="font-semibold">Growth Opportunity</p>
          <p className="text-gray-700">
            Total employees tracked: {summary.totalEmployees}. Use reports to optimize staffing.
          </p>
        </div>
      </div>
    </div>
  );
}
