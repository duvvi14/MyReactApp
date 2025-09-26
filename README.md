# MyReactApp

Build Project

# Tic-Tac-Toe Multi-User Web App

A full-stack React + NodeJS style project to create a **multi-user Tic-Tac-Toe lobby system**. Users can enter their name, join or create game sessions, and play interactive Tic-Tac-Toe matches. This project demonstrates routing, state management, API integration (with fallback), and frontend-backend separation.

---

## Features

- **Initial Screen:** Collects user information (name).
- **Lobby:** View existing game sessions, create new sessions, join games.
- **Game View:** Interactive Tic-Tac-Toe board with start → playing → end stages.
- **Routing:** React Router for seamless client-side navigation.
- **User Context:** Persist user information across pages.
- **API + Fallback:** Simulated API calls with localStorage fallback for offline functionality.
- **Multi-User Ready:** Structured to support multiple users in a session (ready for backend WebSocket integration).

---

## Tech Stack

- **Frontend:** React, Vite, React Router, CSS
- **Backend Stub:** Simulated API in `src/services/api.js`
- **State Management:** React `useState`, `useEffect`, Context API (`UserContext`)
- **Version Control:** Git + GitHub

---

## Project Structure

```bash
src/
  App.jsx           # Main routes
  main.jsx          # ReactDOM + BrowserRouter + UserProvider
  pages/
    InitialScreen.jsx
    Lobby.jsx
    Game.jsx
  context/
    UserContext.jsx
  services/
    api.js          # API stub with fallback
  utils/
    calcWinner.js   # Game logic helper
  index.css
  App.css
```

---

## Run locally

```bash
npm install
npm run dev
# open the URL printed by Vite (usually http://localhost:5173)
```
