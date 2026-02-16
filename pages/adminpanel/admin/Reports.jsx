import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { FaDownload } from "react-icons/fa";

const kpis = [
  { id: 1, title: "Overall Attendance", value: "91.5%", change: "+2.3%" },
  { id: 2, title: "Total Employees", value: "150", change: "+5" },
  { id: 3, title: "Late Arrivals", value: "45", change: "-8" },
  { id: 4, title: "Absent Days", value: "30", change: "-5" },
];

const weeklyData = [
  { name: "Week 1", Present: 85, Late: 5, Absent: 10 },
  { name: "Week 2", Present: 92, Late: 4, Absent: 4 },
  { name: "Week 3", Present: 90, Late: 6, Absent: 4 },
  { name: "Week 4", Present: 93, Late: 3, Absent: 4 },
];

const pieData = [
  { name: "Present", value: 89 },
  { name: "Late", value: 5 },
  { name: "Half Day", value: 3 },
  { name: "Absent", value: 3 },
];

const pieColors = ["#16a34a", "#f59e0b", "#60a5fa", "#ef4444"];

const deptData = [
  { name: "Corporate Security", value: 95 },
  { name: "Administration", value: 98 },
  { name: "Field Operations", value: 88 },
  { name: "Residential Security", value: 85 },
];

const sixMonth = [
  { month: "Jan", value: 88 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 87 },
  { month: "Apr", value: 92 },
  { month: "May", value: 89 },
  { month: "Jun", value: 93 },
];

const topEmployees = [
  { rank: 1, name: "Rajesh Kumar", dept: "Corporate Security", attendance: 100, rating: 5 },
  { rank: 2, name: "Priya Sharma", dept: "Field Operations", attendance: 98, rating: 4.9 },
  { rank: 3, name: "Amit Singh", dept: "Residential Security", attendance: 97, rating: 4.8 },
  { rank: 4, name: "Sunita Patel", dept: "Corporate Security", attendance: 96, rating: 4.8 },
  { rank: 5, name: "Vikram Reddy", dept: "Field Operations", attendance: 95, rating: 4.7 },
];

export default function Reports() {
  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Comprehensive insights and performance metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-4 py-2 rounded-md border bg-white text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.id} className="bg-white rounded-lg p-5 border shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-green-600 font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{k.title}</div>
                  <div className="text-2xl font-semibold text-slate-900 mt-2">{k.value}</div>
                </div>
              </div>
              <div className={`text-sm ${k.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{k.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-lg p-5 border shadow-sm">
          <h3 className="text-md font-medium text-slate-900 mb-4">Weekly Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#16a34a" barSize={18} />
              <Bar dataKey="Late" fill="#f59e0b" barSize={18} />
              <Bar dataKey="Absent" fill="#ef4444" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-5 border shadow-sm">
          <h3 className="text-md font-medium text-slate-900 mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

        {/* Department Performance */}
        <div className="bg-white rounded-lg p-5 border shadow-sm">
          <h3 className="text-md font-medium text-slate-900 mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#1e40af" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6-Month Trend */}
        <div className="bg-white rounded-lg p-5 border shadow-sm">
          <h3 className="text-md font-medium text-slate-900 mb-4">6-Month Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sixMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-lg p-5 border shadow-sm mb-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium text-slate-900">Top Performing Employees</h3>
          <select className="px-3 py-2 rounded-md border bg-white text-sm">
            <option>All Departments</option>
          </select>
        </div>

        <table className="w-full min-w-max text-sm">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-600">
            {topEmployees.map((t) => (
              <tr key={t.rank} className="border-t">
                <td className="py-4 px-4">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-medium">
                    {t.rank}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      {t.name.charAt(0)}
                    </div>
                    <div className="font-medium text-gray-900">{t.name}</div>
                  </div>
                </td>
                <td className="py-4 px-4">{t.dept}</td>
                <td className="py-4 px-4">
                  <div className="w-48 bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-green-500" style={{ width: `${t.attendance}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t.attendance}%</div>
                </td>
                <td className="py-4 px-4">★ {t.rating}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700">
                    Excellent
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg p-5 border shadow-sm space-y-4">
        <h3 className="text-md font-medium text-slate-900">AI-Powered Insights & Recommendations</h3>

        {/* Insight Items */}
        <InsightBox
          bg="bg-green-50"
          border="border-green-100"
          icon="✅"
          title="Excellent Overall Performance"
          text="Your organization's attendance rate has improved by 2.3% this month. Corporate Security department is leading with 95% attendance."
          textColor="text-green-800"
        />
        <InsightBox
          bg="bg-yellow-50"
          border="border-yellow-100"
          icon="⚠️"
          title="Attention Required"
          text="Late arrivals have increased by 12% in the Residential Security department. Consider scheduling a team meeting to address punctuality."
          textColor="text-yellow-800"
        />
        <InsightBox
          bg="bg-blue-50"
          border="border-blue-100"
          icon="📈"
          title="Growth Opportunity"
          text="With 150 active employees and consistent growth, consider expanding your team by 10% to meet increasing demand for security services."
          textColor="text-blue-800"
        />
      </div>

    </div>
  );
}

function InsightBox({ bg, border, icon, title, text, textColor }) {
  return (
    <div className={`p-4 rounded-md border ${bg} ${border}`}>
      <div className="flex items-start gap-3">
        <div className={`text-xl ${textColor}`}>{icon}</div>
        <div>
          <div className={`font-semibold ${textColor}`}>{title}</div>
          <div className="text-sm text-gray-700">{text}</div>
        </div>
      </div>
    </div>
  );
}















