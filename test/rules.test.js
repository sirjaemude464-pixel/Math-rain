import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MINES,
  SIZE,
  buildState,
  createState,
  flagsLeft,
  reveal,
  toggleFlag,
} from '../src/rules.js';

function seeded(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

test('a new game has the right mines and neighbour counts', () => {
  const s = createState(seeded(7));
  assert.equal(s.board.length, SIZE * SIZE);
  assert.equal(s.board.filter((c) => c.mine).length, MINES);
  assert.equal(s.status, 'playing');
  const t = buildState([0]);
  assert.equal(t.board[1].cnt, 1);
  assert.equal(t.board[9].cnt, 1);
  assert.equal(t.board[2].cnt, 0);
});

test('revealing a mine loses the game and shows every mine', () => {
  const s = buildState([0, 63]);
  reveal(s, 0);
  assert.equal(s.status, 'lost');
  assert.equal(s.board[63].rev, true);
  reveal(s, 5);
  assert.equal(s.board[5].rev, false);
});

test('revealing an empty cell opens its neighbours and can win', () => {
  const s = buildState([63]);
  reveal(s, 0);
  assert.equal(s.status, 'won');
  assert.equal(s.board.filter((c) => c.rev).length, 63);
  assert.equal(s.board[63].flag, true);
  assert.equal(flagsLeft(s), MINES - 1);
});

test('flags block reveals and toggle back', () => {
  const s = buildState([0]);
  toggleFlag(s, 5);
  assert.equal(flagsLeft(s), MINES - 1);
  reveal(s, 5);
  assert.equal(s.board[5].rev, false);
  toggleFlag(s, 5);
  assert.equal(flagsLeft(s), MINES);
  reveal(s, 5);
  assert.equal(s.board[5].rev, true);
});

test('nothing changes after the game is over', () => {
  const s = buildState([0]);
  s.status = 'lost';
  reveal(s, 5);
  toggleFlag(s, 5);
  assert.equal(s.board[5].rev, false);
  assert.equal(s.board[5].flag, false);
});
