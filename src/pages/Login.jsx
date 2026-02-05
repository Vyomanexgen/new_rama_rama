import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      console.log("AUTH UID =>", res.user.uid);

      const snap = await getDoc(doc(db, "users", res.user.uid));

      console.log("DOC EXISTS =>", snap.exists());
      console.log("RAW DATA =>", snap.data());

      if (!snap.exists()) {
        alert("Firestore user document missing");
        return;
      }

      const rawRole = snap.data().role;
      const cleanRole = rawRole?.toString().trim().toLowerCase();

      console.log("RAW ROLE =>", rawRole);
      console.log("CLEAN ROLE =>", cleanRole);

      if (cleanRole === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (cleanRole === "admin") {
        navigate("/admin/dashboard");
      } else if (cleanRole === "manager") {
        navigate("/manager/dashboard");
      } else if (cleanRole === "employee") {
        navigate("/employee/dashboard");
      } else {
        alert("UNKNOWN ROLE => " + cleanRole);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Superadmin Login</h2>

      <input name="email" placeholder="Email" required />
      <input name="password" type="password" required />

      <button>Login</button>
    </form>
  );
}
