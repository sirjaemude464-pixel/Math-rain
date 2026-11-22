import type { MouseEvent } from 'react';
import type { Cell } from '../types.ts';

interface CellViewProps {
  cell: Cell;
  index: number;
  onReveal: (index: number) => void;
  onFlag: (index: number) => void;
}

function getLabel(cell: Cell): string {
  if (cell.rev) {
    if (cell.mine) return '💣';
    return cell.cnt > 0 ? String(cell.cnt) : '';
  }
  return cell.flag ? '🚩' : '';
}

function getClassName(cell: Cell): string {
  if (!cell.rev) return 'cell';
  return cell.mine ? 'cell revealed mine' : 'cell revealed';
}

export function CellView({ cell, index, onReveal, onFlag }: CellViewProps) {
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onFlag(index);
  };

  return (
    <div
      className={getClassName(cell)}
      onClick={() => onReveal(index)}
      onContextMenu={handleContextMenu}
    >
      {getLabel(cell)}
    </div>
  );
}
