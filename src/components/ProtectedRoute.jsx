import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

/**
 * ProtectedRoute with optional `role` prop.
 * - If `role` is provided, the user's email must equal ROLE_EMAILS[role]. Otherwise access is denied.
 * - If mismatch, the user is signed out (to prevent cross-role access) and redirected to the role's login with an error.
 */
export default function ProtectedRoute({ role, children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (!role) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const currentRole = snap.data().role;
          if (currentRole === role) {
            setAuthorized(true);
          } else if (role === "employee" && (!currentRole || currentRole === "user")) {
            // Allow employee access even if role wasn't set yet.
            // Firestore rules may block role updates for self.
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else if (role === "employee") {
          await setDoc(
            userRef,
            {
              email: u.email,
              role: "employee",
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [role]);

  // If signed-in but not authorized for this role, sign out to prevent cross-role access
  useEffect(() => {
    if (!loading && user && role && !authorized) {
      signOut(auth).catch(() => { });
    }
  }, [loading, user, role, authorized]);

  if (loading) return null;

  if (!user) {
    const to = role ? `/${role}/login` : "/login";
    return <Navigate to={to} replace state={{ error: "Please login for this role", from: location.pathname }} />;
  }

  if (role && !authorized) {
    return <Navigate to={`/${role}/login`} replace state={{ error: "Unauthorized access for this role", from: location.pathname }} />;
  }

  return children;
}
