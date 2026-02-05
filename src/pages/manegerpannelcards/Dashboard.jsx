// import { FaCheckCircle, FaUserClock, FaUsers, FaCalendarAlt, FaTimesCircle, FaMapMarker } from "react-icons/fa";

// export default function Dashboard() {
//   return (
//     <div>

//       {/* Cards Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard title="Present Today" value="0" color="bg-green-500" icon={<FaCheckCircle />} />
//         <StatCard title="Late Today" value="0" color="bg-yellow-500" icon={<FaUserClock />} />
//         <StatCard title="Absent Today" value="0" color="bg-red-500" icon={<FaUsers />} />
//         <StatCard title="Half Day" value="0" color="bg-blue-500" icon={<FaCalendarAlt />} />
//       </div>

//       {/* Location Tracking */}
//       <div className="bg-orange-50 border rounded-lg p-5 mb-6">
//         <div className="flex justify-between mb-4">
//           <h2 className="text-lg font-semibold">Location Tracking Status</h2>
//           <button className="text-blue-600 underline">View All</button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <TrackStatus label="Within Range (100m)" count="0" color="text-green-600" icon={<FaCheckCircle />} />
//           <TrackStatus label="Out of Range" count="0" color="text-red-600" icon={<FaTimesCircle />} />
//           <TrackStatus label="Not Tracked" count="5" color="text-gray-600" icon={<FaMapMarker />} />
//         </div>
//       </div>

//       {/* Attendance Summary */}
//       <div className="bg-white border rounded-lg p-5 mb-6">
//         <h2 className="font-semibold mb-3">Today's Attendance Summary</h2>

//         <table className="w-full text-left text-sm">
//           <thead className="border-b text-gray-600">
//             <tr>
//               <th className="pb-2">Employee</th>
//               <th>Check In</th>
//               <th>Check Out</th>
//               <th>Status</th>
//               <th>Location</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td colSpan={5} className="text-center py-4 text-gray-500">
//                 No records found
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* Quick Actions */}
//       <div className="flex flex-wrap gap-3">
//         <ActionButton label="Mark Attendance" />
//         <ActionButton label="Register Fingerprint" />
//         <ActionButton label="Track Location" />
//         <ActionButton label="View Employees" />
//         <ActionButton label="View Reports" />
//       </div>

//     </div>
//   );
// }

// const StatCard = ({ title, value, color, icon }) => (
//   <div className={`${color} text-white rounded-lg p-4 flex items-center justify-between shadow-md`}>
//     <div>
//       <h3 className="text-sm font-medium">{title}</h3>
//       <p className="text-2xl font-semibold">{value}</p>
//     </div>
//     <div className="text-3xl opacity-80">{icon}</div>
//   </div>
// );

// const TrackStatus = ({ label, count, color, icon }) => (
//   <div className="bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm">
//     <div className={`text-3xl ${color}`}>{icon}</div>
//     <div className="text-right">
//       <p className="text-sm">{label}</p>
//       <p className="text-xl font-semibold">{count}</p>
//     </div>
//   </div>
// );

// const ActionButton = ({ label }) => (
//   <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition">
//     {label}
//   </button>
// );

