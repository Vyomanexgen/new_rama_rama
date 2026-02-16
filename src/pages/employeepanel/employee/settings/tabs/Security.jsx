import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../../../firebase";

export default function Security() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Success
      setSuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Password change error:", err);

      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Current password is incorrect");
      } else if (err.code === "auth/weak-password") {
        setError("New password is too weak");
      } else if (err.code === "auth/requires-recent-login") {
        setError("Please logout and login again before changing password");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="mt-6 space-y-6">

          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Password
            </label>
            <div className="relative mt-2">
              <FaLock className="absolute left-3 top-3 mt-1 text-slate-400" />
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-xl text-slate-700 placeholder-slate-400 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-slate-500 text-lg"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>
            <div className="relative mt-2">
              <FaLock className="absolute left-3 top-3 mt-1 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-xl text-slate-700 placeholder-slate-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-slate-500 text-lg"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <FaLock className="absolute left-3 top-3 mt-1 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-xl text-slate-700 placeholder-slate-400 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-slate-500 text-lg"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Change Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium 
                       hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* TWO FACTOR AUTH CARD */}
      <div className="bg-white border shadow-sm rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Two-Factor Authentication
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Enable Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-500">
              Add an extra layer of security to your account
            </p>
          </div>

          {/* iOS style switch */}
          <div
            onClick={() => setTwoFA(!twoFA)}
            className={`w-12 h-6 flex items-center rounded-full cursor-pointer p-1 transition 
            ${twoFA ? "bg-indigo-600" : "bg-gray-300"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition 
              ${twoFA ? "translate-x-6" : "translate-x-0"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
