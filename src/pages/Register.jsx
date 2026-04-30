import { useState } from "react";
import { signup } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    /* Password Validation:
       - Minimum 8 characters
       - At least 1 alphabet
       - At least 1 digit
       - At least 1 special character
    */
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters and include alphabet, number, and special character.",
      );
      return;
    }

    try {
      const data = await signup({ name, email, password });

      console.log("REGISTER RESPONSE:", data);

      if (data && (data.user || data.message === "User created")) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Error registering user");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
