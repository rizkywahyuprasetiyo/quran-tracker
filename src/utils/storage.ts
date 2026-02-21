export interface TrackerConfig {
  startDate: string;
  targetCount: number; // Target jumlah hatam (1, 2, 3, etc.)
}

export interface ActualPosition {
  page: number;
  line: number;
  updatedAt: string;
}

const CONFIG_KEY = 'quran-tracker-config';
const ACTUAL_POSITION_KEY = 'quran-tracker-actual-position';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function saveConfig(config: TrackerConfig): void {
  if (!isBrowser()) return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getConfig(): TrackerConfig | null {
  if (!isBrowser()) return null;
  const stored = localStorage.getItem(CONFIG_KEY);
  return safeParse<TrackerConfig>(stored);
}

export function hasSetup(): boolean {
  if (!isBrowser()) return false;
  return getConfig() !== null;
}

/**
 * Save actual reading position to localStorage
 */
export function saveActualPosition(page: number, line: number): void {
  if (!isBrowser()) return;

  const position: ActualPosition = {
    page,
    line,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(ACTUAL_POSITION_KEY, JSON.stringify(position));
}

/**
 * Get actual reading position from localStorage
 */
export function getActualPosition(): ActualPosition | null {
  if (!isBrowser()) return null;
  const stored = localStorage.getItem(ACTUAL_POSITION_KEY);
  return safeParse<ActualPosition>(stored);
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

export function clearAll(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(ACTUAL_POSITION_KEY);
}
