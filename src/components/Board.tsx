import { memo } from 'react';
import type { Cell } from '../types.ts';
import { CellView } from './CellView.tsx';

interface BoardProps {
  cells: Cell[];
  onReveal: (index: number) => void;
  onFlag: (index: number) => void;
}

function BoardView({ cells, onReveal, onFlag }: BoardProps) {
  return (
    <div className="grid">
      {cells.map((cell, index) => (
        <CellView
          key={index}
          cell={cell}
          index={index}
          onReveal={onReveal}
          onFlag={onFlag}
        />
      ))}
    </div>
  );
}

export const Board = memo(BoardView);
