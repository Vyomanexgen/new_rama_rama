import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setAllowed(snap.data().role === role);
      } else if (role === "employee") {
        try {
          await setDoc(
            userRef,
            {
              email: user.email,
              role: "employee",
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          setAllowed(true);
        } catch {
          setAllowed(false);
        }
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
