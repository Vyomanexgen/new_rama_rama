import { auth } from "./firebase";
import { db } from "./firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

/* =========================
   🏢 OFFICE LOCATION SETUP
========================= */

// CHANGE these to your office GPS coordinates
const OFFICE_LAT = 13.082680;    // Example: Chennai
const OFFICE_LNG = 80.270718;
const ALLOWED_RADIUS = 150;     // meters

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

export const getUserLocation = async () => {

  try {

    if (!navigator.geolocation) {
      throw new Error("Location services not supported on this device");
    }

    console.log("[LOCATION] Requesting user location...");

    const location = await new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("[LOCATION] ✅ Location obtained:", pos.coords.latitude, pos.coords.longitude);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
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
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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

export const validateLocation = async (location) => {

  try {

    const distance = getDistanceInMeters(
      location.lat,
      location.lng,
      OFFICE_LAT,
      OFFICE_LNG
    );

    console.log(`[LOCATION] Distance from office: ${Math.round(distance)} meters`);

    if (distance > ALLOWED_RADIUS) {
      throw new Error(
        `You are ${Math.round(distance)}m away from office. Must be within ${ALLOWED_RADIUS}m to mark attendance.`
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

    console.log("[ATTENDANCE] Saving attendance to Firestore...");
    console.log("[ATTENDANCE] User UID:", user.uid);
    console.log("[ATTENDANCE] Document ID:", `${user.uid}_${today}`);
    console.log("[ATTENDANCE] Date:", today);
    console.log("[ATTENDANCE] Location:", location);
    console.log("[ATTENDANCE] Distance:", distance);

    const attendanceData = {
      uid: user.uid,
      date: today,
      status: "present",
      location,
      distanceFromOffice: distance,
      time: Timestamp.now()  // Use Firestore Timestamp instead of JavaScript Date
    };

    console.log("[ATTENDANCE] Data to save:", attendanceData);

    await setDoc(attendanceRef, attendanceData, { merge: true });

    console.log("[ATTENDANCE] ✅ Attendance saved successfully");
    console.log("[ATTENDANCE] Document path: attendance/${user.uid}_${today}");

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

