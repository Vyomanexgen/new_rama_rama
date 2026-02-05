// Side-effect module: keep a minimal users/{uid} doc in Firestore in sync with auth state.
// - Creates/updates a user document on sign-in with email, role (inferred from ROLE_EMAILS), and lastSeen timestamp.
// - This file is imported only for side-effects (see `src/main.jsx`).

import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROLE_EMAILS } from "../config/roles";

// Map email -> role for quick lookup
const emailToRole = Object.fromEntries(
  Object.entries(ROLE_EMAILS).map(([r, e]) => [e.toLowerCase(), r])
);

onAuthStateChanged(auth, async (user) => {
  if (!user) return; // nothing to sync on sign-out

  const email = (user.email || "").toLowerCase();
  const role = emailToRole[email] || "user";

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        role,
        lastSeen: new Date(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("authSync: failed to update user doc", e);
  }
});
