import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function Home() {
  return <h2>🏠 Welcome to Tic-Tac-Toe</h2>;
}

function Lobby() {
  return <h2>🎮 Join or Create a Game Lobby</h2>;
}

function About() {
  return <h2>ℹ️ This is a Tic-Tac-Toe app built with React + Vite + Router</h2>;
}

export default function App() {
  return (
    <div className="App">
      <h1>React Router Demo</h1>

      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/lobby">Lobby</Link> |{" "}
        <Link to="/about">About</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/about" element={<About />} />
      </Routes>
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

