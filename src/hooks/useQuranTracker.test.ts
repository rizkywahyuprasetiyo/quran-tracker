import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useQuranTracker } from './useQuranTracker';

const CONFIG_KEY = 'quran-tracker-config';
const ACTUAL_POSITION_KEY = 'quran-tracker-actual-position';

describe('useQuranTracker', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads config and actual position from storage', async () => {
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({ startDate: '2026-02-19T00:00:00.000Z', targetCount: 2 })
    );
    localStorage.setItem(
      ACTUAL_POSITION_KEY,
      JSON.stringify({ page: 20, line: 7, updatedAt: '2026-02-20T00:00:00.000Z' })
    );

    const { result } = renderHook(() => useQuranTracker());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.config).toEqual({
      startDate: '2026-02-19T00:00:00.000Z',
      targetCount: 2,
    });
    expect(result.current.isSetup).toBe(true);
    expect(result.current.hasActualPosition).toBe(true);
    expect(result.current.stats?.actualPosition?.page).toBe(20);
    expect(result.current.stats?.comparison).not.toBeNull();
  });

  it('updates now value every second with timer polling', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-19T00:00:00.000Z'));

    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({ startDate: '2026-02-19T00:00:00.000Z', targetCount: 1 })
    );

    const { result } = renderHook(() => useQuranTracker());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    const initialTime = result.current.now.getTime();

    vi.setSystemTime(new Date('2026-02-19T00:00:01.000Z'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.now.getTime()).toBeGreaterThan(initialTime);
  });

  it('saves and clears actual position through exposed actions', async () => {
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({ startDate: '2026-02-19T00:00:00.000Z', targetCount: 1 })
    );

    const { result } = renderHook(() => useQuranTracker());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.saveActualPosition(33, 10);
    });

    expect(result.current.hasActualPosition).toBe(true);
    expect(result.current.stats?.actualPosition?.page).toBe(33);

    const persisted = JSON.parse(localStorage.getItem(ACTUAL_POSITION_KEY) || '{}');
    expect(persisted.page).toBe(33);
    expect(persisted.line).toBe(10);

    act(() => {
      result.current.clearActualPosition();
    });

    expect(result.current.hasActualPosition).toBe(false);
    expect(result.current.stats?.actualPosition).toBeNull();
    expect(localStorage.getItem(ACTUAL_POSITION_KEY)).toBeNull();
  });
});
