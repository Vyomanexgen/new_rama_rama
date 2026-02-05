import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Admin() {
  const addManager = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      role: "manager",
      email,
    });

    alert("Manager added");
  };

  return (
    <form onSubmit={addManager}>
      <h2>Admin Panel</h2>
      <input name="email" placeholder="Manager Email" />
      <input name="password" placeholder="Password" />
      <button>Add Manager</button>
    </form>
  );
}
