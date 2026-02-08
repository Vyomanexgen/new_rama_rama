import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { managerApi } from "../../api/managerApi";

const REFRESH_MS = 10000;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.length === 2) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

const Location = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [checkinId, setCheckinId] = useState(null);

  const load = async (d, preserveId) => {
    try {
      setLoading(true);
      setError("");
      const res = await managerApi.location(d);
      const list = res.data?.employees || [];
      setEmployees(list);
      setLastUpdated(new Date());

      const selected = preserveId
        ? list.find((e) => e.id === preserveId) || list[0]
        : list.find((e) => e.id === selectedEmployeeId) || list[0];

      if (selected) {
        setSelectedEmployeeId(selected.id);
        const target = selected.employeeLocation || selected.assignedLocation;
        if (target?.lat != null && target?.lng != null) {
          setMapCenter([target.lat, target.lng]);
        }
      }
    } catch (e) {
      console.error("LOCATION LOAD ERROR:", e);
      setError("Failed to load location data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date, selectedEmployeeId);
  }, [date]);

  useEffect(() => {
    const id = setInterval(() => load(date, selectedEmployeeId), REFRESH_MS);
    return () => clearInterval(id);
  }, [date, selectedEmployeeId]);

  const counts = useMemo(() => {
    const withinRange = employees.filter((e) => e.status === "Within Range").length;
    const outOfRange = employees.filter((e) => e.status === "Out of Range").length;
    const notTracked = employees.filter((e) => e.status === "Not Tracked").length;
    return {
      withinRange,
      outOfRange,
      notTracked,
      total: employees.length,
    };
  }, [employees]);

  const handleView = (emp) => {
    setSelectedEmployeeId(emp.id);
    const target = emp.employeeLocation || emp.assignedLocation;
    if (target?.lat != null && target?.lng != null) {
      setMapCenter([target.lat, target.lng]);
    } else if (emp.mapUrl) {
      window.open(emp.mapUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No live location available yet. Ask the employee to enable live tracking.");
    }
  };

  const handleManualCheckIn = async (emp) => {
    try {
      setCheckinId(emp.id);
      setError("");
      await managerApi.locationCheckin({ employeeId: emp.id });
      await load(date, emp.id);
    } catch (e) {
      console.error("MANUAL CHECKIN ERROR:", e);
      const message = e?.response?.data?.message || "Failed to mark as tracked";
      setError(message);
    } finally {
      setCheckinId(null);
    }
  };

  const markers = employees
    .map((emp) => {
      const loc = emp.employeeLocation || emp.assignedLocation;
      if (!loc || loc.lat == null || loc.lng == null) return null;
      return { emp, position: [loc.lat, loc.lng] };
    })
    .filter(Boolean);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || null;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">📍 Location Tracking System</h2>

        <p className="text-gray-600 mt-1 text-sm">
          Track security personnel location in real-time. System alerts when staff are
          within 100 meters of their assigned location.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-600">Select Date:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <span className="text-xs text-gray-500">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}
          </span>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-300 p-3 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-green-100 text-green-700 text-center shadow">
          <h3 className="font-semibold">Within Range</h3>
          <p className="text-3xl font-bold">{counts.withinRange}</p>
        </div>

        <div className="p-5 rounded-xl bg-red-100 text-red-700 text-center shadow">
          <h3 className="font-semibold">Out of Range</h3>
          <p className="text-3xl font-bold">{counts.outOfRange}</p>
        </div>

        <div className="p-5 rounded-xl bg-yellow-100 text-yellow-700 text-center shadow">
          <h3 className="font-semibold">Not Tracked</h3>
          <p className="text-3xl font-bold">{counts.notTracked}</p>
        </div>

        <div className="p-5 rounded-xl bg-blue-100 text-blue-700 text-center shadow">
          <h3 className="font-semibold">Total Guards</h3>
          <p className="text-3xl font-bold">{counts.total}</p>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading locations...</div>}

      {employees.map((emp) => (
        <div
          key={emp.id}
          className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center hover:shadow-md transition"
        >
          <div className="flex items-start gap-3">
            <div className="text-gray-600 bg-gray-100 p-3 rounded-full">
              <FaMapMarkerAlt className="text-2xl text-gray-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">{emp.name}</h3>
              <p className="text-gray-500">{emp.email}</p>

              <p className="text-sm text-gray-600 mt-1 flex gap-1">
                <span className="font-semibold text-gray-700">📌 Assigned Location:</span>
                {emp.assignedLocation?.name || "Assigned Location"}
              </p>

              {emp.assignedLocation?.lat != null && emp.assignedLocation?.lng != null && (
                <p className="text-gray-500 text-sm">
                  {emp.assignedLocation.lat}°N, {emp.assignedLocation.lng}°E
                </p>
              )}

              <p className="text-sm mt-1">
                <span className="font-semibold">Status:</span> {emp.status}
                {emp.distanceMeters != null && (
                  <span className="text-gray-500"> · {emp.distanceMeters}m</span>
                )}
              </p>

              {emp.employeeLocation?.capturedAt && (
                <p className="text-xs text-gray-500">
                  Last seen: {new Date(emp.employeeLocation.capturedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {emp.status === "Not Tracked" && (
              <button
                className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                onClick={() => handleManualCheckIn(emp)}
                disabled={checkinId === emp.id}
              >
                {checkinId === emp.id ? "Marking..." : "Mark Tracked"}
              </button>
            )}
            {emp.mapUrl && (
              <a
                href={emp.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
              >
                Open Maps
              </a>
            )}
            <button
              className="bg-black text-white py-2 px-4 rounded-lg shadow hover:bg-gray-800"
              onClick={() => handleView(emp)}
            >
              View on Map
            </button>
          </div>
        </div>
      ))}

      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Live Map View</h2>

        <div className="h-80 w-full rounded-xl overflow-hidden">
          <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={mapCenter} zoom={14} />

            {markers.map((m) => (
              <Marker key={m.emp.id} position={m.position}>
                <Popup>
                  <b>{m.emp.name}</b>
                  <br />
                  {m.emp.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Use Location Tracking</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
          <li>Select a date to view locations for that day.</li>
          <li>Click “View on Map” to center the map on a guard.</li>
          <li>Use “Open Maps” to view route details.</li>
        </ol>
      </div>
    </div>
  );
};

export default Location;
