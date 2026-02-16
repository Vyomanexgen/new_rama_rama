import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { API_BASE_URL } from "../services/apiBase";
import { ROLE_EMAILS } from "../config/roles";
import { writeActivityLog } from "../utils/activityLog";

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

export default function Login({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.error) setError(location.state.error);
  }, [location]);

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

  const roleFromUsersDoc = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return normalizeRole(snap.data()?.role);
    } catch {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const entered = email.trim().toLowerCase();

    try {
      const res = await signInWithEmailAndPassword(auth, entered, password);

      const resolvedRole =
        (await resolveRoleByEmail(entered)) ||
        (await resolveRoleByEmail(res.user?.email)) ||
        (await roleFromUsersDoc(res.user.uid)) ||
        roleFromStaticEmail(entered) ||
        roleFromStaticEmail(res.user?.email) ||
        null;

      if (!resolvedRole) {
        setError("Role mapping not found for this email");
        setLoading(false);
        return;
      }

      try {
        await setDoc(
          doc(db, "users", res.user.uid),
          {
            email: res.user.email,
            role: resolvedRole,
            lastLogin: new Date(),
          },
          { merge: true }
        );
      } catch (writeErr) {
        console.error("Failed to write user document:", writeErr);
      }

      await writeActivityLog({
        scope: resolvedRole,
        action: "auth.login",
        meta: { uid: res.user.uid, email: res.user.email || entered },
      });

      // Land on the panel base route so sidebars that use `/role` as the
      // Dashboard link highlight correctly on first paint.
      navigate(`/${resolvedRole}`, { replace: true });
    } catch {
      setError("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("📧 Enter your registered email first");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset link sent");
      setError("");
    } catch {
      setError("❌ Failed to send reset email");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="w-full max-w-md z-20 bg-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white">
          {role ? `${role[0].toUpperCase()}${role.slice(1)} Login` : "Login"}
        </h2>

        {error && <div className="mt-4 p-3 bg-red-500/20 text-white rounded-lg text-sm">{error}</div>}

        <form className="space-y-5 mt-6" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-200">Email</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaEnvelope className="mr-2 text-gray-600" />
              <input
                type="email"
                className="w-full bg-transparent outline-none text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-200">Password</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaLock className="mr-2 text-gray-600" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent outline-none text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="ml-2 cursor-pointer text-sm text-blue-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <p className="text-right text-sm text-blue-400 cursor-pointer" onClick={handleForgotPassword}>
            Forgot Password?
          </p>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          New user?
          <span className="text-blue-400 cursor-pointer ml-1 hover:underline" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
