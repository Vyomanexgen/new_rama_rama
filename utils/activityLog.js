import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function writeActivityLog({ scope, action, meta } = {}) {
  try {
    await addDoc(collection(db, "activityLogs"), {
      scope: String(scope || "").trim() || "system",
      action: String(action || "").trim() || "unknown",
      meta: meta || {},
      createdAt: serverTimestamp(),
    });
  } catch {
    // Ignore logging failures; app workflows should still succeed.
  }
}

