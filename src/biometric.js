import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { auth } from "./firebase";


const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5050/api/biometric'
  : `http://${window.location.hostname}:5050/api/biometric`;

console.log('[BIOMETRIC] Backend URL:', BACKEND_URL);


export const checkBiometricRegistration = async () => {

  try {

    const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("[BIOMETRIC] No user logged in");
      return false;
    }

    const res = await fetch(`${BACKEND_URL}/check-registration/${uid}`);

    if (!res.ok) {
      console.error("[BIOMETRIC] Failed to check registration status");
      return false;
    }

    const data = await res.json();

    return data.registered === true;

  } catch (err) {
    console.error("[BIOMETRIC] Error checking registration:", err);
    return false;
  }
};

/* ======================
   REGISTER BIOMETRIC
====================== */

export const registerBiometric = async () => {

  try {

    const uid = auth.currentUser?.uid;

    if (!uid) {
      throw new Error("User not logged in");
    }

    console.log("[BIOMETRIC] Starting registration for UID:", uid);

    // Step 1: Get registration options
    const optionsRes = await fetch(`${BACKEND_URL}/register-options/${uid}`);

    if (!optionsRes.ok) {
      const error = await optionsRes.json();
      throw new Error(error.error || "Failed to get registration options");
    }

    const options = await optionsRes.json();

    console.log("[BIOMETRIC] Received registration options:", options);

    // Validate options
    if (!options || !options.challenge) {
      console.error("[BIOMETRIC] Invalid options received:", options);
      throw new Error("Invalid registration options received from server");
    }

    console.log("[BIOMETRIC] Options validated. Challenge present:", !!options.challenge);

    // Step 2: Start browser biometric registration
    console.log("[BIOMETRIC] Calling startRegistration...");
    const registrationResp = await startRegistration(options);

    console.log("[BIOMETRIC] Registration response received:", registrationResp);

    // Step 3: Verify registration with backend
    const verifyRes = await fetch(
      `${BACKEND_URL}/verify-register/${uid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationResp)
      }
    );

    const result = await verifyRes.json();

    if (result.success !== true) {
      throw new Error(result.error || "Registration verification failed");
    }

    console.log("[BIOMETRIC] ✅ Registration successful");

    return true;

  } catch (err) {
    console.error("[BIOMETRIC] Registration Error:", err);
    console.error("[BIOMETRIC] Error name:", err.name);
    console.error("[BIOMETRIC] Error message:", err.message);
    console.error("[BIOMETRIC] Error stack:", err.stack);

    // User-friendly error messages
    if (err.name === "NotAllowedError") {
      throw new Error("Fingerprint registration cancelled or not allowed");
    } else if (err.name === "NotSupportedError") {
      throw new Error("Biometric authentication not supported on this device");
    } else if (err.message.includes("network") || err.message.includes("fetch")) {
      throw new Error("Backend service unavailable. Please ensure server is running.");
    } else {
      throw new Error(err.message || "Fingerprint registration failed");
    }
  }
};

/* ======================
   AUTHENTICATE BIOMETRIC
====================== */

export const authenticateBiometric = async () => {

  try {

    const uid = auth.currentUser?.uid;

    if (!uid) {
      throw new Error("User not logged in");
    }

    console.log("[BIOMETRIC] Starting authentication for UID:", uid);

    // Step 1: Get authentication options
    const res = await fetch(`${BACKEND_URL}/auth-options/${uid}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to get authentication options");
    }

    const options = await res.json();

    // Step 2: Start browser biometric authentication
    const authResp = await startAuthentication(options);

    // Step 3: Verify authentication with backend
    const verifyRes = await fetch(
      `${BACKEND_URL}/verify-auth/${uid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResp)
      }
    );

    const result = await verifyRes.json();

    if (result.success !== true) {
      throw new Error(result.error || "Authentication failed");
    }

    console.log("[BIOMETRIC] ✅ Authentication successful");

    return true;

  } catch (err) {
    console.error("[BIOMETRIC] Authentication Error:", err);

    // User-friendly error messages
    if (err.name === "NotAllowedError") {
      throw new Error("Fingerprint authentication cancelled or not allowed");
    } else if (err.name === "NotSupportedError") {
      throw new Error("Biometric authentication not supported on this device");
    } else if (err.message.includes("not registered")) {
      throw new Error("Fingerprint not registered. Please register first.");
    } else if (err.message.includes("registration lost")) {
      throw new Error("Fingerprint registration lost. Please register again.");
    } else if (err.message.includes("network") || err.message.includes("fetch")) {
      throw new Error("Backend service unavailable. Please ensure server is running.");
    } else {
      throw new Error(err.message || "Fingerprint authentication failed");
    }
  }
};

