import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ROLE_EMAILS } from "../config/roles";
import { doc, setDoc } from "firebase/firestore";

// Reused Login component for general login and role-specific logins.
// If `role` prop is passed via route (App.jsx), the component enforces a strict email check
// Example: <Route path="/admin" element={<Login role="admin" />} />
export default function Login({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show errors forwarded from ProtectedRoute (e.g., unauthorized attempts)
  useEffect(() => {
    if (location.state?.error) setError(location.state.error);
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const entered = email.trim().toLowerCase();

    // If this Login instance is for a role, enforce the exact allowed email
    if (role && role !== "employee") {
      const allowed = ROLE_EMAILS[role];
      if (!allowed) {
        setError("Internal error: unknown role");
        setLoading(false);
        return;
      }
      if (entered !== allowed) {
        setError("Unauthorized email for this role");
        setLoading(false);
        return; // do not attempt Firebase login
      }
    }

    try {
      const res = await signInWithEmailAndPassword(auth, entered, password);

      // Ensure user document exists/updated in Firestore
      try {
        const payload = role === "employee"
          ? { lastLogin: new Date() }
          : {
              email: res.user.email,
              ...(role ? { role } : {}),
              lastLogin: new Date(),
            };
        await setDoc(doc(db, "users", res.user.uid), payload, { merge: true });
      } catch (e) {
        console.error("Failed to write user document:", e);
      }

      // Redirect after successful login
      if (role) navigate(`/${role}/dashboard`, { replace: true });
      else navigate("/home", { replace: true });
    } catch (err) {
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

  const allowedEmail = role && role !== "employee" ? ROLE_EMAILS[role] : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=1600&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="w-full max-w-md z-20 bg-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white">{role ? `${role[0].toUpperCase()}${role.slice(1)} Login` : "Login"}</h2>

        {allowedEmail && role !== "manager" && (
          <p className="text-sm text-gray-200 text-center mt-2">Only use: <strong>{allowedEmail}</strong></p>
        )}

        {error && <div className="mt-4 p-3 bg-red-500/20 text-white rounded-lg text-sm">{error}</div>}

        <form className="space-y-5 mt-6" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-200">Email</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaEnvelope className="mr-2 text-gray-600" />
              <input type="email" className="w-full bg-transparent outline-none text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-200">Password</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaLock className="mr-2 text-gray-600" />
              <input type={showPassword ? "text" : "password"} className="w-full bg-transparent outline-none text-black" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="ml-2 cursor-pointer text-sm text-blue-700" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <p className="text-right text-sm text-blue-400 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</p>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          New user?
          <span className="text-blue-400 cursor-pointer ml-1 hover:underline" onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
