// src/store/index.js  (or wherever you configure the store)
import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "./slice/attendanceSlice"
// import other reducers you already have e.g. authReducer
import authReducer from "./slice/authSlice"; // if present

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    auth: authReducer, // keep your existing ones
    // ...other reducers
  },
});
