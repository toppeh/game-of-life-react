import React, { useState, } from 'react';
import { useCanvas } from './hooks/useCanvas';

const maximumRows = 100;
const maximumColumns = 100;

function App() {
  const cellSize = 20;
  const dead = false;
  const alive = true;
  
  const [gameCycle, setGameCycle] = useState(null);
  const [rows, setRows] = useState(20);
  const [columns, setColumns] = useState(30);
  let canvasHeight = cellSize * rows;
  let canvasWidth = cellSize * columns;
  const [ gameState, setGameState, canvasRef, canvasStyle ] = useCanvas(cellSize, canvasHeight, canvasWidth);

  const handleCanvasClick = (event) => {
    if (gameCycle) return;
    let x = Math.floor((event.pageX-event.target.offsetLeft)/cellSize);
    let y = Math.floor((event.pageY-event.target.offsetTop)/cellSize);
    if (x === columns){
      x--;
    }
    if (y === rows){
      y--;
    }
    const newBoard = [...gameState.board];
    newBoard[x][y] = !gameState.board[x][y];
    setGameState({...gameState, board: newBoard});
  };

  const handleReset = () => {
    let newBoard = [];
    for(let x=0; x<canvasWidth/cellSize; x++){
      const column = Array(canvasHeight/cellSize).fill(dead);
      newBoard = [...newBoard, column];
    }
    setGameState({...gameState, board: newBoard});
    if (gameCycle){
      clearInterval(gameCycle);
      setGameCycle(null);
    }
  };

  const handleStart = () => {
    if (!gameCycle){
      const gc = setInterval(gameTick, 1000);
      setGameCycle(gc);
    } else {
      clearInterval(gameCycle);
      setGameCycle(null);
    }
  };

  const handleColumnChange = (event) => {
    if (gameCycle) return;

    let newCols = event.target.value;
    if (newCols < 1) newCols = 1;
    else if (newCols > maximumColumns) newCols = maximumColumns;

    if (newCols < columns){
      setGameState({...gameState, board: gameState.board.slice(0, event.target.value)});
    } else {
      const diff = newCols - columns;
      const newColumns = [];
      for (let i = 0; i < diff; i++){
        newColumns.push(Array(canvasHeight/cellSize).fill(dead));
      }
      setGameState(gameState.board.concat(newColumns));
      setGameState({...gameState, board: gameState.board.concat(newColumns)});
    }
    setColumns(newCols);
  };

  const handleRowChange = (event) => {
    if (gameCycle) return;

    let newRows = event.target.value;
    if (newRows < 1) newRows = 1;
    else if (newRows > maximumRows) newRows = maximumRows;
    
    if (newRows < rows){
      const newBoard = gameState.board.map(column => column.slice(0, newRows));
      setGameState({...gameState, board: newBoard});
    } else {
      const diff = newRows - rows;
      const newBoard = gameState.board.map(column => column.concat(Array(diff).fill(dead)));
      setGameState({...gameState, board: newBoard});
    }
    setRows(newRows);
  };

  const handleColourChange = (event) => {
    console.log(event.target.value);
    setGameState({...gameState, colour: event.target.value});
  };

  const gameTick = () => {
    const newBoard = [];
    gameState.board.forEach((column, x)=>{
      const newColumn = [];
      column.forEach((cell, y) => {
        let aliveNeighbors = 0;
        for (let neighborX = x-1; neighborX <= x+1; neighborX++ ){
          for (let neighborY = y-1; neighborY <= y+1; neighborY++ ){
            if ((0<=neighborX && neighborX<columns) && (0<=neighborY && neighborY <rows) && !(neighborX === x && neighborY === y)){
              if (gameState.board[neighborX][neighborY]) aliveNeighbors++;
            }
          }
        }
        switch (cell) {
        case dead:
          if (aliveNeighbors === 3){
            newColumn.push(alive);
          } else {
            newColumn.push(dead);
          }
          break;
        case alive:
          if (aliveNeighbors < 2 || aliveNeighbors > 3){
            newColumn.push(dead);
          } else {
            newColumn.push(alive);
          }
          break;
        default:
          console.log('jotain meni nyt pahasti vikaan ://');
        }
      });
      newBoard.push(newColumn);
    });
    // this is not the way
    for (let x = 0; x < columns; x++){
      gameState.board[x] = newBoard[x];
    }
    setGameState((prevBoard) => {
      return {...prevBoard, board: newBoard};
    }); 
  };

  return (
    <>
      <div>
        <label htmlFor='columns'>columns (1-100)</label>
        <input type='number' id='number' name='columns' value={columns} min='1' max={maximumColumns} onChange={handleColumnChange} required></input>

        <label htmlFor='colour'>colour</label>
        <input type='color' id='colour' name='colour' onChange={handleColourChange}></input>
      </div>
  
      <label htmlFor='rows'>rows (1-100)</label>
      <input type='number' id='number' name='rows' value={rows} min='1' max={maximumRows} onChange={handleRowChange} required></input>

      <div>
        <canvas 
          ref={canvasRef} 
          height={canvasHeight}
          width={canvasWidth}
          onClick={handleCanvasClick}
          style={canvasStyle}
        />
      </div>
      <button onClick={handleReset}>Reset</button>
      {gameCycle ? <button onClick={handleStart}>Stop</button> : <button onClick={handleStart}>Start</button>}
    </>
  );
}

export default App;
