// Synthesize alert tones using Web Audio API in foreground

let audioCtx: AudioContext | null = null;
let activeOscillator: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function reproducirAlertaWarning() {
  const ctx = getAudioContext();
  if (!ctx) return;

  detenerAlerta();

  // Tono intermitente 800Hz (3 pulsos)
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);

  // Pulso 1
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.setValueAtTime(0, now + 0.2);

  // Pulso 2
  gain.gain.setValueAtTime(0.3, now + 0.3);
  gain.gain.setValueAtTime(0, now + 0.5);

  // Pulso 3
  gain.gain.setValueAtTime(0.3, now + 0.6);
  gain.gain.setValueAtTime(0, now + 0.8);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.9);

  activeOscillator = osc;
  activeGain = gain;
}

export function reproducirAlertaEmergency() {
  const ctx = getAudioContext();
  if (!ctx) return;

  detenerAlerta();

  // Siren tone (alternating 1000Hz - 1400Hz)
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';

  // Modulation
  osc.frequency.setValueAtTime(1000, now);
  osc.frequency.linearRampToValueAtTime(1400, now + 0.25);
  osc.frequency.linearRampToValueAtTime(1000, now + 0.5);
  osc.frequency.linearRampToValueAtTime(1400, now + 0.75);
  osc.frequency.linearRampToValueAtTime(1000, now + 1.0);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 2.5);
  gain.gain.linearRampToValueAtTime(0, now + 3.0);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 3.0);

  activeOscillator = osc;
  activeGain = gain;
}

export function detenerAlerta() {
  if (activeOscillator) {
    try {
      activeOscillator.stop();
      activeOscillator.disconnect();
    } catch {
      // Ignore if already stopped
    }
    activeOscillator = null;
  }
  if (activeGain) {
    try {
      activeGain.disconnect();
    } catch {
      // Ignore
    }
    activeGain = null;
  }
}
