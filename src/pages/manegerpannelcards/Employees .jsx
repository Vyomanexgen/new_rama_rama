import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { managerApi } from "../../api/managerApi";

export default function Employees() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [mapMarker, setMapMarker] = useState(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationSearchStatus, setLocationSearchStatus] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(100);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const load = async (q) => {
    try {
      setLoading(true);
      setError("");
      const res = await managerApi.employees({ q });
      const list = res.data?.employees || res.data?.data || [];
      setEmployees(list);
    } catch (e) {
      console.error("EMPLOYEES LOAD ERROR:", e);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const summary = useMemo(() => {
    const total = employees.length;
    const corporate = employees.filter((e) => (e.department || "").toLowerCase().includes("corporate")).length;
    const residential = employees.filter((e) => (e.department || "").toLowerCase().includes("residential")).length;
    const fingerprint = employees.filter((e) => e.fingerprintStatus?.startRegistered || e.fingerprintStatus?.endRegistered).length;
    return { total, corporate, residential, fingerprint };
  }, [employees]);

  const initials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const openEditor = (emp) => {
    const assigned = emp.assignedLocation || emp.location || {};
    const lat = assigned.lat ?? assigned.latitude;
    const lng = assigned.lng ?? assigned.longitude;
    const center = lat != null && lng != null ? [lat, lng] : [12.9716, 77.5946];
    setEditingEmployee(emp);
    setMapCenter(center);
    setMapMarker(lat != null && lng != null ? { lat, lng } : null);
    setLocationQuery(assigned.name || assigned.label || assigned.address || "");
    setLocationResults([]);
    setRadiusMeters(Number(assigned.radiusMeters ?? assigned.radius ?? 100));
    setShiftStart(emp.workSchedule?.startTime || "");
    setShiftEnd(emp.workSchedule?.endTime || "");
    setSaveError("");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingEmployee(null);
    setLocationResults([]);
    setSaveError("");
  };

  const handleSearch = async () => {
    if (!locationQuery.trim()) return;
    try {
      setLocationSearchStatus("Searching...");
      const q = encodeURIComponent(locationQuery.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${q}`
      );
      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }
      const data = await res.json();
      const results = (data || []).map((item) => ({
        id: item.place_id,
        name: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));
      setLocationResults(results);
      if (results.length > 0) {
        // Auto-move map to first result
        const first = results[0];
        setMapCenter([first.lat, first.lng]);
        setMapMarker({ lat: first.lat, lng: first.lng });
        setLocationQuery(first.name);
        setLocationSearchStatus("");
      } else {
        setLocationSearchStatus("No results found. Try a more specific search.");
      }
    } catch (e) {
      console.error("LOCATION SEARCH ERROR:", e);
      setLocationSearchStatus("Search failed. Please try again.");
    }
  };

  const selectLocation = (loc) => {
    setMapCenter([loc.lat, loc.lng]);
    setMapMarker({ lat: loc.lat, lng: loc.lng });
    setLocationQuery(loc.name);
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center?.length === 2) {
        map.setView(center, map.getZoom(), { animate: true });
      }
    }, [center, map]);
    return null;
  };

  const handleSave = async () => {
    if (!editingEmployee) return;
    if (!mapMarker) {
      setSaveError("Please select a location on the map");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      await managerApi.updateEmployee(editingEmployee.id, {
        assignedLocation: {
          name: locationQuery || "Assigned Location",
          label: locationQuery || "Assigned Location",
          address: locationQuery || "Assigned Location",
          lat: mapMarker.lat,
          lng: mapMarker.lng,
          radiusMeters,
        },
        workSchedule: {
          startTime: shiftStart || null,
          endTime: shiftEnd || null,
        },
      });
      await load(query);
      closeEditor();
    } catch (e) {
      console.error("EMPLOYEE UPDATE ERROR:", e);
      setSaveError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const formatTime12h = (value) => {
    if (!value) return "--";
    const [h, m] = value.split(":").map((v) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return value;
    const period = h >= 12 ? "PM" : "AM";
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Employee Directory</h2>
          <p className="text-gray-600">View and manage all security personnel</p>
        </div>

        <div className="mt-3 md:mt-0 relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Employees" value={summary.total} bg="bg-blue-500" />
        <SummaryCard title="Corporate Security" value={summary.corporate} bg="bg-green-600" />
        <SummaryCard title="Residential Security" value={summary.residential} bg="bg-purple-600" />
        <SummaryCard title="Fingerprint Registered" value={summary.fingerprint} bg="bg-orange-500" />
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <h3 className="text-md font-semibold text-gray-700 mb-3">All Employees</h3>

        {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}

        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b">
              <th className="py-2">Name</th>
              <th>Department</th>
              <th>Assigned Location</th>
              <th>Fingerprint Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b text-sm text-gray-700 hover:bg-gray-50">
                <td className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {initials(emp.name || emp.fullName || emp.email)}
                  </div>
                  <div>
                    <p className="font-semibold">{emp.name || emp.fullName || emp.email}</p>
                    <p className="text-xs text-gray-400">{emp.email || "--"}</p>
                  </div>
                </td>

                <td>{emp.department || emp.dept || "-"}</td>

                <td className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    title="Assign location"
                    onClick={() => openEditor(emp)}
                  >
                    <FaMapMarkerAlt className="text-sm" />
                  </button>
                  <div className="min-w-0">
                    <p className="truncate">
                      {emp.assignedLocation?.name || emp.assignedLocation?.label || "-"}
                      {(emp.workSchedule?.startTime || emp.workSchedule?.endTime) && (
                        <span className="text-xs text-gray-400">
                          {"  "}• Shift: {formatTime12h(emp.workSchedule?.startTime)} -{" "}
                          {formatTime12h(emp.workSchedule?.endTime)}
                        </span>
                      )}
                    </p>
                  </div>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      emp.fingerprintStatus?.startRegistered || emp.fingerprintStatus?.endRegistered
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {emp.fingerprintStatus?.startRegistered || emp.fingerprintStatus?.endRegistered
                      ? "Registered"
                      : "Not Registered"}
                  </span>
                </td>

                <td>
                  <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={() => navigate("/manager/location")}
                  >
                    Track
                  </button>
                </td>
              </tr>
            ))}

            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Assign Location & Shift</h3>
                <p className="text-sm text-gray-500">
                  {editingEmployee?.name || editingEmployee?.fullName || editingEmployee?.email}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-700" onClick={closeEditor}>
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Shift Start</label>
                <input
                  type="time"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Shift End</label>
                <input
                  type="time"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Search Location</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Search area, address, or landmark"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
              {locationSearchStatus && (
                <div className="text-xs text-slate-500 mt-2">{locationSearchStatus}</div>
              )}

              {locationResults.length > 0 && (
                <div className="mt-2 max-h-40 overflow-auto border rounded-lg">
                  {locationResults.map((loc) => (
                    <button
                      type="button"
                      key={loc.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => selectLocation(loc)}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="w-full">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                <MapClicker
                  onPick={(lat, lng) => {
                    setMapMarker({ lat, lng });
                    setMapCenter([lat, lng]);
                  }}
                />
                {mapMarker && (
                  <Marker position={[mapMarker.lat, mapMarker.lng]}>
                    <Popup>Assigned Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <div className="mt-3">
              <label className="text-sm text-gray-600">Radius (meters)</label>
              <input
                type="number"
                min="25"
                max="1000"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value || 0))}
              />
            </div>

            {saveError && <div className="mt-3 text-sm text-red-600">{saveError}</div>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={closeEditor}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-4 mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Employee Management Guide</h3>

        <ul className="list-disc ml-5 text-gray-700 text-sm space-y-2">
          <li>Use the search bar to quickly find specific employees</li>
          <li>Click “Track” to view real-time location of any employee</li>
          <li>Register fingerprints for employees to enable biometric attendance</li>
          <li>View assigned locations for each security personnel</li>
          <li>Monitor fingerprint registration status at a glance</li>
        </ul>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, value, bg }) => (
  <div className={`${bg} text-white rounded-xl p-4 shadow-md`}>
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const MapClicker = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};
