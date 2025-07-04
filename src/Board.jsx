import React, { useEffect, useState } from "react";
import { FACTIONS } from "./constants";
import {
  getInitializedBoard,
  generateValidMovesForCurrentCommander,
} from "./utils";

const Board = () => {
  const [board, setBoard] = useState(null);
  const [validMoves, setValidMoves] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [turn, setTurn] = useState(FACTIONS.WHITE);

  useEffect(() => {
    const initialBoard = getInitializedBoard();
    setBoard(initialBoard);
  }, []);

  const handleSelect = (rowIndex, colIndex) => {
    if (!selectedCell) {
      // No piece selected yet
      const currentCell = board[rowIndex][colIndex];
      const isItTurnOfCurrentlyClickedPiece = currentCell?.faction === turn;
      if (board[rowIndex][colIndex] && isItTurnOfCurrentlyClickedPiece) {
        const valid = generateValidMovesForCurrentCommander(
          board,
          rowIndex,
          colIndex
        );
        setSelectedCell([rowIndex, colIndex]);
        setValidMoves(valid);
      }
      return;
    }

    const [x, y] = selectedCell;
    const isClickMadeOnSameCell = x === rowIndex && y === colIndex;

    if (isClickMadeOnSameCell) {
      // Deselect
      setSelectedCell(null);
      setValidMoves(null);
      return;
    }

    const isValidTarget = validMoves?.some(
      ([r, c]) => r === rowIndex && c === colIndex
    );

    if (isValidTarget) {
      // Make a deep copy of board
      const newBoard = board.map((row) => row.slice());

      // Move the piece
      newBoard[rowIndex][colIndex] = newBoard[x][y];
      newBoard[x][y] = null;

      setBoard(newBoard);
      setSelectedCell(null);
      setValidMoves(null);
      console.log("abc");
      if (turn === FACTIONS.WHITE) {
        setTurn(FACTIONS.BLACK);
      } else {
        setTurn(FACTIONS.WHITE);
      }
    } else if (board[rowIndex][colIndex]) {
      // Select a new piece from a different cell
      const valid = generateValidMovesForCurrentCommander(
        board,
        rowIndex,
        colIndex
      );
      setSelectedCell([rowIndex, colIndex]);
      setValidMoves(valid);
    } else {
      // Clicked an invalid empty square
      setSelectedCell(null);
      setValidMoves(null);
    }
  };

  return board ? (
    <div className="board">
      {board.map((row, rowIndex) => {
        return (
          <div className="row" key={`id-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const [x, y] = selectedCell || [];
              const isSelected = x == rowIndex && y === colIndex;
              const isValidTarget = validMoves?.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );
              return (
                <div
                  className={`cell ${isValidTarget && "selected"} ${
                    colIndex % 2 === 0
                      ? rowIndex % 2 === 0
                        ? FACTIONS.WHITE
                        : FACTIONS.BLACK
                      : rowIndex % 2 === 0
                      ? FACTIONS.BLACK
                      : FACTIONS.WHITE
                  }`}
                  key={`id-${colIndex}`}
                  onClick={() => {
                    handleSelect(rowIndex, colIndex);
                  }}
                >
                  {cell && (
                    <div className={`commander ${cell.faction}`}>
                      {cell.type}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  ) : null;
};
export default Board;
