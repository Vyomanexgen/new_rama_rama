import { auth } from "./firebase";
import { db } from "./firebase";
import { doc, setDoc, Timestamp, collection, addDoc, getDocs, limit, query, where, getDoc } from "firebase/firestore";
const DEBUG = import.meta.env.VITE_DEBUG_LOGS === "true";
const log = (...args) => {
  if (DEBUG) console.log(...args);
};

/* =========================
   🏢 OFFICE LOCATION SETUP
========================= */

// CHANGE these to your office GPS coordinates
const OFFICE_LAT = 13.082680;    // Example: Chennai
const OFFICE_LNG = 80.270718;
const ALLOWED_RADIUS = 15000;     // meters

/* =========================
   DISTANCE CALCULATOR
========================= */

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {

  const R = 6371000; // Earth radius (meters)

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/* =========================
   CHECK LOCATION PERMISSION
========================= */

export const checkLocationPermission = async () => {

  try {

    if (!navigator.geolocation) {
      throw new Error("Location services not supported on this device");
    }

    // Check if permission is already granted
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

      if (permissionStatus.state === 'denied') {
        throw new Error("Location permission denied. Please enable location access in your browser settings.");
      }
    }

    return true;

  } catch (err) {
    console.error("[LOCATION] Permission check error:", err);
    throw err;
  }
};

/* =========================
   GET USER LOCATION
========================= */

export const getUserLocation = async (options = {}) => {

  try {

    if (!navigator.geolocation) {
      throw new Error("Location services not supported on this device");
    }

    log("[LOCATION] Requesting user location...");

    const location = await new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          log("[LOCATION] ✅ Location obtained:", pos.coords.latitude, pos.coords.longitude);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {

          console.error("[LOCATION] Error getting location:", err);

          if (err.code === 1) {
            reject(new Error("Location permission denied. Please allow location access to mark attendance."));
          } else if (err.code === 2) {
            reject(new Error("Location unavailable. Please check your device settings."));
          } else if (err.code === 3) {
            reject(new Error("Location request timed out. Please try again."));
          } else {
            reject(new Error("Failed to get location. Please try again."));
          }
        },
        {
          enableHighAccuracy: options.enableHighAccuracy !== false,
          timeout: options.timeout || 10000,
          maximumAge: options.maximumAge ?? 0
        }
      );
    });

    return location;

  } catch (err) {
    console.error("[LOCATION] Get location error:", err);
    throw err;
  }
};

/* =========================
   VALIDATE LOCATION
========================= */

export const validateLocation = async (location, assignedLocation) => {

  try {

    const assigned = assignedLocation || {};
    const targetLat = Number(assigned.lat ?? assigned.latitude ?? OFFICE_LAT);
    const targetLng = Number(assigned.lng ?? assigned.longitude ?? OFFICE_LNG);
    const radius = Number(assigned.radiusMeters ?? assigned.radius ?? ALLOWED_RADIUS) || ALLOWED_RADIUS;
    const locationName = assigned.name || assigned.label || assigned.address || "assigned location";

    if (Number.isNaN(targetLat) || Number.isNaN(targetLng)) {
      throw new Error("Assigned location coordinates are invalid. Please contact your manager.");
    }

    const distance = getDistanceInMeters(
      location.lat,
      location.lng,
      targetLat,
      targetLng
    );

    log(`[LOCATION] Distance from office: ${Math.round(distance)} meters`);

    if (distance > radius) {
      throw new Error(
        `You are ${Math.round(distance)}m away from ${locationName}. Must be within ${radius}m to mark attendance.`
      );
    }

    return {
      valid: true,
      distance: Math.round(distance)
    };

  } catch (err) {
    console.error("[LOCATION] Validation error:", err);
    throw err;
  }
};

const resolveEmployeeId = async (uid) => {
  try {
    const direct = await getDoc(doc(db, "employees", uid));
    if (direct.exists()) return direct.id;
    const ref = collection(db, "employees");
    let snap = await getDocs(query(ref, where("firebaseUid", "==", uid), limit(1)));
    if (snap.empty) {
      snap = await getDocs(query(ref, where("uid", "==", uid), limit(1)));
    }
    if (snap.empty) return null;
    return snap.docs[0].id;
  } catch (err) {
    console.error("[ATTENDANCE] Failed to resolve employeeId", err);
    return null;
  }
};

/* =========================
   SAVE ATTENDANCE
========================= */

export const saveAttendance = async (location, distance) => {

  try {

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    const today = new Date().toISOString().split("T")[0];

    const attendanceRef = doc(
      db,
      "attendance",
      `${user.uid}_${today}`
    );

    log("[ATTENDANCE] Saving attendance to Firestore...");
    log("[ATTENDANCE] User UID:", user.uid);
    log("[ATTENDANCE] Document ID:", `${user.uid}_${today}`);
    log("[ATTENDANCE] Date:", today);
    log("[ATTENDANCE] Location:", location);
    log("[ATTENDANCE] Distance:", distance);

    const employeeId = await resolveEmployeeId(user.uid);

    const attendanceData = {
      uid: user.uid,
      employeeId: employeeId || user.uid,
      date: today,
      status: "Present",
      location,
      distanceFromOffice: distance,
      time: Timestamp.now()  // Use Firestore Timestamp instead of JavaScript Date
    };

    log("[ATTENDANCE] Data to save:", attendanceData);

    await setDoc(attendanceRef, attendanceData, { merge: true });

    if (employeeId) {
      await addDoc(collection(db, "locationLogs"), {
        employeeId,
        uid: user.uid,
        lat: location.lat,
        lng: location.lng,
        timestamp: Timestamp.now(),
        source: "employee"
      });
    }

    log("[ATTENDANCE] ✅ Attendance saved successfully");
    log("[ATTENDANCE] Document path: attendance/${user.uid}_${today}");

    return true;

  } catch (err) {
    console.error("[ATTENDANCE] Save error:", err);
    console.error("[ATTENDANCE] Error code:", err.code);
    console.error("[ATTENDANCE] Error message:", err.message);
    throw new Error(`Failed to save attendance: ${err.message}`);
  }
};

/* =========================
   MARK ATTENDANCE (LEGACY - DEPRECATED)
   Use the separate functions above for better control
========================= */

export const markAttendance = async () => {

  try {

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    // Step 1: Check location permission
    await checkLocationPermission();

    // Step 2: Get location
    const location = await getUserLocation();

    // Step 3: Validate location
    const { distance } = await validateLocation(location);

    // Step 4: Save attendance
    await saveAttendance(location, distance);

    return true;

  } catch (error) {
    console.error("[ATTENDANCE] Error:", error);
    throw error;
  }
};


/* =========================
   LIVE LOCATION TRACKING
========================= */

export const startLiveLocationTracking = async (options = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const employeeId = await resolveEmployeeId(user.uid);
  if (!employeeId) throw new Error("Employee record not found");

  const minIntervalMs = options.minIntervalMs || 15000;
  const minDistanceMeters = options.minDistanceMeters || 10;

  let lastSentAt = 0;
  let lastLat = null;
  let lastLng = null;

  const sendLocation = async (lat, lng) => {
    const now = Date.now();
    if (now - lastSentAt < minIntervalMs) return;
    if (lastLat != null && lastLng != null) {
      const dist = getDistanceInMeters(lastLat, lastLng, lat, lng);
      if (dist < minDistanceMeters) return;
    }

    await addDoc(collection(db, "locationLogs"), {
      employeeId,
      uid: user.uid,
      lat,
      lng,
      timestamp: Timestamp.now(),
      source: "live"
    });

    lastSentAt = now;
    lastLat = lat;
    lastLng = lng;
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location services not supported on this device"));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await sendLocation(pos.coords.latitude, pos.coords.longitude);
        } catch (err) {
          console.error("[LOCATION] Live tracking error:", err);
        }
      },
      (err) => {
        reject(new Error(err.message || "Failed to start live tracking"));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );

    resolve(() => navigator.geolocation.clearWatch(watchId));
  });
};
