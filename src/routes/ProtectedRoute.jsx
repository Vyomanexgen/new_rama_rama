import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const SUPER_ADMIN_EMAIL = "superadmin@gmail.com";
const ADMIN_EMAIL = "admin@gmail.com";

export default function ProtectedRoute({ role, children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // SUPER ADMIN
      if (role === "superadmin") {
        setAllowed(user.email === SUPER_ADMIN_EMAIL);
        setLoading(false);
        return;
      }

      // ADMIN
      if (role === "admin") {
        setAllowed(
          user.email === ADMIN_EMAIL || user.email === SUPER_ADMIN_EMAIL,
        );
        setLoading(false);
        return;
      }

      // MANAGER / EMPLOYEE
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists() && snap.data().role === role) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [role]);

  if (loading) return <p>Loading...</p>;

  if (!allowed) return <Navigate to="/login" />;

  return children;
}
