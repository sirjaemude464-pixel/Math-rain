export const SIZE = 8;
export const MINES = 10;

export function neighbors(i) {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const result = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if ((dr || dc) && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        result.push(nr * SIZE + nc);
      }
    }
  }
  return result;
}

export function buildState(mines, name = '') {
  const board = Array.from({ length: SIZE * SIZE }, (_, i) => ({
    mine: mines.includes(i),
    rev: false,
    flag: false,
    cnt: 0,
  }));
  board.forEach((cell, i) => {
    cell.cnt = neighbors(i).filter((n) => board[n].mine).length;
  });
  return { board, status: 'playing', name };
}

export function createState(rng = Math.random, name = '') {
  const order = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return buildState(order.slice(0, MINES), name);
}

export function flagsLeft(state) {
  return Math.max(0, MINES - state.board.filter((cell) => cell.flag).length);
}

export function reveal(state, i) {
  const cell = state.board[i];
  if (state.status !== 'playing' || !cell || cell.rev || cell.flag) return;
  cell.rev = true;
  if (cell.mine) {
    state.status = 'lost';
    state.board.forEach((c) => {
      if (c.mine) c.rev = true;
    });
    return;
  }
  if (cell.cnt === 0) neighbors(i).forEach((n) => reveal(state, n));
  if (state.board.every((c) => c.mine || c.rev)) {
    state.status = 'won';
    state.board.forEach((c) => {
      if (c.mine) c.flag = true;
    });
  }
}

export function toggleFlag(state, i) {
  const cell = state.board[i];
  if (state.status !== 'playing' || !cell || cell.rev) return;
  if (!cell.flag && flagsLeft(state) <= 0) return;
  cell.flag = !cell.flag;
}
