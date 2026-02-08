import React, { useEffect, useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { managerApi } from "../../api/managerApi";

export default function Fingerprint() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("register");

  const loadList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await managerApi.fingerprintList();
      setEmployees(res.data?.employees || []);
    } catch (e) {
      console.error("FINGERPRINT LIST ERROR:", e);
      setError("Failed to load fingerprint list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const requestFingerprint = async (emp, type) => {
    try {
      setActionType(type);
      setActiveEmployee(emp);
      if (type === "reregister") {
        await managerApi.fingerprintReregister({ employeeId: emp.id });
      } else {
        await managerApi.fingerprintRegister({ employeeId: emp.id });
      }
      await loadList();
      setShowModal(true);
    } catch (e) {
      console.error("FINGERPRINT REQUEST ERROR:", e);
      const msg = e?.response?.data?.message || "Failed to request fingerprint";
      alert(msg);
    }
  };

  return (
    <div className="w-full">

      {/* ---- Fingerprint Registration Status ---- */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-semibold mb-4">Fingerprint Registration Status</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {loading && <div className="mb-3 text-sm text-gray-500">Loading...</div>}

        {employees.map((emp) => (
          <div
            key={emp.id || emp.email || emp.name}
            className="flex items-center justify-between p-3 border rounded-lg mb-3 hover:bg-gray-50 transition"
          >
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                <FaFingerprint className="text-green-700 text-xl" />
              </div>
              <div>
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-gray-500">
                  {emp.department || emp.dept || "-"}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm rounded-full border ${
                  emp.fingerprintStatus?.status === "Registered"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {emp.fingerprintStatus?.status || "Not Registered"}
              </span>

              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  emp.fingerprintStatus?.status === "Registered"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-500 text-white"
                }`}
                onClick={() =>
                  requestFingerprint(
                    emp,
                    emp.fingerprintStatus?.status === "Registered"
                      ? "reregister"
                      : "register"
                  )
                }
              >
                {emp.fingerprintStatus?.status === "Registered" ? "Re-register" : "Register"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && activeEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">
              {actionType === "reregister" ? "Re-register Fingerprint" : "Register Fingerprint"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ask <span className="font-semibold">{activeEmployee.name}</span> to use a device
              with a fingerprint sensor (laptop, mobile, or external scanner). When the sensor
              prompt appears on their device, they should complete the scan.
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-4">
              <li>Open the employee device and sign in if required</li>
              <li>Place finger on the sensor to confirm</li>
              <li>Wait for registration to complete</li>
            </ol>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm rounded-md border"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-black text-white"
                onClick={() => setShowModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- How to Register Fingerprint ---- */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">How to Register Fingerprint</h2>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click the "Register" button next to the employee name</li>
          <li>Ask the employee to place their finger on the fingerprint scanner</li>
          <li>Hold steady until the registration is complete</li>
          <li>The system will confirm successful registration</li>
          <li>Employee can now use fingerprint for attendance marking</li>
        </ol>
      </div>
    </div>
  );
}
