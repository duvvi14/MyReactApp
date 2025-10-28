// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../services/socket";
// import { useUser } from "../context/UserContext";

// // helper for event ID
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
//   const [events, setEvents] = useState([]);

//   // 🔹 Read: Get list of all events from backend
//   useEffect(() => {
//     // Listen for updated list of events from backend
//     socket.on("acquiringEvents", (data) => {
//       console.log("Received events:", data);
//       setEvents(data);
//     });

//     // Request current event list on load
//     socket.emit("listEvents");

//     // Cleanup listener when component unmounts
//     return () => {
//       socket.off("acquiringEvents");
//     };
//   }, []);

//   // 🔹 Create: Create a new event
//   function createEvent() {
//     const userName = user?.name || "anon";
//     socket.emit("createEvent", userName, (eventId) => {
//       console.log("Created event:", eventId);
//       navigate(`/game/${eventId}`);
//     });
//   }

//   // 🔹 Update: Join an existing event
//   function joinEvent(id) {
//     const userName = user?.name || "anon";
//     socket.emit("joinEvent", { userName, id }, (success) => {
//       if (success) {
//         console.log(`${userName} joined ${id}`);
//         navigate(`/game/${id}`);
//       } else {
//         alert("Failed to join event");
//       }
//     });
//   }

//   // 🔹 Optional local remove (no backend deletion yet)
//   function removeEvent(id) {
//     setEvents((prev) => prev.filter((e) => e.id !== id));
//   }

//   return (
//     <div className="lobby">
//       <h2>Welcome {user?.name || "Guest"} 👋</h2>
//       <button onClick={createEvent} className="primary">
//         Create New Game
//       </button>

//       <section className="sessions">
//         <h3>Available Events</h3>
//         {events.length === 0 && <p>No events yet — create one.</p>}
//         <ul>
//           {events.map((e) => (
//             <li key={e.id} className="session-item">
//               <div>
//                 <strong>{e.id}</strong>{" "}
//                 <small>
//                   ({new Date(e.createdAt || Date.now()).toLocaleString()})
//                 </small>
//               </div>
//               <div className="session-actions">
//                 <button onClick={() => joinEvent(e.id)}>Join</button>
//                 <button onClick={() => removeEvent(e.id)}>Remove</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section style={{ marginTop: 20 }}>
//         <p>
//           💡 Tip: This lobby now syncs live with your Express + Socket.IO backend
//           (Create, Read, Update, Delete events).
//         </p>
//       </section>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { useUser } from "../context/UserContext";

export default function Lobby() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  // 🔹 Read: Load all events when lobby opens
  useEffect(() => {
    socket.on("acquiringEvents", (data) => {
      setEvents(data);
    });

    socket.emit("listEvents"); // request current list from server

    return () => {
      socket.off("acquiringEvents");
    };
  }, []);

  // 🔹 Create: Create a new event
  function handleCreateEvent() {
    socket.emit("createEvent", user.name, (eventId) => {
      navigate(`/game/${eventId}`);
    });
  }

  // 🔹 Update: Join existing event
  function handleJoinEvent(eventId) {
    socket.emit("joinEvent", { userName: user.name, id: eventId }, (ok) => {
      if (ok) navigate(`/game/${eventId}`);
    });
  }

  return (
    <div className="lobby">
      <h2>Welcome, {user?.name || "Guest"} 👋</h2>
      <button className="primary" onClick={handleCreateEvent}>
        🎮 Create New Game
      </button>

      <section className="sessions">
        <h3>Available Games</h3>
        {events.length === 0 && <p>No games yet — start one!</p>}
        <ul>
          {events.map((e) => (
            <li key={e.id} className="session-item">
              <div>
                <strong>{e.id}</strong> — Players: {e.players?.length || 0}
              </div>
              <div className="session-actions">
                <button onClick={() => handleJoinEvent(e.id)}>Join</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <p>💡 Tip: Events update in real time using Socket.IO</p>
      </section>
    </div>
  );
}
