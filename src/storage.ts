import { z } from 'zod';
import {
  MAX_NAME_LENGTH,
  MINES,
  SIZE,
  createState,
  neighbors,
} from './rules.ts';
import type { Cell, GameState } from './types.ts';

export const KEY = 'minesweeper-save';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

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
  name: z.string().max(MAX_NAME_LENGTH),
});

function isConsistent(board: Cell[]): boolean {
  return (
    board.filter((c) => c.mine).length === MINES &&
    board.every(
      (c, i) => c.cnt === neighbors(i).filter((n) => board[n].mine).length,
    )
  );
}

export function loadState(storage: StorageLike): GameState {
  try {
    const raw = storage.getItem(KEY);
    if (raw === null) return createState();
    const result = schema.safeParse(JSON.parse(raw));
    if (result.success && isConsistent(result.data.board)) return result.data;
    storage.removeItem(KEY);
  } catch {
    return createState();
  }
  return createState();
}

export function saveState(storage: StorageLike, state: GameState): void {
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch {
    return;
  }
}
