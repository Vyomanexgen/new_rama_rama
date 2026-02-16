import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

let authReadyPromise;

const waitForAuthReady = () => {
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  }
  return authReadyPromise;
};

export const getFirebaseToken = async () => {
  const user = auth.currentUser || (await waitForAuthReady());
  if (!user) return null;
  return user.getIdToken();
};
