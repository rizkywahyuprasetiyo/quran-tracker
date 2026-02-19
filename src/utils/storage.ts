export interface TrackerConfig {
  startDate: string;
  targetCount: number; // Target jumlah hatam (1, 2, 3, etc.)
}

export interface TrackerProgress {
  surahNumber: number;
  ayatNumber: number;
  lastUpdated: string;
}

export interface TrackerData {
  config: TrackerConfig;
  progress: TrackerProgress;
}

const CONFIG_KEY = 'quran-tracker-config';
const PROGRESS_KEY = 'quran-tracker-progress';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveConfig(config: TrackerConfig): void {
  if (!isBrowser()) return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getConfig(): TrackerConfig | null {
  if (!isBrowser()) return null;
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveProgress(progress: TrackerProgress): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getProgress(): TrackerProgress | null {
  if (!isBrowser()) return null;
  const stored = localStorage.getItem(PROGRESS_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function hasSetup(): boolean {
  if (!isBrowser()) return false;
  return getConfig() !== null && getProgress() !== null;
}

export function clearAll(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}