import type { GameState, ScoreHistoryEntry, Difficulty } from '../data/types';

// Keys
const PREFS_KEY = 'cellquest_prefs';
const HISTORY_KEY = 'cellquest_score_history';
const SAVE_KEY = 'cellquest_save';
const MAX_HISTORY = 50;

export interface PlayerPrefs {
  name: string;
  lastDifficulty: Difficulty;
  completedLevels: string[];
}

// --- Low-level: Capacitor Preferences with localStorage fallback ---

async function nativeSet(key: string, value: string): Promise<void> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key, value });
    return;
  } catch {
    // Capacitor not available, fall through
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable
  }
}

async function nativeGet(key: string): Promise<string | null> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    // Capacitor not available, fall through
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

async function nativeRemove(key: string): Promise<void> {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.remove({ key });
  } catch {
    // fall through
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// --- Player Preferences ---

export async function savePrefs(prefs: PlayerPrefs): Promise<void> {
  await nativeSet(PREFS_KEY, JSON.stringify(prefs));
}

export async function loadPrefs(): Promise<PlayerPrefs | null> {
  const raw = await nativeGet(PREFS_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (typeof data.name === 'string' && typeof data.lastDifficulty === 'string') {
      return data as PlayerPrefs;
    }
  } catch {
    // malformed
  }
  return null;
}

// --- Score History ---

export async function saveHistory(history: ScoreHistoryEntry[]): Promise<void> {
  const capped = history.slice(-MAX_HISTORY);
  await nativeSet(HISTORY_KEY, JSON.stringify(capped));
}

export async function loadHistory(): Promise<ScoreHistoryEntry[]> {
  const raw = await nativeGet(HISTORY_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data as ScoreHistoryEntry[];
  } catch {
    // malformed
  }
  return [];
}

// --- Game Save (mid-game snapshot) ---

export async function saveGameSnapshot(state: GameState): Promise<void> {
  await nativeSet(SAVE_KEY, JSON.stringify(state));
}

export async function loadGameSnapshot(): Promise<GameState | null> {
  const raw = await nativeGet(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data && typeof data.screen === 'string' && typeof data.difficulty === 'string') {
      return data as GameState;
    }
  } catch {
    // malformed
  }
  return null;
}

export async function clearGameSnapshot(): Promise<void> {
  await nativeRemove(SAVE_KEY);
}

// --- Clear All ---

export async function clearAllData(): Promise<void> {
  await nativeRemove(PREFS_KEY);
  await nativeRemove(HISTORY_KEY);
  await nativeRemove(SAVE_KEY);
}
