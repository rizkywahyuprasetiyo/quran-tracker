export interface TrackerConfig {
  startDate: string;
  targetCount: number; // Target jumlah hatam (1, 2, 3, etc.)
}

const CONFIG_KEY = 'quran-tracker-config';

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

export function hasSetup(): boolean {
  if (!isBrowser()) return false;
  return getConfig() !== null;
}

export function clearAll(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CONFIG_KEY);
}
