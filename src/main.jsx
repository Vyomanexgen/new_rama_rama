import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
// import { store } from "./store";   // ✅ Correct import for Redux store
import "./index.css";

// Side-effect: keep Firestore user/role documents in sync on sign-in
import "./utils/authSync";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
    {/* <Provider store={store}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </Provider> */}
   </React.StrictMode> 
);


 
