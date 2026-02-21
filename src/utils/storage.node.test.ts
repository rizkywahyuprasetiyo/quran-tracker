// @vitest-environment node

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
import {
  clearActualPosition as clearActualPositionLegacy,
  getActualPosition as getActualPositionLegacy,
  hasActualPosition as hasActualPositionLegacy,
  saveActualPosition as saveActualPositionLegacy,
} from './actualPosition';

describe('storage utils (non-browser safety)', () => {
  it('returns fallback values and no-ops safely', () => {
    expect(getConfig()).toBeNull();
    expect(getActualPosition()).toBeNull();
    expect(hasSetup()).toBe(false);
    expect(hasActualPosition()).toBe(false);

    expect(() => saveConfig({ startDate: '2026-02-19', targetCount: 1 })).not.toThrow();
    expect(() => saveActualPosition(1, 1)).not.toThrow();
    expect(() => clearActualPosition()).not.toThrow();
    expect(() => clearAll()).not.toThrow();
  });

  it('keeps legacy actualPosition utility safe in non-browser env', () => {
    expect(getActualPositionLegacy()).toBeNull();
    expect(hasActualPositionLegacy()).toBe(false);

    expect(() => saveActualPositionLegacy(1, 1)).not.toThrow();
    expect(() => clearActualPositionLegacy()).not.toThrow();
  });
});
