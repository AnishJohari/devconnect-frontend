import { useState } from "react";
import { signup } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    /* Password Validation */
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters and include alphabet, number, and special character.",
      );
      return;
    }

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
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

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "42px",
          }}
        >
          {loading ? (
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "3px solid rgba(255,255,255,0.35)",
                borderTop: "3px solid white",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            ></span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have account? <Link to="/login">Login</Link>
      </p>

      <style>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
