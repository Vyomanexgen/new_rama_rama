import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { API_BASE_URL } from "../services/apiBase";

let hasRun = false;

export function runManagerDashboardPing() {
  if (hasRun) return;
  hasRun = true;

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    unsubscribe();

    if (!user) {
      console.warn("[dev] No authenticated user");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/manager/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("[dev] Manager dashboard response", {
        status: response.status,
        data,
      });
    } catch (error) {
      console.error("[dev] Manager dashboard ping failed", error);
    }
  });
}
