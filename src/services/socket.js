// socket.js — minimal wrapper
import { io } from "socket.io-client";

let socket = null;

export function connect(sessionId, onEvent) {
  if (socket) socket.disconnect();
  socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5173/", {
    query: { sessionId },
  });

  socket.on("connect", () => console.log("socket connected"));
  socket.on("game:update", (data) => onEvent && onEvent(data));
  socket.on("disconnect", () => console.log("socket disconnected"));
  return socket;
}

export function sendMove(move) {
  if (!socket) throw new Error("socket not connected");
  socket.emit("game:move", move);
}

export function disconnect() {
  if (socket) socket.disconnect();
  socket = null;
}
