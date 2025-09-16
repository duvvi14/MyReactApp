import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// utility to create short IDs
function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Lobby() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(() => {
    // load any persisted sessions from localStorage (simple mock of backend)
    try {
      const raw = localStorage.getItem("sessions");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  function createSession() {
    const id = makeId();
    const newSession = {
      id,
      createdAt: Date.now(),
      name: `Game-${id}`,
    };
    setSessions(prev => [newSession, ...prev]);
    // navigate directly to the game page
    navigate(`/game/${id}`);
  }

  function joinSession(id) {
    navigate(`/game/${id}`);
  }

  function removeSession(id) {
    setSessions(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="lobby">
      <h2>Lobby</h2>
      <button onClick={createSession} className="primary">Create New Game</button>

      <section className="sessions">
        <h3>Available Sessions</h3>
        {sessions.length === 0 && <p>No sessions yet — create one.</p>}
        <ul>
          {sessions.map(s => (
            <li key={s.id} className="session-item">
              <div>
                <strong>{s.name}</strong> <small>({new Date(s.createdAt).toLocaleString()})</small>
              </div>
              <div className="session-actions">
                <button onClick={() => joinSession(s.id)}>Join</button>
                <button onClick={() => removeSession(s.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{marginTop: 20}}>
        <p>Tip: This demo uses localStorage to persist sessions. In a real app, sessions come from a server.</p>
      </section>
    </div>
  );
}