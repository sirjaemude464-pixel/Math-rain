import { MAX_NAME_LENGTH, createState, reveal, toggleFlag } from './rules.ts';
import type { Action, GameState } from './types.ts';

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'reveal': {
      const next = structuredClone(state);
      reveal(next, action.i);
      return next;
    }
    case 'flag': {
      const next = structuredClone(state);
      toggleFlag(next, action.i);
      return next;
    }
    case 'name':
      return { ...state, name: action.value.slice(0, MAX_NAME_LENGTH) };
    case 'reset':
      return createState(Math.random, state.name);
  }
}
