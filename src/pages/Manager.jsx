import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Manager() {
  const addEmployee = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      role: "employee",
      email,
    });

    alert("Employee added");a
  };

  return (
    <form onSubmit={addEmployee}>
      <h2>Manager Panel</h2>
      <input name="email" placeholder="Employee Email" />
      <input name="password" placeholder="Password" />
      <button>Add Employee</button>
    </form>
  );
}
