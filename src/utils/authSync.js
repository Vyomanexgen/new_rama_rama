// Side-effect module: keep a minimal users/{uid} doc in Firestore in sync with auth state.
// - Creates/updates a user document on sign-in with email, role (inferred from ROLE_EMAILS), and lastSeen timestamp.
// - This file is imported only for side-effects (see `src/main.jsx`).

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ROLE_EMAILS } from "../config/roles";

// Map email -> role for quick lookup
const updateEmployeeLogin = async (user) => {
  try {
    const ref = collection(db, "employees");
    let snap = await getDocs(query(ref, where("firebaseUid", "==", user.uid), limit(1)));
    if (snap.empty) {
      snap = await getDocs(query(ref, where("uid", "==", user.uid), limit(1)));
    }
    if (snap.empty && user.email) {
      snap = await getDocs(query(ref, where("email", "==", user.email), limit(1)));
    }
    if (snap.empty) return;
    const docRef = snap.docs[0].ref;
    await setDoc(docRef, { lastLoginAt: new Date() }, { merge: true });
  } catch (e) {
    console.error("authSync: failed to update employee login", e);
  }
};

const emailToRole = Object.fromEntries(
  Object.entries(ROLE_EMAILS).map(([r, e]) => [e.toLowerCase(), r])
);

onAuthStateChanged(auth, async (user) => {
  if (!user) return; // nothing to sync on sign-out

  const email = (user.email || "").toLowerCase();
  const role = emailToRole[email] || "user";
  const userRef = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      await setDoc(
        userRef,
        {
          lastSeen: new Date(),
        },
        { merge: true }
      );
    } else {
      await setDoc(
        userRef,
        {
          email: user.email,
          role,
          createdAt: new Date(),
          lastSeen: new Date(),
        },
        { merge: true }
      );
    }
    await updateEmployeeLogin(user);
  } catch (e) {
    console.error("authSync: failed to update user doc", e);
  }
});
