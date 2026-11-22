import test from 'node:test';
import assert from 'node:assert/strict';
import { MINES, buildState, neighbors } from '../src/rules.ts';
import { KEY, loadState, saveState } from '../src/storage.ts';
import type { StorageLike } from '../src/storage.ts';
import type { GameState } from '../src/types.ts';

function memoryStorage(initial?: string): StorageLike {
  const data = new Map<string, string>(initial ? [[KEY, initial]] : []);
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
  };
}

function isFresh(s: GameState): boolean {
  return (
    s.status === 'playing' &&
    s.board.every((c) => !c.rev && !c.flag) &&
    s.board.filter((c) => c.mine).length === MINES &&
    s.board.every(
      (c, i) => c.cnt === neighbors(i).filter((n) => s.board[n].mine).length,
    )
  );
}

const TEN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

test('a saved game is restored', () => {
  const s = buildState(TEN, 'Ann');
  s.board[20].rev = true;
  const storage = memoryStorage();
  saveState(storage, s);
  assert.deepEqual(loadState(storage), s);
});

test('corrupted saves start a fresh game', () => {
  const wrongCount = buildState(TEN);
  wrongCount.board[30].cnt = 5;
  const bad = [
    '{bad',
    '{"board":[]}',
    '[]',
    'null',
    JSON.stringify(wrongCount),
    JSON.stringify(buildState([0, 1])),
    JSON.stringify({ ...buildState(TEN), name: 'x'.repeat(50) }),
  ];
  for (const raw of bad) assert.ok(isFresh(loadState(memoryStorage(raw))));
  assert.ok(isFresh(loadState(memoryStorage())));
});

test('a broken storage does not crash the game', () => {
  const broken: StorageLike = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
    removeItem: () => {
      throw new Error('blocked');
    },
  };
  assert.ok(isFresh(loadState(broken)));
  assert.doesNotThrow(() => saveState(broken, buildState(TEN)));
});
