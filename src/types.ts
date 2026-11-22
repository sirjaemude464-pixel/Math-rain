export type Status = 'playing' | 'won' | 'lost';

export interface Cell {
  mine: boolean;
  rev: boolean;
  flag: boolean;
  cnt: number;
}

export interface GameState {
  board: Cell[];
  status: Status;
  name: string;
}

export type Action =
  | { type: 'reveal'; i: number }
  | { type: 'flag'; i: number }
  | { type: 'name'; value: string }
  | { type: 'reset' };
