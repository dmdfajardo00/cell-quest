/**
 * Sound effect definitions using Web Audio synthesis.
 * Each function plays a complete sound effect procedurally.
 *
 * Musical reference: C4=262, D4=294, E4=330, F4=349, G4=392, A4=440, B4=494, C5=523
 */

import { playTone, playNoise } from './synth';

/** Light UI tap for button presses */
export function tap() {
  playTone({ freq: 800, duration: 0.06, volume: 0.15, type: 'sine' });
}

/** Answer option selection */
export function select() {
  playTone({ freq: 600, duration: 0.08, volume: 0.18, type: 'sine' });
  playTone({ freq: 900, duration: 0.08, delay: 0.04, volume: 0.12, type: 'sine' });
}

/** Bubble pop when opening a checkpoint */
export function pop() {
  playTone({ freq: 400, freqEnd: 600, duration: 0.1, volume: 0.25, type: 'sine' });
  playNoise({ duration: 0.06, delay: 0.02, volume: 0.08, highpass: 2000 });
}

/** Correct answer - cheerful ascending C-E-G chime */
export function correct() {
  playTone({ freq: 523, duration: 0.15, volume: 0.25, type: 'triangle' }); // C5
  playTone({ freq: 659, duration: 0.15, delay: 0.1, volume: 0.25, type: 'triangle' }); // E5
  playTone({ freq: 784, duration: 0.3, delay: 0.2, volume: 0.3, type: 'triangle', decay: 0.15 }); // G5
  // Sparkle overtone
  playTone({ freq: 1568, duration: 0.2, delay: 0.25, volume: 0.08, type: 'sine' });
}

/** Wrong answer first attempt - gentle descending boop */
export function wrong() {
  playTone({ freq: 330, duration: 0.18, volume: 0.2, type: 'triangle' }); // E4
  playTone({ freq: 262, duration: 0.25, delay: 0.12, volume: 0.2, type: 'triangle', decay: 0.1 }); // C4
}

/** Wrong answer second attempt - softer, lower sad tone */
export function wrongFinal() {
  playTone({ freq: 294, duration: 0.2, volume: 0.15, type: 'sine' }); // D4
  playTone({ freq: 247, duration: 0.3, delay: 0.15, volume: 0.15, type: 'sine', decay: 0.15 }); // B3
  playTone({ freq: 220, duration: 0.4, delay: 0.3, volume: 0.1, type: 'sine', decay: 0.2 }); // A3
}

/** Hint sparkle/twinkle */
export function hint() {
  const notes = [1047, 1319, 1568, 1319, 1047]; // C6 E6 G6 E6 C6
  notes.forEach((freq, i) => {
    playTone({
      freq,
      duration: 0.08,
      delay: i * 0.06,
      volume: 0.12,
      type: 'sine',
    });
  });
}

/** Game start - upbeat ascending whoosh */
export function gameStart() {
  // Rising sweep
  playTone({ freq: 300, freqEnd: 800, duration: 0.3, volume: 0.2, type: 'sawtooth' });
  // Chime on top
  playTone({ freq: 784, duration: 0.2, delay: 0.25, volume: 0.2, type: 'triangle' }); // G5
  playTone({ freq: 1047, duration: 0.3, delay: 0.35, volume: 0.25, type: 'triangle', decay: 0.15 }); // C6
  // Noise burst for energy
  playNoise({ duration: 0.15, delay: 0.1, volume: 0.06, highpass: 3000 });
}

/** Advancing to next checkpoint - progress whoosh */
export function advance() {
  playTone({ freq: 440, freqEnd: 660, duration: 0.15, volume: 0.2, type: 'sine' });
  playTone({ freq: 660, freqEnd: 880, duration: 0.15, delay: 0.1, volume: 0.18, type: 'sine' });
  playNoise({ duration: 0.08, delay: 0.05, volume: 0.04, highpass: 4000 });
}

/** Level complete fanfare */
export function levelComplete() {
  // Triumphant arpeggio: C-E-G-C
  const fanfare = [
    { freq: 523, delay: 0, dur: 0.2 },   // C5
    { freq: 659, delay: 0.15, dur: 0.2 },  // E5
    { freq: 784, delay: 0.3, dur: 0.2 },   // G5
    { freq: 1047, delay: 0.45, dur: 0.5 },  // C6
  ];
  fanfare.forEach(n => {
    playTone({ freq: n.freq, duration: n.dur, delay: n.delay, volume: 0.25, type: 'triangle' });
  });
  // Harmony underneath
  playTone({ freq: 262, duration: 0.8, delay: 0.45, volume: 0.12, type: 'sine' }); // C4
  playTone({ freq: 392, duration: 0.8, delay: 0.45, volume: 0.1, type: 'sine' }); // G4
  // Shimmer
  playNoise({ duration: 0.3, delay: 0.5, volume: 0.04, highpass: 5000 });
}

/** Single star ding (called with delay for 1-3 stars) */
export function starDing(delayMs: number = 0) {
  const d = delayMs / 1000;
  playTone({ freq: 1047, duration: 0.15, delay: d, volume: 0.2, type: 'sine' }); // C6
  playTone({ freq: 1568, duration: 0.2, delay: d + 0.05, volume: 0.1, type: 'sine' }); // G6
}

/** Speed bonus quick ascending gliss */
export function speedBonus() {
  for (let i = 0; i < 5; i++) {
    playTone({
      freq: 800 + i * 200,
      duration: 0.06,
      delay: i * 0.04,
      volume: 0.12,
      type: 'sine',
    });
  }
}

/** Streak combo sound (3+ in a row) */
export function streak() {
  playTone({ freq: 880, duration: 0.1, volume: 0.15, type: 'square' }); // A5
  playTone({ freq: 1109, duration: 0.1, delay: 0.06, volume: 0.15, type: 'square' }); // C#6
  playTone({ freq: 1319, duration: 0.15, delay: 0.12, volume: 0.18, type: 'square', decay: 0.08 }); // E6
}

/** Sidebar slide open */
export function slideOpen() {
  playTone({ freq: 300, freqEnd: 500, duration: 0.12, volume: 0.1, type: 'sine' });
}

/** Sidebar slide close */
export function slideClose() {
  playTone({ freq: 500, freqEnd: 300, duration: 0.12, volume: 0.1, type: 'sine' });
}
