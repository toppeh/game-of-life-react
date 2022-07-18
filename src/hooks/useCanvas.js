/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

export const canvasWidth = window.innerWidth * .5;
export const canvasHeight = window.innerHeight * .25;

const draw = (ctx, cell, x, y, cellSize, colour) => {
  if (cell){
    ctx.fillStyle = colour;
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
  } else {
    ctx.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize);
  }    
};

export function useCanvas(cellSize, height, width){
  const canvasRef = useRef(null);
  const [ gameState, setGameState ] = useState(() => {
    let emptyBoard = [];
    const initialState = {};
    for(let x=0; x<width/cellSize; x++){
      const column = Array(height/cellSize).fill(false);
      emptyBoard = [...emptyBoard, column];
    }
    initialState.board = emptyBoard;
    initialState.colour = 0x000000;
    return initialState;
  });

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect( 0,0, width, height );
    //console.log("useEffect",board);
    gameState.board.forEach((column, x)=>{
      column.forEach((cell, y) => {
        draw(ctx, cell, x, y, cellSize, gameState.colour);
      });
    });
  });

  const canvasStyle = {
    border: '1px solid black'
  };

  return [ gameState, setGameState, canvasRef, canvasStyle ];
}