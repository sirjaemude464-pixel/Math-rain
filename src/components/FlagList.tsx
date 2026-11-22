import { memo } from 'react';
import { SIZE } from '../rules.ts';
import type { Cell } from '../types.ts';

interface FlagListProps {
  cells: Cell[];
}

function FlagListView({ cells }: FlagListProps) {
  const flagged = cells.flatMap((cell, index) => (cell.flag ? [index] : []));

  return (
    <>
      <h2>Flags</h2>
      <ul className="flags">
        {flagged.map((index) => (
          <li key={index}>
            Row {Math.floor(index / SIZE) + 1}, column {(index % SIZE) + 1}
          </li>
        ))}
      </ul>
    </>
  );
}

export const FlagList = memo(FlagListView);
