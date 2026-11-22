import type { Status } from '../types.ts';

interface HeaderProps {
  flagsLeft: number;
  status: Status;
  onReset: () => void;
}

const FACES: Record<Status, string> = {
  playing: '🙂',
  won: '😎',
  lost: '😵',
};

const MESSAGES: Record<Status, string> = {
  playing: 'Playing',
  won: 'You Win!',
  lost: 'Boom!',
};

export function Header({ flagsLeft, status, onReset }: HeaderProps) {
  return (
    <div className="header">
      <div>🚩 {flagsLeft}</div>
      <button id="reset-btn" onClick={onReset}>
        {FACES[status]}
      </button>
      <div>{MESSAGES[status]}</div>
    </div>
  );
}
