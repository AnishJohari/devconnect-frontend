import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = {};

  if (token) {
    user = JSON.parse(atob(token.split(".")[1]));
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);

  // FETCHING USER FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://devconnect-backend-vq4a.onrender.com",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const res = await fetch("https://devconnect-backend-vq4a.onrender.com", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Profile Updated Successfully");

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2>My Profile</h2>

      {editing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "80%",
          }}
        />
      ) : (
        <h3 style={{ marginTop: "20px" }}>Welcome, {name || "User"}</h3>
      )}

      <p style={{ marginTop: "15px" }}>
        <strong>Email:</strong> {email}
      </p>

      {editing ? (
        <button
          onClick={saveProfile}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setEditing(true)}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      )}

      <br />

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Profile;
