// Web Audio API medical-grade notification chime synthesizer

let audioCtx: AudioContext | null = null;
let activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

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

/**
 * Stop and clear all active audio nodes immediately.
 */
export function detenerAlerta() {
  activeNodes.forEach(({ osc, gain }) => {
    try {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    } catch {
      // Ignore if already stopped
    }
  });
  activeNodes = [];
}

/**
 * Play a single pure sine tone with smooth attack and decay envelopes.
 */
function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  maxGain = 0.09,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pure sine wave for smooth, non-startling, pleasant audio feedback
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft attack (20ms) and exponential decay envelope
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(maxGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);

  activeNodes.push({ osc, gain });
}

/**
 * Gentle 2-note warm chime (C5 -> E5) for DENGUE_ALARMA
 */
export function reproducirAlertaWarning() {
  const ctx = getAudioContext();
  if (!ctx) return;

  detenerAlerta();

  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.25, 0.08); // C5
  playTone(ctx, 659.25, now + 0.18, 0.35, 0.08); // E5
}

/**
 * Soft 3-note medical notification sequence (C5 -> E5 -> G5) for DENGUE_GRAVE
 */
export function reproducirAlertaEmergency() {
  const ctx = getAudioContext();
  if (!ctx) return;

  detenerAlerta();

  const now = ctx.currentTime;

  // Pattern 1: Soft medical triad chime
  playTone(ctx, 523.25, now, 0.2, 0.09); // C5
  playTone(ctx, 659.25, now + 0.15, 0.2, 0.09); // E5
  playTone(ctx, 783.99, now + 0.3, 0.35, 0.11); // G5

  // Gentle repeat after short pause
  playTone(ctx, 523.25, now + 0.75, 0.2, 0.08); // C5
  playTone(ctx, 659.25, now + 0.9, 0.2, 0.08); // E5
  playTone(ctx, 783.99, now + 1.05, 0.35, 0.1); // G5
}
