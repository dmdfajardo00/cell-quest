/**
 * Sound Manager - public API for game audio.
 * Wraps synth sounds with mute/volume controls persisted to localStorage.
 */

import { getContext, setMasterVolume, getMasterVolume } from './synth';
import * as sounds from './sounds';
import {
  startMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
  isMusicPlaying,
} from './bgMusic';

const STORAGE_KEY = 'cellquest_audio';

interface AudioPrefs {
  muted: boolean;
  volume: number;
}

function loadPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { muted: false, volume: 0.5 };
}

function savePrefs(prefs: AudioPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

let prefs = loadPrefs();
let initialized = false;

/** Initialize audio context (must be called from user gesture) */
export function initAudio() {
  if (initialized) return;
  getContext();
  setMasterVolume(prefs.muted ? 0 : prefs.volume);
  initialized = true;
}

/** Play a named sound effect */
export function play(name: keyof typeof sounds, ...args: any[]) {
  if (prefs.muted) return;
  if (!initialized) initAudio();
  const fn = sounds[name];
  if (typeof fn === 'function') {
    (fn as (...a: any[]) => void)(...args);
  }
}

/** Toggle mute on/off */
export function toggleMute(): boolean {
  prefs.muted = !prefs.muted;
  setMasterVolume(prefs.muted ? 0 : prefs.volume);
  savePrefs(prefs);

  // Pause/resume background music with mute state
  if (isMusicPlaying()) {
    if (prefs.muted) {
      pauseMusic();
    } else {
      resumeMusic();
    }
  }

  return prefs.muted;
}

/** Get mute state */
export function isMuted(): boolean {
  return prefs.muted;
}

/** Set volume (0-1) */
export function setVolume(v: number) {
  prefs.volume = Math.max(0, Math.min(1, v));
  if (!prefs.muted) {
    setMasterVolume(prefs.volume);
  }
  savePrefs(prefs);
}

/** Get current volume (0-1) */
export function getVolume(): number {
  return prefs.volume;
}

/** Start background music (delegates to bgMusic module) */
export function startBgMusic() {
  if (prefs.muted) return;
  if (!initialized) initAudio();
  startMusic();
}

/** Stop background music (delegates to bgMusic module) */
export function stopBgMusic() {
  stopMusic();
}
