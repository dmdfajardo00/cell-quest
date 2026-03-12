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

/** Bubble pop variation - deeper, wetter pop */
export function bubblePop() {
  playTone({ freq: 200, freqEnd: 500, duration: 0.08, volume: 0.2, type: 'sine' });
  playTone({ freq: 500, freqEnd: 800, duration: 0.06, delay: 0.04, volume: 0.15, type: 'sine' });
  playNoise({ duration: 0.05, delay: 0.03, volume: 0.1, highpass: 3000 });
  // Extra resonance
  playTone({ freq: 300, duration: 0.12, delay: 0.06, volume: 0.08, type: 'triangle' });
}

/** Correct answer - celebratory ascending chime with sparkle trill */
export function correct() {
  // Main ascending arpeggio C-E-G-C
  playTone({ freq: 523, duration: 0.12, volume: 0.25, type: 'triangle' }); // C5
  playTone({ freq: 659, duration: 0.12, delay: 0.08, volume: 0.25, type: 'triangle' }); // E5
  playTone({ freq: 784, duration: 0.15, delay: 0.16, volume: 0.28, type: 'triangle' }); // G5
  playTone({ freq: 1047, duration: 0.3, delay: 0.24, volume: 0.3, type: 'triangle', decay: 0.15 }); // C6
  // Sparkle trill on top
  playTone({ freq: 1568, duration: 0.08, delay: 0.28, volume: 0.1, type: 'sine' }); // G6
  playTone({ freq: 2093, duration: 0.08, delay: 0.32, volume: 0.08, type: 'sine' }); // C7
  playTone({ freq: 1568, duration: 0.1, delay: 0.36, volume: 0.06, type: 'sine' }); // G6
  // Victory shimmer
  playNoise({ duration: 0.1, delay: 0.3, volume: 0.04, highpass: 6000 });
}

/** Wrong answer first attempt - cartoon bonk */
export function wrong() {
  // Low thud
  playTone({ freq: 100, freqEnd: 60, duration: 0.15, volume: 0.3, type: 'sine' });
  // Comic "bonk" high ping
  playTone({ freq: 800, freqEnd: 400, duration: 0.12, delay: 0.02, volume: 0.15, type: 'square' });
  // Impact noise
  playNoise({ duration: 0.08, volume: 0.12, highpass: 800, lowpass: 3000 });
}

/** Wrong answer final - womp womp sad trombone */
export function wompWomp() {
  // First "womp" - descending slide
  playTone({ freq: 350, freqEnd: 300, duration: 0.35, volume: 0.2, type: 'sawtooth' });
  playTone({ freq: 350, freqEnd: 300, duration: 0.35, volume: 0.1, type: 'triangle' });
  // Second "womp" - lower descending slide
  playTone({ freq: 300, freqEnd: 220, duration: 0.45, delay: 0.35, volume: 0.2, type: 'sawtooth' });
  playTone({ freq: 300, freqEnd: 220, duration: 0.45, delay: 0.35, volume: 0.1, type: 'triangle' });
  // Sad trailing note
  playTone({ freq: 200, freqEnd: 160, duration: 0.3, delay: 0.75, volume: 0.1, type: 'sawtooth', decay: 0.15 });
}

/** Kept for backwards compat - redirects to wompWomp */
export function wrongFinal() {
  wompWomp();
}

/** Boing sound for retry - springy bounce */
export function boing() {
  // Rising spring
  playTone({ freq: 200, freqEnd: 600, duration: 0.15, volume: 0.2, type: 'sine' });
  // Bounce back down
  playTone({ freq: 600, freqEnd: 350, duration: 0.1, delay: 0.12, volume: 0.18, type: 'sine' });
  // Small bounce
  playTone({ freq: 400, freqEnd: 450, duration: 0.08, delay: 0.2, volume: 0.12, type: 'sine' });
  // Springy overtone
  playTone({ freq: 800, freqEnd: 1200, duration: 0.1, delay: 0.05, volume: 0.06, type: 'square' });
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

/** Silly victory jingle - extended celebration for completing all levels */
export function sillyVictory() {
  // Grand opening chord
  playTone({ freq: 262, duration: 0.3, volume: 0.2, type: 'triangle' }); // C4
  playTone({ freq: 330, duration: 0.3, volume: 0.18, type: 'triangle' }); // E4
  playTone({ freq: 392, duration: 0.3, volume: 0.18, type: 'triangle' }); // G4

  // Playful ascending melody
  const melody = [
    { freq: 523, delay: 0.3, dur: 0.15 },  // C5
    { freq: 587, delay: 0.42, dur: 0.15 },  // D5
    { freq: 659, delay: 0.54, dur: 0.15 },  // E5
    { freq: 784, delay: 0.66, dur: 0.15 },  // G5
    { freq: 880, delay: 0.78, dur: 0.15 },  // A5
    { freq: 1047, delay: 0.9, dur: 0.25 },  // C6
  ];
  melody.forEach(n => {
    playTone({ freq: n.freq, duration: n.dur, delay: n.delay, volume: 0.22, type: 'triangle' });
  });

  // Triumphant final chord
  playTone({ freq: 523, duration: 0.6, delay: 1.15, volume: 0.2, type: 'triangle' }); // C5
  playTone({ freq: 659, duration: 0.6, delay: 1.15, volume: 0.18, type: 'triangle' }); // E5
  playTone({ freq: 784, duration: 0.6, delay: 1.15, volume: 0.18, type: 'triangle' }); // G5
  playTone({ freq: 1047, duration: 0.6, delay: 1.15, volume: 0.2, type: 'triangle' }); // C6

  // Silly bouncy overtones
  playTone({ freq: 1200, freqEnd: 1600, duration: 0.1, delay: 1.0, volume: 0.08, type: 'sine' });
  playTone({ freq: 1600, freqEnd: 1200, duration: 0.1, delay: 1.08, volume: 0.06, type: 'sine' });

  // Confetti shimmer
  playNoise({ duration: 0.4, delay: 1.2, volume: 0.05, highpass: 6000 });
  playNoise({ duration: 0.3, delay: 1.5, volume: 0.03, highpass: 8000 });
}

/** Confetti burst sound effect */
export function confetti() {
  playNoise({ duration: 0.15, volume: 0.1, highpass: 4000 });
  playTone({ freq: 1200, freqEnd: 1800, duration: 0.1, volume: 0.08, type: 'sine' });
  playTone({ freq: 1500, freqEnd: 2000, duration: 0.08, delay: 0.05, volume: 0.06, type: 'sine' });
}
