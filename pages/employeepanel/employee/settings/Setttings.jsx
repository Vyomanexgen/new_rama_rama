
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import PersonalInfo from "./tabs/PersonalInfo";
import Security from "./tabs/Security";
import Preferences from "./tabs/preferences";
import { auth, db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState({
    name: "Employee",
    role: "Staff",
    employeeId: "",
    email: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  const tabs = [
    { key: "personal", label: "Personal Information" },
    { key: "security", label: "Security" },
    { key: "preferences", label: "Preferences" },
  ];

  const getInitials = (value) => {
    if (!value) return "E";
    const parts = value.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoadingProfile(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            name: data.fullName || user.displayName || "Employee",
            role: data.position || data.role || "Staff",
            employeeId: data.employeeId || "",
            email: user.email || "",
          });
        } else {
          setProfile({
            name: user.displayName || "Employee",
            role: "Staff",
            employeeId: "",
            email: user.email || "",
          });
        }
      } catch (e) {
        const user = auth.currentUser;
        setProfile({
          name: user?.displayName || "Employee",
          role: "Staff",
          employeeId: "",
          email: user?.email || "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <>
      {/* Elastic Animation */}
      <style>{`
        @keyframes elasticBounce {
          0% { transform: scaleX(0); }
          60% { transform: scaleX(1.15); }
          80% { transform: scaleX(0.95); }
          100% { transform: scaleX(1); }
        }
        .animate-elastic {
          animation: elasticBounce 0.35s ease-out forwards;
        }
      `}</style>

      {/* PAGE layout (exactly like MyAttendance, Announcement, Dashboard) */}
      {/* <div className="p-4 sm:p-6 lg:p-8"> */}
      <div className="w-full mx-auto space-y-10">

        {/* MAIN CARD */}
        <div className="bg-white border shadow-md rounded-2xl overflow-hidden">

          {/* Header */}
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

          {/* Profile Information */}
          <div className="px-6 py-6 border-b flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-700 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
                {getInitials(profile.name)}
              </div>

              {/* Camera button */}
              <div className="absolute -bottom-1 -right-1 bg-white shadow rounded-full p-1">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                  📷
                </div>
              </div>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-semibold text-slate-800">
                {loadingProfile ? "Loading..." : profile.name}
              </div>
              <p className="text-sm text-slate-500">{profile.role || "Staff"}</p>
              {profile.employeeId ? (
                <p className="text-xs text-slate-400 mt-1">{profile.employeeId}</p>
              ) : null}
            </div>
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "personal" && <PersonalInfo />}
            {activeTab === "security" && <Security />}
            {activeTab === "preferences" && <Preferences />}
          </div>

        </div>
      </div>
    </>
  );
}
