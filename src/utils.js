import { COMMANDERS, FACTIONS } from "./constants";
export const getInitializedBoard = () => {
  const board = new Array(8).fill(0).map((_, index) => {
    switch (index) {
      case 0: {
        return createCommanderRow(FACTIONS.BLACK);
      }
      case 1: {
        return createPawnRow(FACTIONS.BLACK);
      }
      case 6: {
        return createPawnRow(FACTIONS.WHITE);
      }
      case 7: {
        return createCommanderRow(FACTIONS.WHITE);
      }
      default: {
        return new Array(8).fill(null);
      }
    }
  });
  return board;
};

const createCommanderRow = (faction) => {
  const row = [];
  row[0] = { type: COMMANDERS.ROOK, faction };
  row[1] = { type: COMMANDERS.KNIGHT, faction };
  row[2] = { type: COMMANDERS.BISHOP, faction };
  row[3] = { type: COMMANDERS.QUEEN, faction };
  row[4] = { type: COMMANDERS.KING, faction };
  row[5] = { type: COMMANDERS.BISHOP, faction };
  row[6] = { type: COMMANDERS.KNIGHT, faction };
  row[7] = { type: COMMANDERS.ROOK, faction };
  return row;
};

const createPawnRow = (faction) => {
  const row = [];
  for (let i = 0; i < 8; i++) {
    row.push({
      type: COMMANDERS.PAWN,
      faction,
    });
  }
  return row;
};

export const generateValidMovesForCurrentCommander = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return [];

  const { type, faction } = piece;
  const isInside = (x, y) => x >= 0 && y >= 0 && x < 8 && y < 8;
  const moves = [];

  const pushIfValid = (x, y) => {
    if (!isInside(x, y)) return;
    const target = board[x][y];
    if (!target || target.faction !== faction) {
      moves.push([x, y]);
    }
  };

  const slide = (dx, dy) => {
    let x = row + dx;
    let y = col + dy;
    while (isInside(x, y)) {
      const target = board[x][y];
      if (!target) {
        moves.push([x, y]);
      } else {
        if (target.faction !== faction) moves.push([x, y]);
        break;
      }
      x += dx;
      y += dy;
    }
  };

  switch (type) {
    case "PAWN": {
      const dir = faction === "WHITE" ? -1 : 1;
      const startRow = faction === "WHITE" ? 6 : 1;

      // Move forward
      if (isInside(row + dir, col) && !board[row + dir][col]) {
        moves.push([row + dir, col]);

        // First double step
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push([row + 2 * dir, col]);
        }
      }

      // Capture diagonals
      [-1, 1].forEach((dx) => {
        const x = row + dir;
        const y = col + dx;
        if (isInside(x, y) && board[x][y] && board[x][y].faction !== faction) {
          moves.push([x, y]);
        }
      });

      break;
    }

    case "KNIGHT": {
      const offsets = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
      ];
      offsets.forEach(([dx, dy]) => pushIfValid(row + dx, col + dy));
      break;
    }

    case "KING": {
      const offsets = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      offsets.forEach(([dx, dy]) => pushIfValid(row + dx, col + dy));
      break;
    }

    case "ROOK":
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].forEach(([dx, dy]) => slide(dx, dy));
      break;

    case "BISHOP":
      [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].forEach(([dx, dy]) => slide(dx, dy));
      break;

    case "QUEEN":
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ].forEach(([dx, dy]) => slide(dx, dy));
      break;
  }

  return moves;
};
