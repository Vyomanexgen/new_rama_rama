import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ROLE_EMAILS } from "../config/roles";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Determine role by exact email match against ROLE_EMAILS
      const entered = email.trim().toLowerCase();
      let roleName = "user";
      for (const [r, allowed] of Object.entries(ROLE_EMAILS)) {
        if (allowed.toLowerCase() === entered) {
          roleName = r;
          break;
        }
      }

      // Write central users doc with assigned role
      await setDoc(
        doc(db, "users", res.user.uid),
        {
          email: email,
          role: roleName,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // If this is a role account (admin/employee/manager), also create role document
      if (roleName !== "user") {
        try {
          await setDoc(
            doc(db, roleName, res.user.uid),
            {
              uid: res.user.uid,
              email: res.user.email,
              role: roleName,
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (writeErr) {
          console.error("Failed to create role doc on signup:", writeErr);
        }
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=1600&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="w-full max-w-md z-20 bg-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white">Signup</h2>

        <form className="space-y-5 mt-6" onSubmit={handleSignup}>
          <div>
            <label className="text-sm text-gray-200">Email</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaEnvelope className="mr-2" />
              <input
                type="email"
                className="w-full bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-200">Password</label>
            <div className="flex items-center bg-white/80 rounded-lg px-3 py-3">
              <FaLock className="mr-2" />
              <input
                type="password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-xl">
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          Already have an account?
          <span
            className="text-blue-400 cursor-pointer ml-1"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
