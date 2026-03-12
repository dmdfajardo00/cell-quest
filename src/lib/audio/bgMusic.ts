/**
 * Background music module — procedurally synthesized ambient loop.
 * Generates a gentle, dreamy, slightly playful cell-biology-themed loop
 * using Web Audio oscillators. No audio files needed.
 *
 * Chord progression: C - Am - F - G (8-bar loop, ~16 seconds per cycle)
 * Layers: soft pad chords + gentle arpeggio picking out chord tones
 */

import { getContext, getMasterGain } from './synth';

// --- Music state ---
let musicGain: GainNode | null = null;
let loopTimer: ReturnType<typeof setInterval> | null = null;
let isPlaying = false;
let isPaused = false;

// Music volume relative to master (kept low so SFX stand out)
const MUSIC_VOLUME = 0.10;

// Chord definitions: root + intervals in Hz
// Using octave 3-4 range for warmth
const CHORDS = [
  // C major: C3, E3, G3, C4
  [131, 165, 196, 262],
  // A minor: A2, C3, E3, A3
  [110, 131, 165, 220],
  // F major: F2, A2, C3, F3
  [87, 110, 131, 175],
  // G major: G2, B2, D3, G3
  [98, 124, 147, 196],
];

// Arpeggio notes per chord (one octave higher, picking chord tones)
const ARPEGGIO_NOTES = [
  // C: C4, E4, G4, C5, G4, E4
  [262, 330, 392, 523, 392, 330],
  // Am: A3, C4, E4, A4, E4, C4
  [220, 262, 330, 440, 330, 262],
  // F: F3, A3, C4, F4, C4, A3
  [175, 220, 262, 349, 262, 220],
  // G: G3, B3, D4, G4, D4, B3
  [196, 247, 294, 392, 294, 247],
];

// Timing
const BEAT_DURATION = 0.5;        // seconds per beat
const BEATS_PER_CHORD = 8;       // 8 beats = 4 seconds per chord
const CHORD_DURATION = BEAT_DURATION * BEATS_PER_CHORD; // 4 seconds
const LOOP_DURATION = CHORD_DURATION * CHORDS.length;    // 16 seconds

/**
 * Get or create the music-specific gain node.
 * This is a submix under the master gain so muting master mutes everything.
 */
function getMusicGain(): GainNode {
  if (!musicGain) {
    const ac = getContext();
    musicGain = ac.createGain();
    musicGain.gain.value = MUSIC_VOLUME;
    musicGain.connect(getMasterGain());
  }
  return musicGain;
}

/**
 * Schedule one full loop cycle (all 4 chords) starting at `startTime`.
 */
function scheduleLoop(startTime: number) {
  const ac = getContext();
  const dest = getMusicGain();

  CHORDS.forEach((chord, chordIdx) => {
    const chordStart = startTime + chordIdx * CHORD_DURATION;

    // --- Layer 1: Pad (long sustained sine+triangle chords) ---
    chord.forEach((freq) => {
      // Sine layer (fundamental warmth)
      const osc1 = ac.createOscillator();
      const gain1 = ac.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = freq;
      // Slight detune for richness
      osc1.detune.value = Math.random() * 4 - 2;

      const padVol = 0.12;
      const attack = 0.8;
      const release = 0.8;
      gain1.gain.setValueAtTime(0, chordStart);
      gain1.gain.linearRampToValueAtTime(padVol, chordStart + attack);
      gain1.gain.setValueAtTime(padVol, chordStart + CHORD_DURATION - release);
      gain1.gain.linearRampToValueAtTime(0, chordStart + CHORD_DURATION);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(chordStart);
      osc1.stop(chordStart + CHORD_DURATION + 0.05);

      // Triangle layer (adds gentle shimmer)
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2; // octave up
      osc2.detune.value = Math.random() * 6 - 3;

      const shimmerVol = 0.03;
      gain2.gain.setValueAtTime(0, chordStart);
      gain2.gain.linearRampToValueAtTime(shimmerVol, chordStart + attack);
      gain2.gain.setValueAtTime(shimmerVol, chordStart + CHORD_DURATION - release);
      gain2.gain.linearRampToValueAtTime(0, chordStart + CHORD_DURATION);

      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(chordStart);
      osc2.stop(chordStart + CHORD_DURATION + 0.05);
    });

    // --- Layer 2: Gentle arpeggio ---
    const arpNotes = ARPEGGIO_NOTES[chordIdx];
    arpNotes.forEach((freq, noteIdx) => {
      const noteStart = chordStart + noteIdx * (CHORD_DURATION / arpNotes.length);
      const noteDur = 0.6;

      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const arpVol = 0.06;
      const arpAttack = 0.02;
      const arpRelease = 0.35;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(arpVol, noteStart + arpAttack);
      gain.gain.setValueAtTime(arpVol, noteStart + noteDur - arpRelease);
      gain.gain.linearRampToValueAtTime(0, noteStart + noteDur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(noteStart);
      osc.stop(noteStart + noteDur + 0.05);
    });

    // --- Layer 3: Subtle bass note (root of each chord, very quiet) ---
    {
      const bassFreq = chord[0] / 2; // one octave below root
      const bassOsc = ac.createOscillator();
      const bassGain = ac.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.value = bassFreq;

      const bassVol = 0.06;
      bassGain.gain.setValueAtTime(0, chordStart);
      bassGain.gain.linearRampToValueAtTime(bassVol, chordStart + 0.5);
      bassGain.gain.setValueAtTime(bassVol, chordStart + CHORD_DURATION - 0.5);
      bassGain.gain.linearRampToValueAtTime(0, chordStart + CHORD_DURATION);

      bassOsc.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(chordStart);
      bassOsc.stop(chordStart + CHORD_DURATION + 0.05);
    }
  });
}

/**
 * Start the background music loop.
 * Schedules loops ahead of time using setInterval for seamless playback.
 */
export function startMusic() {
  if (isPlaying) return;

  const ac = getContext();
  getMusicGain(); // ensure created
  isPlaying = true;
  isPaused = false;

  // Schedule the first loop immediately
  let nextLoopTime = ac.currentTime + 0.1;
  scheduleLoop(nextLoopTime);

  // Pre-schedule the next loop before the current one ends
  // Check every half-loop to stay ahead
  loopTimer = setInterval(() => {
    if (isPaused || !isPlaying) return;

    const now = ac.currentTime;
    // If we're within 2 seconds of the next loop start, schedule it
    if (now >= nextLoopTime + LOOP_DURATION - 2) {
      nextLoopTime += LOOP_DURATION;
      scheduleLoop(nextLoopTime);
    }
  }, 2000);
}

/**
 * Stop the music entirely and clean up.
 */
export function stopMusic() {
  if (!isPlaying) return;

  isPlaying = false;
  isPaused = false;

  if (loopTimer !== null) {
    clearInterval(loopTimer);
    loopTimer = null;
  }

  // Fade out and disconnect the music gain
  if (musicGain) {
    const ac = getContext();
    const now = ac.currentTime;
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(0, now + 0.5);

    // Disconnect after fade completes to stop all scheduled nodes
    const oldGain = musicGain;
    setTimeout(() => {
      oldGain.disconnect();
    }, 600);
    musicGain = null;
  }
}

/**
 * Pause the music (fade to silence but keep the loop timer alive).
 */
export function pauseMusic() {
  if (!isPlaying || isPaused) return;
  isPaused = true;

  if (musicGain) {
    const ac = getContext();
    const now = ac.currentTime;
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.linearRampToValueAtTime(0, now + 0.3);
  }
}

/**
 * Resume the music after pause.
 */
export function resumeMusic() {
  if (!isPlaying || !isPaused) return;
  isPaused = false;

  if (musicGain) {
    const ac = getContext();
    const now = ac.currentTime;
    musicGain.gain.setValueAtTime(0, now);
    musicGain.gain.linearRampToValueAtTime(MUSIC_VOLUME, now + 0.3);
  }
}

/**
 * Whether music is currently playing (even if paused).
 */
export function isMusicPlaying(): boolean {
  return isPlaying;
}
