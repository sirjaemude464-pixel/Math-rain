import test from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer } from '../src/reducer.ts';
import { MAX_NAME_LENGTH, buildState } from '../src/rules.ts';

test('renaming keeps the board untouched', () => {
  const state = buildState([0]);
  const next = gameReducer(state, { type: 'name', value: 'Ann' });
  assert.equal(next.name, 'Ann');
  assert.equal(next.board, state.board);
});

test('a long name is cut to the allowed length', () => {
  const next = gameReducer(buildState([0]), {
    type: 'name',
    value: 'x'.repeat(50),
  });
  assert.equal(next.name.length, MAX_NAME_LENGTH);
});

test('board actions do not change the previous state or the name', () => {
  const state = buildState([0], 'Ann');
  const flagged = gameReducer(state, { type: 'flag', i: 5 });
  assert.equal(state.board[5].flag, false);
  assert.equal(flagged.board[5].flag, true);
  assert.equal(flagged.name, 'Ann');
  const revealed = gameReducer(flagged, { type: 'reveal', i: 20 });
  assert.equal(flagged.board[20].rev, false);
  assert.equal(revealed.board[20].rev, true);
  assert.equal(revealed.board[5].flag, true);
});

test('reset starts a new game and keeps the name', () => {
  const lost = { ...buildState([0], 'Ann'), status: 'lost' as const };
  const next = gameReducer(lost, { type: 'reset' });
  assert.equal(next.status, 'playing');
  assert.equal(next.name, 'Ann');
  assert.ok(next.board.every((c) => !c.rev && !c.flag));
});
