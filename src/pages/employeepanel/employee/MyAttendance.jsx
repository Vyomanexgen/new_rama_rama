import React, { useEffect, useRef, useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import {
  checkLocationPermission,
  getUserLocation,
  validateLocation,
  saveAttendance,
  startLiveLocationTracking
} from "../../../authSync";
import { employeeApi } from "../../../api/employeeApi";
import {
  registerBiometric,
  authenticateBiometric,
  checkBiometricRegistration
} from "../../../biometric";

import { auth } from "../../../firebase";
import { db } from "../../../firebase";
import { collection, query, where, onSnapshot, getDoc, getDocs, limit, doc } from "firebase/firestore";
const DEBUG = import.meta.env.VITE_DEBUG_LOGS === "true";
const log = (...args) => {
  if (DEBUG) console.log(...args);
};

export default function MyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [registrationRequested, setRegistrationRequested] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [locationCache, setLocationCache] = useState({});
  const stopTrackingRef = useRef(null);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const registered = await checkBiometricRegistration();
        setIsRegistered(registered);
        log("[UI] Biometric registration status:", registered);
      } catch (err) {
        console.error("[UI] Failed to check registration:", err);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, []);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        let docSnap = await getDoc(doc(db, "employees", user.uid));
        let data = docSnap.exists() ? docSnap.data() : null;

        if (!data) {
          let q = query(collection(db, "employees"), where("firebaseUid", "==", user.uid), limit(1));
          let qs = await getDocs(q);
          if (qs.empty) {
            q = query(collection(db, "employees"), where("uid", "==", user.uid), limit(1));
            qs = await getDocs(q);
          }
          if (qs.empty && user.email) {
            q = query(collection(db, "employees"), where("email", "==", user.email), limit(1));
            qs = await getDocs(q);
          }
          if (!qs.empty) {
            data = qs.docs[0].data();
          }
        }

        const requested = !!data?.fingerprint?.registrationRequested;
        setRegistrationRequested(requested);
      } catch (err) {
        console.error("[UI] Failed to load fingerprint request:", err);
      }
    };

    loadRequest();
  }, [isRegistered]);

  useEffect(() => {
    log("[ATTENDANCE UI] Setting up real-time listener...");

    const user = auth.currentUser;

    if (!user) {
      log("[ATTENDANCE UI] No user logged in, skipping listener setup");
      return;
    }

    log("[ATTENDANCE UI] User logged in:", user.uid);

    const q = query(
      collection(db, "attendance"),
      where("uid", "==", user.uid)
    );

    log("[ATTENDANCE UI] Query created for UID:", user.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        log("[ATTENDANCE UI] Snapshot received");
        log("[ATTENDANCE UI] Number of documents:", snapshot.docs.length);

        const records = snapshot.docs.map((doc) => {
          log("[ATTENDANCE UI] Document:", doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        records.sort((a, b) => new Date(b.date) - new Date(a.date));

        log("[ATTENDANCE UI] Setting attendance data:", records);
        setAttendanceData(records);
      },
      (error) => {
        console.error("[ATTENDANCE UI] Snapshot error:", error);
        console.error("[ATTENDANCE UI] Error code:", error.code);
        console.error("[ATTENDANCE UI] Error message:", error.message);
      }
    );

    return () => {
      log("[ATTENDANCE UI] Cleaning up listener");
      unsubscribe();
    };
  }, []);

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      case "absent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTime = (value) => {
    if (!value) return "--";
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return value;
    }
    if (value?.toDate) {
      return value.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (value instanceof Date) {
      return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return "--";
  };

  const handleRegisterFingerprint = async () => {
    if (loading) return;

    try {
      setLoading(true);
      log("[UI] Starting fingerprint registration...");
      await registerBiometric();
      alert("✅ Fingerprint registered successfully! You can now mark attendance.");
      setIsRegistered(true);
      setRegistrationRequested(false);
    } catch (err) {
      console.error("[UI] Registration failed:", err);
      alert(`❌ Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLiveTracking = async () => {
    try {
      setTrackingError("");
      await checkLocationPermission();
      const stop = await startLiveLocationTracking({ minIntervalMs: 15000, minDistanceMeters: 10 });
      stopTrackingRef.current = stop;
      setTracking(true);
    } catch (err) {
      console.error("[UI] Live tracking failed:", err);
      setTrackingError(err.message || "Failed to start live tracking");
    }
  };

  const handleStopLiveTracking = () => {
    if (stopTrackingRef.current) {
      stopTrackingRef.current();
      stopTrackingRef.current = null;
    }
    setTracking(false);
  };

  useEffect(() => {
    return () => {
      if (stopTrackingRef.current) {
        stopTrackingRef.current();
      }
    };
  }, []);

  const handleMarkPresent = async () => {
    if (loading) return;

    try {
      setLoading(true);

      log("[UI] ========================================");
      log("[UI] Starting attendance marking process...");
      log("[UI] ========================================");

      log("[UI] STEP 1: Checking location permission...");

      try {
        await checkLocationPermission();
        log("[UI] ✅ Location permission OK");
      } catch (err) {
        throw new Error(`Location Permission: ${err.message}`);
      }

      log("[UI] STEP 2: Getting user location...");

      let location;
      try {
        location = await getUserLocation({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
        log("[UI] ✅ Location obtained:", location);
      } catch (err) {
        throw new Error(`Location Access: ${err.message}`);
      }

      if (location?.accuracy && location.accuracy > 100 && navigator.geolocation) {
        log("[UI] Low accuracy detected, requesting a live location fix...");
        const refined = await new Promise((resolve) => {
          let best = null;
          const startedAt = Date.now();
          const watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const fix = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              };
              if (!best || fix.accuracy < best.accuracy) best = fix;
              if (fix.accuracy <= 50 || Date.now() - startedAt > 8000) {
                navigator.geolocation.clearWatch(watchId);
                resolve(best || fix);
              }
            },
            () => {
              navigator.geolocation.clearWatch(watchId);
              resolve(null);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
          );
        });
        if (refined) {
          location = refined;
          log("[UI] ✅ Live location fix obtained:", location);
        }
      }

      log("[UI] STEP 3: Validating location against office radius...");

      let distance;
      try {
        const assignmentRes = await employeeApi.myAssignment();
        const assignedLocation = assignmentRes?.data?.assignedLocation || null;
        const lat = assignedLocation?.lat ?? assignedLocation?.latitude;
        const lng = assignedLocation?.lng ?? assignedLocation?.longitude;

        if (lat == null || lng == null) {
          throw new Error("Assigned location not set. Please contact your manager.");
        }

        const validation = await validateLocation(location, assignedLocation);
        distance = validation.distance;
        log("[UI] ✅ Location validated. Distance:", distance, "meters");
      } catch (err) {
        const assignmentRes = await employeeApi.myAssignment().catch(() => null);
        const assignedLocation = assignmentRes?.data?.assignedLocation || null;
        const aLat = assignedLocation?.lat ?? assignedLocation?.latitude;
        const aLng = assignedLocation?.lng ?? assignedLocation?.longitude;
        const details = `Your location: ${location?.lat?.toFixed?.(6)}, ${location?.lng?.toFixed?.(6)} (accuracy ${Math.round(location?.accuracy || 0)}m). Assigned: ${aLat}, ${aLng}.`;
        throw new Error(`${err.message} ${details}`);
      }

      log("[UI] STEP 4: Requesting biometric authentication...");

      try {
        await authenticateBiometric();
        log("[UI] ✅ Biometric authentication successful");
      } catch (err) {
        throw new Error(`Biometric Authentication: ${err.message}`);
      }

      log("[UI] STEP 5: Saving attendance to database...");

      try {
        await saveAttendance(location, distance);
        log("[UI] ✅ Attendance saved successfully");
      } catch (err) {
        throw new Error(`Save Failed: ${err.message}`);
      }

      log("[UI] ========================================");
      log("[UI] ✅ ATTENDANCE MARKED SUCCESSFULLY");
      log("[UI] ========================================");

      alert("✅ Attendance marked successfully!");
    } catch (err) {
      console.error("[UI] ========================================");
      console.error("[UI] ❌ ATTENDANCE MARKING FAILED");
      console.error("[UI] Error:", err.message);
      console.error("[UI] ========================================");

      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchAddress = async (lat, lng) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await res.json();
        return data?.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      } catch {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    };

    const run = async () => {
      const updates = {};
      for (const row of attendanceData) {
        const loc = row.location || {};
        const lat = loc.lat ?? loc.latitude;
        const lng = loc.lng ?? loc.longitude;
        if (lat == null || lng == null) continue;
        const key = `${lat},${lng}`;
        if (locationCache[key]) continue;
        const addr = await fetchAddress(lat, lng);
        updates[key] = addr;
      }
      if (!cancelled && Object.keys(updates).length) {
        setLocationCache((prev) => ({ ...prev, ...updates }));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [attendanceData, locationCache]);

  const getLocationLabel = (row) => {
    const loc = row.location || {};
    const lat = loc.lat ?? loc.latitude;
    const lng = loc.lng ?? loc.longitude;
    if (lat != null && lng != null) {
      const key = `${lat},${lng}`;
      return locationCache[key] || `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    }
    if (loc.label || loc.name || loc.address) return loc.label || loc.name || loc.address;
    return "--";
  };

  return (
    <div className="space-y-6">
      {registrationRequested && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-yellow-800">Fingerprint re-registration requested</p>
            <p className="text-sm text-yellow-700">Your manager requested fingerprint setup. Please confirm on this device.</p>
          </div>
          <button
            onClick={handleRegisterFingerprint}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50"
          >
            Re-register Now
          </button>
        </div>
      )}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaFingerprint className="text-blue-500 text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mark Today's Attendance</h2>
              <p className="text-gray-500 text-sm">
                Use fingerprint authentication to mark your attendance
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Live tracking helps your manager see your current location.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {!isRegistered && !checkingRegistration && (
            <button
              onClick={handleRegisterFingerprint}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              Register Fingerprint
            </button>
          )}

          {isRegistered && (
            <button
              onClick={handleMarkPresent}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Mark Attendance
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold">Attendance History</h2>
        <p className="text-gray-500 text-sm mb-4">View your complete attendance records</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Distance (m)</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2">{formatTime(row.time)}</td>
                  <td className="px-4 py-2">
                    {getLocationLabel(row)}
                  </td>
                  <td className="px-4 py-2">{row.distanceFromOffice ?? row.distance ?? "--"}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!attendanceData.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
