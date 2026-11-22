import { useCallback } from 'react';
import { Board } from './components/Board.tsx';
import { FlagList } from './components/FlagList.tsx';
import { Header } from './components/Header.tsx';
import { NameInput } from './components/NameInput.tsx';
import { useGame } from './hooks/useGame.ts';
import { flagsLeft } from './rules.ts';

export function App() {
  const { state, dispatch } = useGame();

  const reveal = useCallback(
    (i: number) => dispatch({ type: 'reveal', i }),
    [dispatch],
  );
  const flag = useCallback(
    (i: number) => dispatch({ type: 'flag', i }),
    [dispatch],
  );
  const reset = useCallback(() => dispatch({ type: 'reset' }), [dispatch]);
  const rename = useCallback(
    (value: string) => dispatch({ type: 'name', value }),
    [dispatch],
  );

  return (
    <>
      <h1>Minesweeper</h1>
      <NameInput value={state.name} onChange={rename} />
      <div className="container">
        <Header
          flagsLeft={flagsLeft(state)}
          status={state.status}
          onReset={reset}
        />
        <Board cells={state.board} onReveal={reveal} onFlag={flag} />
      </div>
      <FlagList cells={state.board} />
    </>
  );
}
