import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import InitialScreen from "./pages/InitialScreen";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import { useUser } from "./context/UserContext";
import "./App.css";

function RequireUser({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-root">
      <header>
        <h1>Tic-Tac-Toe Lobby</h1>
        <nav>
          <Link to="/">Home</Link> 
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route path="/lobby" element={
            <RequireUser>
              <Lobby />
            </RequireUser>
          } />
          <Route path="/game/:id" element={
            <RequireUser>
              <Game />
            </RequireUser>
          } />
        </Routes>
      </main>
    </div>
  );
}



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

