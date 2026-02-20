import { type PagePosition } from '../data/pageData';

export interface ActualPositionWithMeta extends PagePosition {
  updatedAt: string;
}

const ACTUAL_POSITION_KEY = 'quran-tracker-actual-position';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Save actual reading position to localStorage
 */
export function saveActualPosition(page: number, line: number): void {
  if (!isBrowser()) return;

  const position: ActualPositionWithMeta = {
    page,
    line,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(ACTUAL_POSITION_KEY, JSON.stringify(position));
}

/**
 * Get actual reading position from localStorage
 */
export function getActualPosition(): ActualPositionWithMeta | null {
  if (!isBrowser()) return null;

  const stored = localStorage.getItem(ACTUAL_POSITION_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Check if user has set actual position
 */
export function hasActualPosition(): boolean {
  if (!isBrowser()) return false;
  return getActualPosition() !== null;
}

/**
 * Clear actual position from localStorage
 */
export function clearActualPosition(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACTUAL_POSITION_KEY);
}
