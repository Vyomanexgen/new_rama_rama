import React, { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

function Stat({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState(0);
  const [managers, setManagers] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [cities, setCities] = useState(0);
  const [zones, setZones] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/superadmin/dashboard");
      const c = res?.data?.counts || {};

      setAdmins(Number(c.admins || 0));
      setManagers(Number(c.managers || 0));
      setEmployees(Number(c.employees || 0));
      setCities(Number(c.cities || 0));
      setZones(Number(c.zones || 0));
    } catch (e) {
      console.error(e);
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Admins", value: admins },
      { label: "Total Managers", value: managers },
      { label: "Total Employees", value: employees },
      { label: "Total Cities", value: cities },
      { label: "Total Zones", value: zones },
    ],
    [admins, managers, employees, cities, zones]
  );

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}
