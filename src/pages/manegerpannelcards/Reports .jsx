import React from "react";
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

export default function Reports() {
  // Weekly Attendance (Bar Chart)
  const weeklyData = {
    labels: ["Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Absent",
        data: [10, 12, 9],
        backgroundColor: "#ff4d4d",
      },
      {
        label: "Late",
        data: [5, 4, 6],
        backgroundColor: "#facc15",
      },
      {
        label: "Present",
        data: [95, 97, 96],
        backgroundColor: "#22c55e",
      },
    ],
  };

  // Attendance Distribution (Pie Chart)
  const pieData = {
    labels: ["Present", "Absent", "Late", "Half Day"],
    datasets: [
      {
        data: [89, 5, 4, 2],
        backgroundColor: ["#22c55e", "#ef4444", "#eab308", "#3b82f6"],
      },
    ],
  };

  // Department Performance (Horizontal Bar)
  const deptData = {
    labels: [
      "Corporate Security",
      "Residential Security",
      "Field Operations",
      "Administration",
    ],
    datasets: [
      {
        label: "Attendance %",
        data: [95, 92, 86, 88],
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
  };

  // 6-Month Attendance Trend (Line Chart)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Attendance %",
        data: [88, 90, 87, 93, 92, 95],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
      },
    ],
  };

  return (
    <div className="p-4">
      {/* Top Title */}
      <h1 className="text-xl font-semibold">Reports & Analytics</h1>
      <p className="text-gray-600 mt-1">
        Comprehensive insights and performance metrics
      </p>

      {/* Top Filters */}
      <div className="flex justify-between items-center mt-4">
        <button className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
          This Month
        </button>
        <button className="px-4 py-2 bg-black text-white rounded-lg">
          Export Report
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {[
          {
            title: "Overall Attendance",
            value: "91.5%",
            stat: "+2.3%",
            color: "text-green-600",
            icon: "✓",
          },
          {
            title: "Total Employees",
            value: "150",
            stat: "+5",
            color: "text-blue-600",
            icon: "👥",
          },
          {
            title: "Late Arrivals",
            value: "45",
            stat: "-3",
            color: "text-yellow-600",
            icon: "⏰",
          },
          {
            title: "Absent Days",
            value: "30",
            stat: "-5",
            color: "text-red-600",
            icon: "⚠️",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
          >
            <div className={`font-semibold ${item.color}`}>
              {item.icon} {item.stat}
            </div>
            <h3 className="text-gray-800">{item.title}</h3>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly + Pie */}
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

      {/* Department + Line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Department Performance</h2>
          <Bar data={deptData} options={deptOptions} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">6-Month Attendance Trend</h2>
          <Line data={lineData} />
        </div>
      </div>

      {/* Top Performing Employees */}
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
              {[
                { n: 1, name: "Rajesh Kumar", dept: "Corporate Security", att: 100 },
                { n: 2, name: "Priya Sharma", dept: "Field Operations", att: 90 },
                { n: 3, name: "Amit Singh", dept: "Residential Security", att: 97 },
                { n: 4, name: "Sunita Patel", dept: "Corporate Security", att: 96 },
                { n: 5, name: "Vikram Reddy", dept: "Field Operations", att: 95 },
              ].map((e) => (
                <tr key={e.n} className="border-b">
                  <td className="py-2">{e.n}</td>
                  <td>{e.name}</td>
                  <td>{e.dept}</td>
                  <td>
                    <div className="bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${e.att}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <h2 className="font-semibold mb-3">
          AI-Powered Insights & Recommendations
        </h2>

        <div className="bg-green-100 p-4 rounded-lg mb-3">
          <p className="font-semibold">Excellent Overall Performance</p>
          <p className="text-gray-700">
            Attendance rate improved by 2.3%. Corporate Security leads with 95%.
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg mb-3">
          <p className="font-semibold">Attention Required</p>
          <p className="text-gray-700">
            Late arrivals increased by 12% in Residential Security.
          </p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="font-semibold">Growth Opportunity</p>
          <p className="text-gray-700">
            With 150 active employees, expand security teams by 10%.
          </p>
        </div>
      </div>
    </div>
  );
}
