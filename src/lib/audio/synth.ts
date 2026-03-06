/**
 * Low-level Web Audio API synthesis primitives.
 * All sounds are generated procedurally - no audio files needed.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

export function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function getMasterGain(): GainNode {
  getContext();
  return masterGain!;
}

export function setMasterVolume(v: number) {
  const gain = getMasterGain();
  gain.gain.setValueAtTime(Math.max(0, Math.min(1, v)), getContext().currentTime);
}

export function getMasterVolume(): number {
  return getMasterGain().gain.value;
}

interface ToneOptions {
  type?: OscillatorType;
  freq: number;
  duration: number;
  delay?: number;
  attack?: number;
  decay?: number;
  volume?: number;
  detune?: number;
  freqEnd?: number;
}

/** Play a single tone with envelope */
export function playTone(opts: ToneOptions) {
  const ac = getContext();
  const t = ac.currentTime + (opts.delay ?? 0);

  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(opts.freq, t);
  if (opts.detune) osc.detune.setValueAtTime(opts.detune, t);
  if (opts.freqEnd != null) {
    osc.frequency.linearRampToValueAtTime(opts.freqEnd, t + opts.duration);
  }

  const attack = opts.attack ?? 0.01;
  const decay = opts.decay ?? 0.05;
  const vol = opts.volume ?? 0.3;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + attack);
  gain.gain.setValueAtTime(vol, t + opts.duration - decay);
  gain.gain.linearRampToValueAtTime(0, t + opts.duration);

  osc.connect(gain);
  gain.connect(getMasterGain());

  osc.start(t);
  osc.stop(t + opts.duration + 0.01);
}

/** Play a noise burst (for percussive sounds) */
export function playNoise(opts: {
  duration: number;
  delay?: number;
  volume?: number;
  attack?: number;
  decay?: number;
  highpass?: number;
  lowpass?: number;
}) {
  const ac = getContext();
  const t = ac.currentTime + (opts.delay ?? 0);
  const dur = opts.duration;

  // Create noise buffer
  const bufferSize = Math.ceil(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ac.createBufferSource();
  source.buffer = buffer;

  const gain = ac.createGain();
  const attack = opts.attack ?? 0.005;
  const decay = opts.decay ?? 0.02;
  const vol = opts.volume ?? 0.15;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + attack);
  gain.gain.setValueAtTime(vol, t + dur - decay);
  gain.gain.linearRampToValueAtTime(0, t + dur);

  let node: AudioNode = source;

  if (opts.highpass) {
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = opts.highpass;
    node.connect(hp);
    node = hp;
  }

  if (opts.lowpass) {
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = opts.lowpass;
    node.connect(lp);
    node = lp;
  }

  node.connect(gain);
  gain.connect(getMasterGain());

  source.start(t);
  source.stop(t + dur + 0.01);
}
