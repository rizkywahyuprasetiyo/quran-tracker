import { describe, expect, it } from 'vitest';

import {
  clearActualPosition,
  clearAll,
  getActualPosition,
  getConfig,
  hasActualPosition,
  hasSetup,
  saveActualPosition,
  saveConfig,
} from './storage';

describe('storage utils (browser)', () => {
  it('saves and retrieves tracker config', () => {
    saveConfig({ startDate: '2026-02-19', targetCount: 2 });

    expect(getConfig()).toEqual({ startDate: '2026-02-19', targetCount: 2 });
    expect(hasSetup()).toBe(true);
  });

  it('returns false for setup when config does not exist', () => {
    expect(getConfig()).toBeNull();
    expect(hasSetup()).toBe(false);
  });

  it('handles corrupted config JSON safely', () => {
    localStorage.setItem('quran-tracker-config', '{bad-json');

    expect(getConfig()).toBeNull();
    expect(hasSetup()).toBe(false);
  });

  it('saves and retrieves actual position', () => {
    saveActualPosition(12, 8);

    const value = getActualPosition();
    expect(value?.page).toBe(12);
    expect(value?.line).toBe(8);
    expect(value?.updatedAt).toBeTypeOf('string');
    expect(hasActualPosition()).toBe(true);
  });

  it('clears actual position only', () => {
    saveConfig({ startDate: '2026-02-19', targetCount: 1 });
    saveActualPosition(22, 3);

    clearActualPosition();

    expect(getActualPosition()).toBeNull();
    expect(getConfig()).toEqual({ startDate: '2026-02-19', targetCount: 1 });
  });

  it('handles corrupted actual position JSON safely', () => {
    localStorage.setItem('quran-tracker-actual-position', '{bad-json');

    expect(getActualPosition()).toBeNull();
    expect(hasActualPosition()).toBe(false);
  });

  it('clears all storage keys', () => {
    saveConfig({ startDate: '2026-02-19', targetCount: 4 });
    saveActualPosition(80, 15);

    clearAll();

    expect(getConfig()).toBeNull();
    expect(getActualPosition()).toBeNull();
    expect(hasSetup()).toBe(false);
    expect(hasActualPosition()).toBe(false);
  });
});
