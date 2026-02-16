// import React from "react";
// export default function SettingsAdmin() {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-2">Settings</h2>
//       <p className="text-gray-500 mb-4">System settings & configuration for Admin.</p>
//       <div className="bg-white rounded-lg p-6 border shadow-sm">Admin settings placeholder.</div>
//     </div>
//   );
// }




import React, { useState } from "react";
import CompanyInfo from "./tabs/CompanyInfo";
import Branding from "./tabs/Branding";
import Notifications from "./tabs/Notifications";
import Security from "./tabs/Security";
import Integrations from "./tabs/Integrations";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    { key: "company", label: "Company Info" },
    { key: "branding", label: "Branding" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "integrations", label: "Integrations" },
  ];

  return (
    <>
      {/* Injecting Elastic Bounce Animation Here */}
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

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
            Settings
            <p className="text-xs sm:text-sm text-gray-400 mt-2 hidden sm:block">
              Manage company-wide settings and configurations
            </p>
          </h1>

          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-gray-200">

            {/* Tabs Section */}
            <div className="border-b px-4 sm:px-8 py-4">
              <div className="flex flex-wrap gap-3 sm:gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative pb-2 text-sm sm:text-base font-medium transition-all duration-300
                      ${activeTab === tab.key
                        ? "text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab.label}

                    {/* Elastic Bounce Underline */}
                    {activeTab === tab.key && (
                      <span
                        className="absolute left-0 bottom-0 w-full h-[3px] bg-indigo-600 rounded-full animate-elastic origin-left"
                      ></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-8">
              {activeTab === "company" && <CompanyInfo />}
              {activeTab === "branding" && <Branding />}
              {activeTab === "notifications" && <Notifications />}
              {activeTab === "security" && <Security />}
              {activeTab === "integrations" && <Integrations />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
