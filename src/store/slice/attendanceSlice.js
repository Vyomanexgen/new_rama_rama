// src/store/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Example thunk that fetches attendance summary from Firestore.
 * - Assumes you have a collection "attendanceSummary" or adapt to your schema.
 * - You can replace with your API endpoints if not using Firestore.
 */
export const fetchAttendance = createAsyncThunk("attendance/fetch", async () => {
  // Default sample payload
  const sample = {
    stats: { present: 0, late: 0, absent: 0, halfDay: 0 },
    locationTracking: { withinRange: 0, outOfRange: 0, notTracked: 5 },
    records: [],
  };

  try {
    // Example Firestore fetch (optional). If you don't use Firebase, remove this try/catch and return sample.
    const col = collection(db, "attendanceSummary");
    const snap = await getDocs(col);
    if (snap.empty) return sample;

    // Transform docs into the expected shape
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Suppose first doc contains stats/locationTracking and others are records
    return {
      stats: data[0]?.stats ?? sample.stats,
      locationTracking: data[0]?.locationTracking ?? sample.locationTracking,
      records: data[1]?.records ?? sample.records,
    };
  } catch (err) {
    // If Firestore not configured, return sample
    return sample;
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    stats: { present: 0, late: 0, absent: 0, halfDay: 0 },
    locationTracking: { withinRange: 0, outOfRange: 0, notTracked: 0 },
    records: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload.stats;
        state.locationTracking = action.payload.locationTracking;
        state.records = action.payload.records;
      })
      .addCase(fetchAttendance.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default attendanceSlice.reducer;
