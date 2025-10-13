// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { useUser } from "../context/UserContext";

// // helper for session ID
// function makeId(length = 6) {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// export default function Lobby() {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const [sessions, setSessions] = useState(() => {
//     try {
//       const raw = localStorage.getItem("sessions");
//       return raw ? JSON.parse(raw) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Load sessions from API or fallback to localStorage
//   useEffect(() => {
//     async function loadSessions() {
//       try {
//         const result = await api.getSessions();
//         setSessions(result);
//       } catch (err) {
//         console.warn("API failed, using localStorage sessions");
//         const raw = localStorage.getItem("sessions");
//         if (raw) setSessions(JSON.parse(raw));
//       }
//     }
//     loadSessions();
//   }, []);

//   // persist sessions to localStorage
//   useEffect(() => {
//     localStorage.setItem("sessions", JSON.stringify(sessions));
//   }, [sessions]);

//   async function createSession() {
//     const id = makeId();
//     const payload = {
//       id,
//       name: `Game-${id}`,
//       createdAt: Date.now(),
//       host: user?.name || "anon",
//     };

//     try {
//       await api.createSession(payload); // backend
//       setSessions(prev => [payload, ...prev]); // update UI
//       navigate(`/game/${id}`);
//     } catch (err) {
//       console.warn("API failed, saving locally");
//       setSessions(prev => [payload, ...prev]); // fallback local
//       navigate(`/game/${id}`);
//     }
//   }

//   function joinSession(id) {
//     navigate(`/game/${id}`);
//   }

//   function removeSession(id) {
//     setSessions(prev => prev.filter(s => s.id !== id));
//   }

//   return (
//     <div className="lobby">
//       <h2>Welcome {user?.name || "Guest"} 👋</h2>
//       <button onClick={createSession} className="primary">Create New Game</button>

//       <section className="sessions">
//         <h3>Available Sessions</h3>
//         {sessions.length === 0 && <p>No sessions yet — create one.</p>}
//         <ul>
//           {sessions.map(s => (
//             <li key={s.id} className="session-item">
//               <div>
//                 <strong>{s.name}</strong>{" "}
//                 <small>({new Date(s.createdAt).toLocaleString()})</small>
//               </div>
//               <div className="session-actions">
//                 <button onClick={() => joinSession(s.id)}>Join</button>
//                 <button onClick={() => removeSession(s.id)}>Remove</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section style={{ marginTop: 20 }}>
//         <p>
//           Tip: This demo uses localStorage to persist sessions if API is unavailable.
//         </p>
//       </section>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { useUser } from "../context/UserContext";

// helper for session ID
function makeId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Lobby() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  // Listen for sessions broadcasted from backend
  useEffect(() => {
    socket.on("sessions", (data) => {
      setSessions(data);
    });

    // Cleanup listener
    return () => {
      socket.off("sessions");
    };
  }, []);

  // Create new session
  function createSession() {
    const id = makeId();
    const payload = {
      id,
      name: `Game-${id}`,
      createdAt: Date.now(),
      host: user?.name || "anon",
    };
    socket.emit("createSession", payload); // send to backend
    navigate(`/game/${id}`);
  }

  // Join an existing session
  function joinSession(id) {
    socket.emit("joinSession", id); // notify backend
    navigate(`/game/${id}`);
  }

  // Remove a session (optional local removal)
  function removeSession(id) {
    // you could also emit "removeSession" to backend if supported
    setSessions(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="lobby">
      <h2>Welcome {user?.name || "Guest"} 👋</h2>
      <button onClick={createSession} className="primary">Create New Game</button>

      <section className="sessions">
        <h3>Available Sessions</h3>
        {sessions.length === 0 && <p>No sessions yet — create one.</p>}
        <ul>
          {sessions.map(s => (
            <li key={s.id} className="session-item">
              <div>
                <strong>{s.name}</strong>{" "}
                <small>({new Date(s.createdAt).toLocaleString()})</small>
              </div>
              <div className="session-actions">
                <button onClick={() => joinSession(s.id)}>Join</button>
                <button onClick={() => removeSession(s.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <p>Tip: This demo now uses Socket.IO to sync sessions in real time.</p>
      </section>
    </div>
  );
}
