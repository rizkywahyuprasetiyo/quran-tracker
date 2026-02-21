import { describe, expect, it } from 'vitest';

import {
  clearActualPosition,
  getActualPosition,
  hasActualPosition,
  saveActualPosition,
} from './actualPosition';

describe('actualPosition utils (browser)', () => {
  it('saves and reads actual position with metadata', () => {
    saveActualPosition(100, 9);

    const position = getActualPosition();
    expect(position?.page).toBe(100);
    expect(position?.line).toBe(9);
    expect(position?.updatedAt).toBeTypeOf('string');
    expect(hasActualPosition()).toBe(true);
  });

  it('clears saved actual position', () => {
    saveActualPosition(9, 2);
    clearActualPosition();

    expect(getActualPosition()).toBeNull();
    expect(hasActualPosition()).toBe(false);
  });

  it('returns null on malformed data', () => {
    localStorage.setItem('quran-tracker-actual-position', '{bad-json');

    expect(getActualPosition()).toBeNull();
    expect(hasActualPosition()).toBe(false);
  });
});
