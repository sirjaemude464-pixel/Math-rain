import { MAX_NAME_LENGTH } from '../rules.ts';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <input
      type="text"
      maxLength={MAX_NAME_LENGTH}
      placeholder="Your name"
      autoComplete="off"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
