import React, { useEffect, useState } from "react";
import { FaTimes, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhoneAlt, FaBell, FaFileAlt } from "react-icons/fa";
import { managerApi } from "../../../../api/managerApi";
import { auth } from "../../../../firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const defaultProfile = {
  name: "Manager",
  phone: "",
  email: "",
  department: "",
  managerId: "",
  role: "Manager",
};

const defaultSecurity = {
  twoFA: false,
};

const defaultPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  weeklyReports: true,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(defaultProfile);
  const [security, setSecurity] = useState(defaultSecurity);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");

  const tabs = [
    { key: "personal", label: "Personal Information" },
    { key: "security", label: "Security" },
    { key: "preferences", label: "Preferences" },
  ];

  const getInitials = (value) => {
    if (!value) return "M";
    const parts = value.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await managerApi.getSettings();
        const serverProfile = res.data?.settings?.profile || res.data?.profile || {};
        const serverSecurity = res.data?.settings?.security || {};
        const serverPreferences = res.data?.settings?.preferences || {};
        setProfile((prev) => ({ ...prev, ...serverProfile }));
        setSecurity((prev) => ({ ...prev, ...serverSecurity }));
        setPreferences((prev) => ({ ...prev, ...serverPreferences }));
      } catch (e) {
        console.error("MANAGER SETTINGS LOAD ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveAll = async () => {
    try {
      setSaving(true);
      setMessage("");
      await managerApi.updateSettings({
        settings: {
          profile,
          security,
          preferences,
        },
      });
      setMessage("Settings saved");
      setTimeout(() => setMessage(""), 2500);
    } catch (e) {
      console.error("MANAGER SETTINGS SAVE ERROR:", e);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setSecurityError("New password must be different from current password");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setSecurityError("No user logged in");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSecuritySuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecuritySuccess(""), 5000);
    } catch (err) {
      console.error("Password change error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setSecurityError("Current password is incorrect");
      } else if (err.code === "auth/weak-password") {
        setSecurityError("New password is too weak");
      } else if (err.code === "auth/requires-recent-login") {
        setSecurityError("Please logout and login again before changing password");
      } else {
        setSecurityError("Failed to change password. Please try again.");
      }
    }
  };

  return (
    <>
      <style>{`
        @keyframes elasticBounce {
          0% { transform: scaleX(0); }
          60% { transform: scaleX(1.15); }
          80% { transform: scaleX(0.95); }
          100% { transform: scaleX(1); }
        }
        .animate-elastic { animation: elasticBounce 0.35s ease-out forwards; }
      `}</style>

      <div className="w-full mx-auto space-y-10">
        <div className="bg-white border shadow-md rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Profile Settings</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 border-b flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-700 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
                {getInitials(profile.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white shadow rounded-full p-1">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                  📷
                </div>
              </div>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-semibold text-slate-800">
                {loading ? "Loading..." : profile.name}
              </div>
              <p className="text-sm text-slate-500">{profile.role || "Manager"}</p>
              {profile.managerId ? (
                <p className="text-xs text-slate-400 mt-1">{profile.managerId}</p>
              ) : null}
            </div>
          </div>

          <div className="px-6 border-b">
            <div className="flex gap-6 mt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-3 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}

                  {activeTab === tab.key && (
                    <span className="absolute left-0 bottom-0 w-full h-[3px] bg-indigo-600 rounded-full animate-elastic origin-left"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {message && (
              <div className={`mb-4 text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
                {message}
              </div>
            )}

            {activeTab === "personal" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      type="tel"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Department</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Manager ID</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.managerId}
                      onChange={(e) => setProfile({ ...profile, managerId: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveAll}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>

                  {securityError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {securityError}
                    </div>
                  )}

                  {securitySuccess && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                      {securitySuccess}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="mt-6 space-y-6">
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
                          className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 
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
                          className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400
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
                          className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 
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

                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium 
                       hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
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

                    <div
                      onClick={() => setSecurity({ ...security, twoFA: !security.twoFA })}
                      className={`w-12 h-6 flex items-center rounded-full cursor-pointer p-1 transition 
                      ${security.twoFA ? "bg-indigo-600" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition 
                        ${security.twoFA ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveAll}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
                  >
                    {saving ? "Saving..." : "Save Security"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
                <div className="space-y-12">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Notification Preferences
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <FaEnvelope className="text-slate-500 text-lg mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            Email Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            Receive updates via email
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                          preferences.emailNotifications ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                            preferences.emailNotifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <FaPhoneAlt className="text-slate-500 text-lg mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            SMS Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            Receive updates via SMS
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                          preferences.smsNotifications ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                            preferences.smsNotifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <FaBell className="text-slate-500 text-lg mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            Push Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            Receive push notifications
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                          preferences.pushNotifications ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                            preferences.pushNotifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Report Preferences
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <FaFileAlt className="text-slate-500 text-lg mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            Weekly Reports
                          </p>
                          <p className="text-xs text-slate-500">
                            Receive weekly activity summary
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setPreferences({ ...preferences, weeklyReports: !preferences.weeklyReports })
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                          preferences.weeklyReports ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                            preferences.weeklyReports ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveAll}
                  disabled={saving}
                  className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
