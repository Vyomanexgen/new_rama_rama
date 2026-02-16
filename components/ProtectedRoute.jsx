import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { API_BASE_URL } from "../services/apiBase";
import { ROLE_EMAILS } from "../config/roles";

const normalizeRole = (value) => {
  const role = String(value || "").toLowerCase().trim();
  if (["superadmin", "admin", "manager", "employee"].includes(role)) return role;
  if (role === "user") return "employee";
  return null;
};

const roleFromStaticEmail = (emailValue) => {
  const normalized = String(emailValue || "").trim().toLowerCase();
  if (!normalized) return null;

  const entry = Object.entries(ROLE_EMAILS).find(([, allowedEmail]) => {
    return String(allowedEmail || "").trim().toLowerCase() === normalized;
  });

  return entry ? normalizeRole(entry[0]) : null;
};

const resolveRoleByEmail = async (emailValue) => {
  const normalized = String(emailValue || "").trim().toLowerCase();
  if (!normalized) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/employee/resolve-role?email=${encodeURIComponent(normalized)}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    return normalizeRole(data?.role);
  } catch {
    return null;
  }
};

export default function ProtectedRoute({ role, children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [actualRole, setActualRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setAuthorized(false);
        setActualRole(null);
        setLoading(false);
        return;
      }

      if (!role) {
        setAuthorized(true);
        setActualRole(null);
        setLoading(false);
        return;
      }

      try {
        let detectedRole = null;
        let status = null;
        const userRef = doc(db, "users", u.uid);

        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            detectedRole = normalizeRole(snap.data().role);
            status = String(snap.data().status || "active").toLowerCase();
          }
        } catch {
          // Ignore read failures and continue with fallbacks.
        }

        if (!detectedRole) {
          detectedRole =
            (await resolveRoleByEmail(u.email)) ||
            roleFromStaticEmail(u.email) ||
            null;
        }

        if (!detectedRole && role === "employee") {
          detectedRole = "employee";
          try {
            await setDoc(
              userRef,
              {
                email: u.email,
                role: "employee",
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch {
            // Ignore write failures for self profile bootstrap.
          }
        }

        if (detectedRole) {
          setActualRole(detectedRole);
          // If account is deactivated, treat as unauthorized.
          if (status && status !== "active") {
            setAuthorized(false);
          } else {
            setAuthorized(detectedRole === role);
          }
        } else {
          setActualRole(null);
          setAuthorized(false);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [role]);

  useEffect(() => {
    if (!loading && user && role && !authorized && !actualRole) {
      signOut(auth).catch(() => {});
    }
  }, [loading, user, role, authorized, actualRole]);

  if (loading) return null;

  if (!user) {
    const to = role ? `/${role}/login` : "/login";
    return (
      <Navigate
        to={to}
        replace
        state={{ error: "Please login for this role", from: location.pathname }}
      />
    );
  }

  if (role && !authorized) {
    if (actualRole) {
      return <Navigate to={`/${actualRole}`} replace />;
    }

    return (
      <Navigate
        to={`/${role}/login`}
        replace
        state={{ error: "Unauthorized access for this role", from: location.pathname }}
      />
    );
  }

  return children;
}
