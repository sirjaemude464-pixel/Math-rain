import { SIZE, flagsLeft } from './rules.js';

function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function createView(root, name) {
  const flagCount = make('div');
  const reset = make('button', '', '🙂');
  reset.id = 'reset-btn';
  const status = make('div');
  const header = make('div', 'header');
  header.append(flagCount, reset, status);

  const grid = make('div', 'grid');
  const cells = Array.from({ length: SIZE * SIZE }, (_, i) => {
    const cell = make('div', 'cell');
    cell.dataset.i = i;
    grid.append(cell);
    return cell;
  });
  const container = make('div', 'container');
  container.append(header, grid);

  const input = make('input');
  input.type = 'text';
  input.maxLength = 20;
  input.placeholder = 'Your name';
  input.autocomplete = 'off';
  input.value = name;

  const flags = make('ul', 'flags');
  const items = new Map();

  root.append(
    make('h1', '', 'Minesweeper'),
    input,
    container,
    make('h2', '', 'Flags'),
    flags,
  );

  function render(state) {
    flagCount.textContent = `🚩 ${flagsLeft(state)}`;
    reset.textContent =
      state.status === 'won' ? '😎' : state.status === 'lost' ? '😵' : '🙂';
    status.textContent =
      state.status === 'won'
        ? 'You Win!'
        : state.status === 'lost'
          ? 'Boom!'
          : 'Playing';

    state.board.forEach((cell, i) => {
      const el = cells[i];
      el.className = cell.rev
        ? cell.mine
          ? 'cell revealed mine'
          : 'cell revealed'
        : 'cell';
      el.textContent = cell.rev
        ? cell.mine
          ? '💣'
          : cell.cnt || ''
        : cell.flag
          ? '🚩'
          : '';

      const item = items.get(i);
      if (cell.flag && !item) {
        const li = make(
          'li',
          '',
          `Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}`,
        );
        items.set(i, li);
        flags.append(li);
      } else if (!cell.flag && item) {
        item.remove();
        items.delete(i);
      }
    });
  }

  return { grid, reset, input, render };
}
