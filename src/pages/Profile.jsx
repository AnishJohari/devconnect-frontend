import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const PROFILE_URL =
    "https://devconnect-backend-vq4a.onrender.com/api/auth/profile";

  const UPDATE_URL =
    "https://devconnect-backend-vq4a.onrender.com/api/auth/update";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(PROFILE_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to fetch profile");
          return;
        }

        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
        alert("Network error while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* SAVE PROFILE */
  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch(UPDATE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Profile Updated Successfully");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Network error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading profile...
      </div>
    );
  }

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
          disabled={saving}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
            minWidth: "110px",
            minHeight: "42px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {saving ? (
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "3px solid rgba(0,0,0,0.2)",
                borderTop: "3px solid black",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            ></span>
          ) : (
            "Save"
          )}
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

export default Profile;
