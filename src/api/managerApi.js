import axios from "axios";
import { API_BASE_URL } from "../services/apiBase";
import { getFirebaseToken } from "../services/authToken";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Firebase token automatically
API.interceptors.request.use(async (config) => {
  const token = await getFirebaseToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const managerApi = {
  dashboard: () => API.get("/manager/dashboard"),
  attendance: (date) =>
    API.get("/manager/attendance", { params: date ? { date } : {} }),
  verifyAttendance: (payload) => API.post("/manager/attendance/verify", payload),
  employees: (params) => API.get("/manager/employees", { params: params || {} }),
  updateEmployee: (employeeId, payload) =>
    API.put(`/manager/employees/${employeeId}`, payload),
  reportsWeekly: () => API.get("/manager/reports/weekly"),
  reportsMonthly: () => API.get("/manager/reports/monthly"),
  reportsExport: (params) =>
    API.get("/manager/reports/export", { params, responseType: "blob" }),
  getSettings: () => API.get("/manager/settings"),
  updateSettings: (payload) => API.put("/manager/settings", payload),
  fingerprintList: () => API.get("/manager/fingerprint"),
  fingerprintRegister: (payload) => API.post("/manager/fingerprint/register", payload),
  fingerprintReregister: (payload) => API.post("/manager/fingerprint/reregister", payload),
  location: (date) => API.get("/manager/location", { params: date ? { date } : {} }),
  locationCheckin: (payload) => API.post("/manager/location/checkin", payload),
};
