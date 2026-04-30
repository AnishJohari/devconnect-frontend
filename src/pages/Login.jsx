import { useState } from "react";
import { login } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
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
            "Login"
          )}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      {/* Inline animation */}
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
