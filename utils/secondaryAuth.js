import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../firebase";

// Secondary Firebase App/Auth used for creating users without affecting the main session.
export function getSecondaryAuth() {
  const name = "secondary";
  const existing = getApps().find((a) => a.name === name);
  const app = existing || initializeApp(firebaseConfig, name);
  return getAuth(app);
}

