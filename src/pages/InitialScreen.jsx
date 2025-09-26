// src/pages/InitialScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function InitialScreen() {
  const [name, setName] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    // save user in context
    setUser({ name });

    // go to lobby
    navigate("/lobby");
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Enter your Lobby Details🎮</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={e => setName(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem"
          }}
        >
          Join
        </button>
      </form>
    </div>
  );
}
