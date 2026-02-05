import React, { useEffect, useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import {
  checkLocationPermission,
  getUserLocation,
  validateLocation,
  saveAttendance
} from "../../../authSync";
import {
  registerBiometric,
  authenticateBiometric,
  checkBiometricRegistration
} from "../../../biometric";

// 🔥 FIREBASE IMPORTS
import { auth } from "../../../firebase";
import { db } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MyAttendance() {

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  /* ============================
      CHECK REGISTRATION STATUS
  ============================ */

  useEffect(() => {

    const checkRegistration = async () => {
      try {
        const registered = await checkBiometricRegistration();
        setIsRegistered(registered);
        console.log("[UI] Biometric registration status:", registered);
      } catch (err) {
        console.error("[UI] Failed to check registration:", err);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();

  }, []);

  /* ============================
      FETCH ATTENDANCE (LIVE)
  ============================ */

  useEffect(() => {

    console.log("[ATTENDANCE UI] Setting up real-time listener...");

    const user = auth.currentUser;

    if (!user) {
      console.log("[ATTENDANCE UI] No user logged in, skipping listener setup");
      return;
    }

    console.log("[ATTENDANCE UI] User logged in:", user.uid);

    const q = query(
      collection(db, "attendance"),
      where("uid", "==", user.uid)
    );

    console.log("[ATTENDANCE UI] Query created for UID:", user.uid);

    const unsubscribe = onSnapshot(q, (snapshot) => {

      console.log("[ATTENDANCE UI] Snapshot received");
      console.log("[ATTENDANCE UI] Number of documents:", snapshot.docs.length);

      const records = snapshot.docs.map(doc => {
        console.log("[ATTENDANCE UI] Document:", doc.id, doc.data());
        return {
          id: doc.id,
          ...doc.data()
        };
      });

      // Latest first
      records.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("[ATTENDANCE UI] Setting attendance data:", records);
      setAttendanceData(records);
    }, (error) => {
      console.error("[ATTENDANCE UI] Snapshot error:", error);
      console.error("[ATTENDANCE UI] Error code:", error.code);
      console.error("[ATTENDANCE UI] Error message:", error.message);
    });

    return () => {
      console.log("[ATTENDANCE UI] Cleaning up listener");
      unsubscribe();
    };

  }, []);

  /* ============================
        STATUS COLORS
  ============================ */

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

  /* ============================
      REGISTER FINGERPRINT
  ============================ */

  const handleRegisterFingerprint = async () => {

    if (loading) return;

    try {

      setLoading(true);

      console.log("[UI] Starting fingerprint registration...");

      await registerBiometric();

      alert("✅ Fingerprint registered successfully! You can now mark attendance.");

      setIsRegistered(true);

    } catch (err) {
      console.error("[UI] Registration failed:", err);
      alert(`❌ Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
        MARK ATTENDANCE
  ============================ */

  const handleMarkPresent = async () => {

    if (loading) return;

    try {

      setLoading(true);

      console.log("[UI] ========================================");
      console.log("[UI] Starting attendance marking process...");
      console.log("[UI] ========================================");

      // STEP 1: Check location permission
      console.log("[UI] STEP 1: Checking location permission...");

      try {
        await checkLocationPermission();
        console.log("[UI] ✅ Location permission OK");
      } catch (err) {
        throw new Error(`Location Permission: ${err.message}`);
      }

      // STEP 2: Get user location
      console.log("[UI] STEP 2: Getting user location...");

      let location;
      try {
        location = await getUserLocation();
        console.log("[UI] ✅ Location obtained:", location);
      } catch (err) {
        throw new Error(`Location Access: ${err.message}`);
      }

      // STEP 3: Validate location (office radius check)
      console.log("[UI] STEP 3: Validating location against office radius...");

      let distance;
      try {
        const validation = await validateLocation(location);
        distance = validation.distance;
        console.log("[UI] ✅ Location validated. Distance:", distance, "meters");
      } catch (err) {
        throw err; // Already has good error message
      }

      // STEP 4: Biometric authentication
      console.log("[UI] STEP 4: Requesting biometric authentication...");

      try {
        await authenticateBiometric();
        console.log("[UI] ✅ Biometric authentication successful");
      } catch (err) {
        throw new Error(`Biometric Authentication: ${err.message}`);
      }

      // STEP 5: Save attendance
      console.log("[UI] STEP 5: Saving attendance to database...");

      try {
        await saveAttendance(location, distance);
        console.log("[UI] ✅ Attendance saved successfully");
      } catch (err) {
        throw new Error(`Save Failed: ${err.message}`);
      }

      console.log("[UI] ========================================");
      console.log("[UI] ✅ ATTENDANCE MARKED SUCCESSFULLY");
      console.log("[UI] ========================================");

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

  return (
    <div className="space-y-6">

      {/* MARK ATTENDANCE BOX */}
      <div className="bg-white border rounded-xl shadow-sm p-6">

        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-800">
            Mark Today's Attendance
          </h1>
          <p className="text-sm text-slate-500">
            {checkingRegistration
              ? "Checking fingerprint registration status..."
              : isRegistered
                ? "Use fingerprint authentication to mark your attendance"
                : "Register your fingerprint first to enable attendance marking"
            }
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isRegistered ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
              }`}>
              <FaFingerprint className="text-3xl" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {checkingRegistration
                  ? "Loading..."
                  : isRegistered
                    ? "Fingerprint Registered"
                    : "Fingerprint Not Registered"
                }
              </h3>
              <p className="text-sm text-slate-500">
                {checkingRegistration
                  ? "Please wait..."
                  : isRegistered
                    ? "Click to mark your attendance"
                    : "Click to register your fingerprint"
                }
              </p>
            </div>
          </div>

          {checkingRegistration ? (
            <button
              disabled
              className="bg-gray-400 text-white font-medium px-7 py-3 rounded-lg w-full md:w-auto cursor-not-allowed"
            >
              Loading...
            </button>
          ) : isRegistered ? (
            <button
              onClick={handleMarkPresent}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-7 py-3 rounded-lg transition w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Mark Attendance"}
            </button>
          ) : (
            <button
              onClick={handleRegisterFingerprint}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3 rounded-lg transition w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Fingerprint"}
            </button>
          )}

        </div>
      </div>

      {/* ATTENDANCE HISTORY */}
      <div className="bg-white border rounded-xl shadow-sm">

        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Attendance History
          </h3>
          <p className="text-sm text-slate-500">
            View your complete attendance records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

            <thead>
              <tr className="bg-gray-50 text-left text-slate-600">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">Distance (m)</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>

              {attendanceData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}

              {attendanceData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">

                  <td className="px-6 py-3 font-medium text-slate-800">
                    {row.date}
                  </td>

                  <td className="px-6 py-3">
                    {row.location?.lat?.toFixed(4)}, {row.location?.lng?.toFixed(4)}
                  </td>

                  <td className="px-6 py-3">
                    {row.distanceFromOffice || "--"}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}
