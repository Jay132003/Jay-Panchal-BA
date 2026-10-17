/**
 * Audio engine for the "On rotation" turntable. One <audio> element plays
 * Spotify's 30-second preview clips; a small Web Audio graph adds the vinyl
 * touches — the pitch-bending spin-up / spin-down, a needle-drop crackle — and
 * an analyser so the visuals can move with the music.
 *
 * `wantsPlay` is the single source of truth for "should the record be
 * playing". It flips the instant the visitor asks, so the UI never waits on
 * the network and can never drift from what was asked.
 */

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

type PlayOptions = {
  /** Seek to this fraction of the clip when the needle lands. */
  at?: number;
  /** Hold the sound back this long (ms) while the tonearm swings over. */
  delayMs?: number;
  /** Skip the spin-up (e.g. rolling straight into the next song). */
  instant?: boolean;
};

const SPIN_UP_MS = 520;
const SPIN_DOWN_MS = 560;
const RATE_STOPPED = 0.32; // playback rate the spin-down sags to before pausing
const RATE_START = 0.5; // ...and where the spin-up begins

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export class TurntableAudio {
  readonly audio: HTMLAudioElement;
  status: AudioStatus = 'idle';
  wantsPlay = false;
  /** play() was refused by the browser (no user gesture yet). */
  blocked = false;
  /** Bumped on every change, for useSyncExternalStore. */
  version = 0;
  onEnded: (() => void) | null = null;
  onError: (() => void) | null = null;

  private readonly gentle: boolean;
  private readonly prefetcher: HTMLAudioElement;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private bins: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  private crackleBuffer: AudioBuffer | null = null;
  private listeners = new Set<() => void>();
  private rateRaf = 0;
  private startTimer = 0;
  private pauseTimer = 0;
  private levelSmooth = 0;

  constructor({ gentle = false } = {}) {
    this.gentle = gentle;
    this.audio = this.makeAudio();
    this.prefetcher = this.makeAudio();

    const a = this.audio;
    a.addEventListener('playing', () => this.setStatus(this.wantsPlay ? 'playing' : 'paused'));
    a.addEventListener('waiting', () => this.wantsPlay && this.setStatus('loading'));
    a.addEventListener('pause', () => !this.wantsPlay && this.status !== 'idle' && this.setStatus('paused'));
    a.addEventListener('ended', () => this.onEnded?.());
    a.addEventListener('error', () => {
      if (!a.getAttribute('src')) return;
      this.setStatus('error');
      this.onError?.();
    });
  }

  private makeAudio() {
    const a = new Audio();
    a.crossOrigin = 'anonymous'; // lets the analyser read Spotify's CDN audio
    a.preload = 'auto';
    a.preservesPitch = false; // so speed changes bend the pitch like a real platter
    return a;
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private emit() {
    this.version++;
    this.listeners.forEach((fn) => fn());
  }

  private setStatus(status: AudioStatus) {
    if (this.status === status) return;
    this.status = status;
    this.emit();
  }

  get progress() {
    const d = this.audio.duration;
    return d > 0 && Number.isFinite(d) ? Math.min(1, this.audio.currentTime / d) : 0;
  }
  get duration() {
    const d = this.audio.duration;
    return d > 0 && Number.isFinite(d) ? d : 0;
  }

  /** Cue a clip. With `play`, it keeps the record spinning straight into it. */
  load(src: string, play = false) {
    this.clearTimers();
    this.blocked = false;
    if (this.audio.getAttribute('src') !== src) {
      this.audio.src = src;
      this.audio.load();
    }
    if (play) {
      this.wantsPlay = true;
      this.setStatus('loading');
      this.start({ instant: true });
    } else {
      this.wantsPlay = false;
      this.audio.pause();
      this.status = 'idle';
    }
    this.emit();
  }

  /** Warm the browser cache for the clip that's likely next. */
  prefetch(src: string) {
    if (this.prefetcher.getAttribute('src') !== src) this.prefetcher.src = src;
  }

  play(opts: PlayOptions = {}) {
    this.ensureGraph();
    void this.ctx?.resume();
    this.clearTimers();
    this.wantsPlay = true;
    this.blocked = false;
    if (this.status !== 'playing') this.setStatus('loading');
    this.emit();
    this.start(opts);
  }

  private start({ at, delayMs = 0, instant = false }: PlayOptions) {
    const a = this.audio;
    const smooth = !instant && !this.gentle;
    const resumeAt = at != null && this.duration ? at * this.duration : null;

    // Start the element now, inside the click (Safari only allows that), but
    // silently — the sound arrives when the needle touches down.
    if (smooth) {
      this.setGain(0, 0);
      this.setRate(RATE_START);
    } else {
      this.setGain(1, 0.04);
      this.setRate(1);
    }
    a.play().catch((err: Error) => {
      if (err.name === 'AbortError' || !this.wantsPlay) return; // superseded by a newer command
      this.wantsPlay = false;
      this.blocked = true;
      this.setStatus('paused');
      this.emit();
    });

    const land = () => {
      if (!this.wantsPlay) return;
      if (resumeAt != null) a.currentTime = resumeAt;
      else if (smooth && delayMs > 0) a.currentTime = Math.max(0, a.currentTime - delayMs / 1000);
      if (smooth) {
        this.setGain(1, 0.18);
        this.rampRate(1, SPIN_UP_MS);
      }
    };
    if (delayMs > 0) this.startTimer = window.setTimeout(land, delayMs);
    else land();
  }

  /** Lift the needle: the record winds down (pitch sags, sound fades), then stops. */
  pause() {
    if (!this.wantsPlay && this.audio.paused) return;
    this.clearTimers();
    this.wantsPlay = false;
    this.setStatus('paused');
    this.emit();
    if (this.gentle || this.audio.paused || !this.gain) {
      this.audio.pause();
      return;
    }
    this.setGain(0, SPIN_DOWN_MS / 1000);
    this.rampRate(RATE_STOPPED, SPIN_DOWN_MS);
    this.pauseTimer = window.setTimeout(() => {
      if (!this.wantsPlay) this.audio.pause();
    }, SPIN_DOWN_MS + 40);
  }

  seek(fraction: number) {
    if (this.duration) this.audio.currentTime = Math.min(0.999, Math.max(0, fraction)) * this.duration;
  }

  /** 0–1 loudness of the low end, smoothed — drives the glow and bounce. */
  level() {
    if (!this.analyser || this.status !== 'playing') {
      this.levelSmooth *= 0.9;
      return this.levelSmooth;
    }
    this.analyser.getByteFrequencyData(this.bins);
    let sum = 0;
    for (let i = 1; i < 12; i++) sum += this.bins[i];
    const v = sum / (11 * 255);
    this.levelSmooth += (v - this.levelSmooth) * (v > this.levelSmooth ? 0.5 : 0.12);
    return this.levelSmooth;
  }

  /** Fill `out` with a mirrored spectrum (bass in the middle) in 0–1. Call after level(). */
  bands(out: Float32Array) {
    const n = out.length;
    const mid = (n - 1) / 2;
    const usable = this.bins.length * 0.62;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(i - mid) / mid; // 0 at centre → 1 at the edges
      const bin = Math.min(this.bins.length - 1, Math.floor(1 + d ** 1.4 * usable));
      out[i] = this.analyser ? this.bins[bin] / 255 : 0;
    }
  }

  /** The soft thump-and-crackle of a stylus meeting vinyl. */
  crackle(volume = 0.09) {
    if (this.gentle) return;
    this.ensureGraph();
    const ctx = this.ctx;
    if (!ctx) return;
    if (!this.crackleBuffer) this.crackleBuffer = makeCrackle(ctx);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = volume;
    src.buffer = this.crackleBuffer;
    src.connect(g).connect(ctx.destination);
    src.start();
  }

  destroy() {
    this.clearTimers();
    this.wantsPlay = false;
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.prefetcher.removeAttribute('src');
    this.listeners.clear();
    void this.ctx?.close();
  }

  private ensureGraph() {
    if (this.ctx) return;
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(this.audio);
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(gain).connect(analyser).connect(ctx.destination);
      this.ctx = ctx;
      this.gain = gain;
      this.analyser = analyser;
      this.bins = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      /* No Web Audio — plain playback still works. */
    }
  }

  private setGain(value: number, seconds: number) {
    const g = this.gain?.gain;
    if (!g || !this.ctx) {
      this.audio.volume = value;
      return;
    }
    const now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    if (seconds <= 0) g.setValueAtTime(value, now);
    else g.linearRampToValueAtTime(value, now + seconds);
  }

  private setRate(rate: number) {
    cancelAnimationFrame(this.rateRaf);
    this.audio.playbackRate = rate;
  }

  private rampRate(to: number, ms: number) {
    cancelAnimationFrame(this.rateRaf);
    const from = this.audio.playbackRate;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      this.audio.playbackRate = from + (to - from) * easeOut(t);
      if (t < 1) this.rateRaf = requestAnimationFrame(step);
    };
    this.rateRaf = requestAnimationFrame(step);
  }

  private clearTimers() {
    window.clearTimeout(this.startTimer);
    window.clearTimeout(this.pauseTimer);
    cancelAnimationFrame(this.rateRaf);
  }
}

/** ~0.7s of synthetic vinyl: a low thump, a burst of pops, a little hiss. */
function makeCrackle(ctx: AudioContext) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * 0.7);
  const buf = ctx.createBuffer(1, len, rate);
  const data = buf.getChannelData(0);
  let pop = 0;
  for (let i = 0; i < len; i++) {
    const t = i / rate;
    const thump = Math.sin(2 * Math.PI * 58 * t) * Math.exp(-t * 38) * 0.9;
    if (Math.random() < 0.0025 * Math.exp(-t * 3)) pop = (Math.random() * 2 - 1) * 0.8;
    pop *= 0.82;
    const hiss = (Math.random() * 2 - 1) * 0.035 * Math.exp(-t * 5);
    data[i] = thump + pop + hiss;
  }
  return buf;
}
