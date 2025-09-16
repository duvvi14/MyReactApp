import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import calculateWinner from "../utils/calcWinner";

const emptySquares = () => Array(9).fill(null);

export default function Game() {
  const { id } = useParams(); // session id
  const [board, setBoard] = useState(emptySquares);
  const [xIsNext, setXIsNext] = useState(true);
  const [stage, setStage] = useState("start"); // start, playing, ended
  const [history, setHistory] = useState([]);
  const [winnerLine, setWinnerLine] = useState(null);

  useEffect(() => {
    // reset when session id changes
    setBoard(emptySquares());
    setXIsNext(true);
    setStage("start");
    setHistory([]);
    setWinnerLine(null);
  }, [id]);

  const winnerResult = useMemo(() => calculateWinner(board), [board]);
  // winnerResult: { player: 'X'|'O' , line: [i,j,k] } or null

  useEffect(() => {
    if (winnerResult) {
      setStage("ended");
      setWinnerLine(winnerResult.line);
    } else if (!board.includes(null)) {
      // draw
      setStage("ended");
      setWinnerLine(null);
    }
  }, [winnerResult, board]);

  function startGame() {
    setStage("playing");
  }

  function handleSquareClick(i) {
    if (stage !== "playing") return;
    if (board[i] || winnerResult) return;

    const next = board.slice();
    next[i] = xIsNext ? "X" : "O";
    setBoard(next);
    setHistory(h => [...h, { player: xIsNext ? "X" : "O", index: i }]);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setBoard(emptySquares());
    setXIsNext(true);
    setStage("start");
    setHistory([]);
    setWinnerLine(null);
  }

  return (
    <div className="game-page">
      <header>
        <h2>Session: {id}</h2>
        <p><Link to="/lobby">← Back to Lobby</Link></p>
      </header>

      <section className="game-area">
        <div className="game-info">
          <p>Stage: <strong>{stage}</strong></p>
          <p>Next: <strong>{xIsNext ? "X" : "O"}</strong></p>

          {stage === "start" && (
            <>
              <p>Click start to begin the game.</p>
              <button onClick={startGame} className="primary">Start Game</button>
            </>
          )}

          {stage === "ended" && (
            <>
              <p>
                {winnerResult ? `Winner: ${winnerResult.player}` : "It's a draw!"}
              </p>
              <button onClick={resetGame}>Play Again</button>
            </>
          )}

          <div style={{marginTop: 12}}>
            <h4>Moves</h4>
            <ol>
              {history.map((m, idx) => (
                <li key={idx}>#{idx+1} {m.player} → ({Math.floor(m.index/3)+1},{(m.index%3)+1})</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="board">
          {board.map((val, i) => {
            const isWinning = winnerLine && winnerLine.includes(i);
            return (
              <button
                key={i}
                className={`square ${isWinning ? "winning" : ""}`}
                onClick={() => handleSquareClick(i)}
              >
                {val}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}