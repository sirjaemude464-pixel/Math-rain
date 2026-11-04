import './style.css';
import { createState, reveal, toggleFlag } from './rules.js';
import { loadState, saveState } from './storage.js';
import { createView } from './view.js';

let state = loadState(localStorage);
const view = createView(document.getElementById('app'), state.name);
const queue = [];

view.grid.addEventListener('click', (e) => {
  const i = e.target.dataset.i;
  if (i !== undefined) queue.push({ type: 'reveal', i: Number(i) });
});
view.grid.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const i = e.target.dataset.i;
  if (i !== undefined) queue.push({ type: 'flag', i: Number(i) });
});
view.reset.addEventListener('click', () => queue.push({ type: 'reset' }));
view.input.addEventListener('input', () => {
  queue.push({ type: 'name', value: view.input.value });
});
addEventListener('pagehide', () => saveState(localStorage, state));

function frame() {
  const actions = queue.splice(0);
  for (const action of actions) {
    if (action.type === 'reveal') reveal(state, action.i);
    else if (action.type === 'flag') toggleFlag(state, action.i);
    else if (action.type === 'name') state.name = action.value;
    else state = createState(Math.random, state.name);
  }
  if (actions.length > 0) {
    view.render(state);
    saveState(localStorage, state);
  }
  requestAnimationFrame(frame);
}

view.render(state);
requestAnimationFrame(frame);
