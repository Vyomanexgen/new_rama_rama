import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaBell, FaFileAlt } from "react-icons/fa";

export default function Preferences() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <div className="space-y-12">

      {/* Notification Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800">
          Notification Preferences
        </h3>

        <div className="mt-6 space-y-4">

          {/* Email Notifications */}
          <div className="flex items-center justify-between bg-slate-50 border rounded-2xl p-4">
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

            {/* iOS Toggle */}
            <div
              onClick={() => setEmailNotif(!emailNotif)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                emailNotif ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                  emailNotif ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between bg-slate-50 border rounded-2xl p-4">
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

            {/* iOS Toggle */}
            <div
              onClick={() => setSmsNotif(!smsNotif)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                smsNotif ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                  smsNotif ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between bg-slate-50 border rounded-2xl p-4">
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

            {/* iOS Toggle */}
            <div
              onClick={() => setPushNotif(!pushNotif)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                pushNotif ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                  pushNotif ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800">
          Report Preferences
        </h3>

        <div className="mt-6 space-y-4">

          {/* Weekly Reports */}
          <div className="flex items-center justify-between bg-slate-50 border rounded-2xl p-4">
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

            {/* iOS Toggle */}
            <div
              onClick={() => setWeeklyReport(!weeklyReport)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                weeklyReport ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                  weeklyReport ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </div>

        <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
