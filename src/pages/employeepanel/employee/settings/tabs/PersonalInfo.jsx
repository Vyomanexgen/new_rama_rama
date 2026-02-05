// src/pages/employee/settings/PersonalInfo.jsx
import React, { useState, useEffect } from "react";
import { FaUserAlt, FaEnvelope, FaPhone, FaIdBadge, FaBuilding } from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../../firebase";

export default function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    employeeId: ""
  });

  // Load user data from Firestore on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoadingData(false);
          return;
        }

        // Get user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            fullName: data.fullName || user.displayName || "",
            email: user.email || "",
            phone: data.phone || "",
            position: data.position || "",
            department: data.department || "",
            employeeId: data.employeeId || ""
          });
        } else {
          // If no Firestore doc exists, create one with default values
          const defaultData = {
            fullName: user.displayName || "",
            email: user.email || "",
            phone: "",
            position: "",
            department: "",
            employeeId: "",
            role: "employee",
            createdAt: new Date(),
            lastLogin: new Date()
          };

          // Create the document using setDoc
          await setDoc(userDocRef, defaultData);

          setFormData({
            fullName: defaultData.fullName,
            email: defaultData.email,
            phone: defaultData.phone,
            position: defaultData.position,
            department: defaultData.department,
            employeeId: defaultData.employeeId
          });
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        // Don't show error, just use default values from auth
        const user = auth.currentUser;
        if (user) {
          setFormData({
            fullName: user.displayName || "",
            email: user.email || "",
            phone: "",
            position: "",
            department: "",
            employeeId: ""
          });
        }
      } finally {
        setLoadingData(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      // Update Firebase Auth displayName
      await updateProfile(user, {
        displayName: formData.fullName
      });

      // Update Firestore user document
      await updateDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        employeeId: formData.employeeId,
        updatedAt: new Date()
      });

      setSuccess("✅ Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Profile update error:", err);

      // Show specific error message for debugging
      let errorMessage = "Failed to update profile. Please try again.";

      if (err.code === "permission-denied") {
        errorMessage = "Permission denied. Please contact your administrator to update Firestore security rules.";
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Card body */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Full Name *</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaUserAlt className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Email Address *</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaEnvelope className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.email}
                disabled
                title="Email cannot be changed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Phone Number *</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaPhone className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Position</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaIdBadge className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Department</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaBuilding className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm text-slate-600 mb-2">Employee ID</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaIdBadge className="text-slate-400" />
              <input
                className="bg-transparent outline-none text-slate-800 text-sm w-full"
                value={formData.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
            >
              Edit Information
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
