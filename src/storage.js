import { z } from 'zod';
import { MINES, SIZE, createState, neighbors } from './rules.js';

export const KEY = 'minesweeper-save';

const schema = z.object({
  board: z
    .array(
      z.object({
        mine: z.boolean(),
        rev: z.boolean(),
        flag: z.boolean(),
        cnt: z.number().int().min(0).max(8),
      }),
    )
    .length(SIZE * SIZE),
  status: z.enum(['playing', 'won', 'lost']),
  name: z.string().max(20),
});

function consistent(board) {
  return (
    board.filter((c) => c.mine).length === MINES &&
    board.every(
      (c, i) => c.cnt === neighbors(i).filter((n) => board[n].mine).length,
    )
  );
}

export function loadState(storage) {
  try {
    const result = schema.safeParse(JSON.parse(storage.getItem(KEY)));
    if (result.success && consistent(result.data.board)) return result.data;
    storage.removeItem(KEY);
  } catch {
    return createState();
  }
  return createState();
}

export function saveState(storage, state) {
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch {
    return;
  }
}
