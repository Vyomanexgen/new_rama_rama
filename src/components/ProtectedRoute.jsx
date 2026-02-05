import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ROLE_EMAILS } from "../config/roles";

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
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      if (!u) {
        setAuthorized(false);
        return;
      }

      if (role) {
        const allowed = ROLE_EMAILS[role];
        setAuthorized(u.email === allowed);
      } else {
        setAuthorized(true);
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
