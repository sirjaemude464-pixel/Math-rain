import { useEffect, useReducer } from 'react';
import { gameReducer } from '../reducer.ts';
import { loadState, saveState } from '../storage.ts';
import type { GameState } from '../types.ts';

const initGame = (): GameState => loadState(localStorage);

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initGame);

  useEffect(() => {
    saveState(localStorage, state);
  }, [state]);

  return { state, dispatch };
}
