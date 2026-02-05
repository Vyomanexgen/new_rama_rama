import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SuperAdminPanel() {
  const addAdmin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      email,
      role: "admin",
    });

    alert("Admin Created");
  };

  return (
    <>
      <h2>SUPER ADMIN DASHBOARD</h2>

      <form onSubmit={addAdmin}>
        <input name="email" placeholder="Admin Email" />
        <input name="password" placeholder="Password" />
        <button>Create Admin</button>
      </form>
    </>
  );
}
