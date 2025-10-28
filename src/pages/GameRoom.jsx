import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { useUser } from "../context/UserContext";

export default function GameRoom() {
  const { id } = useParams(); // eventId
  const navigate = useNavigate();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));

  // 🔹 Subscribe to event updates
  useEffect(() => {
    socket.on("eventSubscribe", (data) => {
      setEvent(data);
    });

    // Join event on mount
    socket.emit("joinEvent", { userName: user.name, id }, (ok) => {
      if (!ok) navigate("/");
    });

    // Cleanup
    return () => socket.off("eventSubscribe");
  }, [id, user.name, navigate]);

  // 🔹 Handle player readiness
  function handleReady() {
    socket.emit("updateEvent", id, "playerReady", user.name);
    setIsReady(true);
  }

  // 🔹 Handle player move
  function handleMove(index) {
    if (!event || !event.symbolMap || board[index]) return;
    const symbol = event.symbolMap[user.name];
    if (!symbol) return;

    const newBoard = [...board];
    newBoard[index] = symbol;

    const newHistory = [...(event.history || []), newBoard];
    setBoard(newBoard);
    socket.emit("updateEvent", id, "playerMove", newHistory);
  }

  // 🔹 Cleanup on leave (Delete)
  useEffect(() => {
    const beforeUnloadListener = () => {
      if (event) socket.emit("updateEvent", event.id, "playerLeave", user.name);
    };
    window.addEventListener("beforeunload", beforeUnloadListener);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, [event, user.name]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="game-room">
      <h2>Game Room: {id}</h2>
      <p>Players: {event.players?.join(", ")}</p>

      {!isReady && (
        <button className="primary" onClick={handleReady}>
          ✅ Ready
        </button>
      )}

      {event.stage === 1 && (
        <div className="board">
          {board.map((cell, i) => (
            <button
              key={i}
              className="cell"
              onClick={() => handleMove(i)}
            >
              {cell}
            </button>
          ))}
        </div>
      )}

      <p>Stage: {event.stage === 0 ? "Waiting for players..." : "Game On!"}</p>
    </div>
  );
}
