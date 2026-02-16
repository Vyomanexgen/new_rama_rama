import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { auth } from "./firebase";
const DEBUG = import.meta.env.VITE_DEBUG_LOGS === "true";
const log = (...args) => {
  if (DEBUG) console.log(...args);
};

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  `http://${window.location.hostname}:5050/api/biometric`;

if (import.meta.env.DEV) {
  console.log("[biometric] BACKEND_URL =", BACKEND_URL);
}


const ensureWebAuthnAvailable = () => {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn not supported on this device/browser.");
  }
  if (!window.isSecureContext) {
    throw new Error("WebAuthn requires a secure context. Use http://localhost:5173");
  }
};

/* ======================
   CHECK REGISTRATION
====================== */

export const checkBiometricRegistration = async () => {
  const uid = auth.currentUser?.uid;
  ensureWebAuthnAvailable();
  ensureWebAuthnAvailable();
  if (!uid) return false;

  const res = await fetch(`${BACKEND_URL}/check-registration/${uid}`);
  const data = await res.json();
  return data.registered === true;
};

/* ======================
   REGISTER BIOMETRIC
====================== */

export const registerBiometric = async () => {
  const uid = auth.currentUser?.uid;
  ensureWebAuthnAvailable();
  if (!uid) throw new Error("Not logged in");

  const optionsRes = await fetch(
    `${BACKEND_URL}/register-options/${uid}`
  );
  const options = await optionsRes.json();

  let attResp;
  try {
    attResp = await startRegistration(options);
  } catch (err) {
    if (err?.name === "NotAllowedError") {
      throw new Error("Biometric prompt was cancelled or blocked. Use localhost and allow the prompt.");
    }
    throw err;
  }

  const verifyRes = await fetch(
    `${BACKEND_URL}/verify-register/${uid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attResp),
    }
  );

  const result = await verifyRes.json();
  if (!result.success) throw new Error(result.error);

  return true;
};

/* ======================
   AUTHENTICATE BIOMETRIC
====================== */

export const authenticateBiometric = async () => {
  const uid = auth.currentUser?.uid;
  ensureWebAuthnAvailable();
  if (!uid) throw new Error("Not logged in");

  const optRes = await fetch(`${BACKEND_URL}/auth-options/${uid}`);
  const options = await optRes.json();

  let authResp;
  try {
    authResp = await startAuthentication(options);
  } catch (err) {
    if (err?.name === "NotAllowedError") {
      throw new Error("Biometric prompt was cancelled or blocked. Use localhost and allow the prompt.");
    }
    throw err;
  }

  const verifyRes = await fetch(
    `${BACKEND_URL}/verify-auth/${uid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authResp),
    }
  );

  const result = await verifyRes.json();
  if (!result.success) throw new Error(result.error);

  return true;
};
