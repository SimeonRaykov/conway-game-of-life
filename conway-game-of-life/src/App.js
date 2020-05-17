import React, { useState, useRef, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const DEFAULT_GAME_SPEED = 100;
  const DEFAULT_ROWS = 37;
  const DEFAULT_COLS = 37;

  const [gameSpeed, setGameSpeed] = useState(DEFAULT_GAME_SPEED);
  const [matrixRows, setMatrixRows] = useState(DEFAULT_ROWS);
  const [matrixCols, setMatrixCols] = useState(DEFAULT_COLS);
  const [matrix, setMatrix] = useState(() => {
    let arr = [];
    for (let i = 0; i < matrixRows; i++) {
      arr[i] = [];
      for (let j = 0; j < matrixCols; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  });
  const [gameState, setGameState] = useState(false);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const gameSpeedRef = useRef(gameSpeed);
  gameSpeedRef.current = gameSpeed;

  const runGame = useCallback(() => {
    if (!gameStateRef.current) {
      return;
    }

    setMatrix(currentMatrix => {
      let copyMatrix = currentMatrix.map(function (arr) {
        return arr.slice();
      });
      for (let i = 0; i < matrixRows; i++) {
        for (let j = 0; j < matrixCols; j++) {
          let neighbours = countNeighbours(i, j, currentMatrix)

          if (neighbours === 3) {
            copyMatrix[i][j] = 1;
          }
          else if (neighbours < 2 || neighbours > 3) {
            copyMatrix[i][j] = 0;
          }
        }
      }
      return copyMatrix;
    });
    setTimeout(function () {
      runGame();
    }, gameSpeedRef.current);
  }, []);

  function buildEmptyMatrix() {
    let arr = [];
    for (let i = 0; i < matrixRows; i++) {
      arr[i] = [];
      for (let j = 0; j < matrixCols; j++) {
        arr[i][j] = 0;
      }
    }
    setMatrix(arr);
  }

  function generateRandomMatrix() {
    let arr = [];
    for (let i = 0; i < matrixRows; i++) {
      arr[i] = [];
      for (let j = 0; j < matrixCols; j++) {
        arr[i][j] = Math.floor(Math.random() * 10) <= 5 ? 0 : 1;
      }
    }
    setMatrix(arr);
  }

  function toggle() {
    setGameState(!gameState);
    if (!gameState) {
      gameStateRef.current = true;
      gameStateRef.current = gameSpeed;
      runGame();
    }
  }

  function countNeighbours(i, j, matrix) {
    let count = 0;
    counter(i + 1, j - 1);
    counter(i + 1, j);
    counter(i + 1, j + 1);
    counter(i - 1, j - 1);
    counter(i - 1, j);
    counter(i - 1, j + 1);
    counter(i, j - 1);
    counter(i, j + 1);

    function counter(i, j) {
      if (i > 0 && i < matrixRows && j > 0 && j < matrixCols) {
        if (matrix[i][j] == 1) count += 1;
      }
    }
    return count;
  }

  if (!matrix) {
    return
  }
  return (
    <div className="App">
      <div className="container">
        <div className="row justify-content-center">
          <button class={`button mt-3 ${gameState ? 'paused' : ''}`} onClick={toggle}></button><button onClick={generateRandomMatrix} class="blob-btn">
            Generate random matrix
<span class="blob-btn__inner">
              <span class="blob-btn__blobs">
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
              </span>
            </span>
          </button>
          <button onClick={buildEmptyMatrix} class="blob-btn">
            Clear matrix
<span class="blob-btn__inner">
              <span class="blob-btn__blobs">
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
              </span>
            </span>
          </button>
          <div>
            <input class="form-control" type="number" value={gameSpeed} onChange={e => setGameSpeed(e.target.value)} id="game-speed" /> <div class="btn" id="speed">speed <span class="badge badge-light">ms</span></div>
          </div>
        </div>

        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${matrixRows}, 25px)` }}>
          {
            matrix.map((row, i) =>
              row.map((cell, y) => (
                <div key={`${i}${y}`} onClick={() => {
                  const copyMatrix = matrix.map(function (arr) {
                    return arr.slice();
                  });
                  copyMatrix[i][y] = copyMatrix[i][y] ? 0 : 1;
                  setMatrix(copyMatrix);
                }} className={`cell ${cell === 0 ? 'death-cell' : 'alive-cell'}`}></div>
              )
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default App;
