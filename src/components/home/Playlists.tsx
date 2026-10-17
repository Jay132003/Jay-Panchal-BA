import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type Ref,
} from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowUpRight, ChevronUp, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import {
  PLAYLISTS,
  fmtDuration,
  playlistUrl,
  previewUrl,
  trackArt,
  trackUrl,
  type Playlist,
  type PlaylistTrack,
} from '../../data/playlists';
import { TurntableAudio } from '../../lib/turntableAudio';
import { cn } from '../../lib/utils';
import { Reveal } from './Panel';
import { BoxLabel } from './Bento';

/* ── Deck geometry ─────────────────────────────────────────────
   Everything on the deck is drawn in "record units": the disc has a radius
   of 100 and the platter's centre is the origin. */
const VB = { x: -140, y: -178, w: 280, h: 296 };
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const PLATTER_R = 112;
const ARC_R = 106;
const R_OUT = 95; // outermost groove — where a song starts
const R_IN = 40; // run-out groove, just outside the label
const R_REST = 110; // needle parked on the platter rim, off the record
const PIVOT = { x: 85, y: -146 };
const SPIN_DEG_PER_S = 30; // deliberately slow: one lazy turn every 12s
const ARM_TRAVEL_MS = 480; // tonearm swing from rest to the groove before the sound lands
const WAVE_BARS = 44;

// The tonearm is drawn pointing along +x from its pivot; the headshell hangs
// off a bend in the tube. NEEDLE is the stylus tip in that local frame.
const HEAD_JOINT = { x: 104, y: -2 };
const HEAD_ANGLE = Math.atan2(14, 26);
const NEEDLE = {
  x: HEAD_JOINT.x + 31 * Math.cos(HEAD_ANGLE),
  y: HEAD_JOINT.y + 31 * Math.sin(HEAD_ANGLE),
};
const ARM_LEN = Math.hypot(NEEDLE.x, NEEDLE.y);
const ARM_BETA = Math.atan2(NEEDLE.y, NEEDLE.x);
const PIVOT_DIST = Math.hypot(PIVOT.x, PIVOT.y);
const PIVOT_TO_CENTRE = Math.atan2(-PIVOT.y, -PIVOT.x);

/** Needle direction (radians, from the pivot) that puts the stylus at radius r. */
function needleAngleFor(r: number) {
  const cos = (PIVOT_DIST ** 2 + ARM_LEN ** 2 - r ** 2) / (2 * PIVOT_DIST * ARM_LEN);
  return PIVOT_TO_CENTRE + Math.acos(Math.min(1, Math.max(-1, cos)));
}
/** Stylus tip position for a needle direction. */
function needlePoint(angle: number) {
  return { x: PIVOT.x + ARM_LEN * Math.cos(angle), y: PIVOT.y + ARM_LEN * Math.sin(angle) };
}
const ANGLE_IN = needleAngleFor(R_IN);
const ANGLE_REST = needleAngleFor(R_REST);
const ANGLE_MAX = needleAngleFor(PLATTER_R + 14);

const RAD = 180 / Math.PI;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const grooveAngle = (p: number) => needleAngleFor(R_OUT + (R_IN - R_OUT) * p);

/** Progress ring path: clockwise from 12 o'clock. */
function arcPath(p: number) {
  if (p <= 0.0005) return 'M 0 0';
  if (p >= 0.9995) {
    return `M 0 ${-ARC_R} A ${ARC_R} ${ARC_R} 0 1 1 0 ${ARC_R} A ${ARC_R} ${ARC_R} 0 1 1 0 ${-ARC_R}`;
  }
  const a = p * Math.PI * 2;
  const x = ARC_R * Math.sin(a);
  const y = -ARC_R * Math.cos(a);
  return `M 0 ${-ARC_R} A ${ARC_R} ${ARC_R} 0 ${p > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
}

function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Deterministic resting waveform for a song, so it doesn't reshuffle on re-render. */
function waveform(seed: string, count = WAVE_BARS) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => {
    const swell = Math.sin((i / (count - 1)) * Math.PI); // louder through the middle
    return 0.22 + 0.78 * Math.min(1, rand() * 0.75 + swell * 0.45 * rand() + (rand() > 0.88 ? 0.4 : 0));
  });
}

/** Screen → deck-unit coordinates. */
function toDeck(svg: SVGSVGElement, e: { clientX: number; clientY: number }) {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  return { x: pt.x, y: pt.y };
}

/* ── Album colour, for the glow under the record ── */
type RGB = [number, number, number];
const FALLBACK_GLOW: RGB = [150, 150, 150];
const colourCache = new Map<string, Promise<RGB>>();
/** A vivid-leaning average colour of an image (Spotify's CDN allows canvas reads). */
function albumColour(url: string): Promise<RGB> {
  let job = colourCache.get(url);
  if (!job) {
    job = new Promise<RGB>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const size = 24;
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = size;
          const g = canvas.getContext('2d', { willReadFrequently: true });
          if (!g) return resolve(FALLBACK_GLOW);
          g.drawImage(img, 0, 0, size, size);
          const d = g.getImageData(0, 0, size, size).data;
          let r = 0, gr = 0, b = 0, w = 0;
          for (let i = 0; i < d.length; i += 4) {
            const max = Math.max(d[i], d[i + 1], d[i + 2]);
            const min = Math.min(d[i], d[i + 1], d[i + 2]);
            const sat = max ? (max - min) / max : 0;
            const lum = max / 255;
            const weight = sat * sat * (lum > 0.18 && lum < 0.96 ? 1 : 0.08) + 0.015;
            r += d[i] * weight;
            gr += d[i + 1] * weight;
            b += d[i + 2] * weight;
            w += weight;
          }
          resolve([r / w, gr / w, b / w]);
        } catch {
          resolve(FALLBACK_GLOW);
        }
      };
      img.onerror = () => resolve(FALLBACK_GLOW);
      img.src = url;
    });
    colourCache.set(url, job);
  }
  return job;
}

const byId = (id: string) => PLAYLISTS.find((p) => p.id === id) as Playlist;
const ease = [0.22, 1, 0.36, 1] as const;

/* ── Play order ────────────────────────────────────────────────
   Each record starts on its pinned song (`startsWith`), then shuffles with no
   repeats until every song has played, then reshuffles. `order` is the whole
   listening history plus what's queued; `pos` is where the needle is in it,
   so "previous" walks back through what was actually heard. */
type Shuffle = { order: number[]; pos: number };

/** Indices 0…n-1 in random order, never starting with `avoid`. */
function shuffleIndices(n: number, avoid = -1): number[] {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (n > 1 && a[0] === avoid) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function newShuffle(p: Playlist): Shuffle {
  const n = p.tracks.length;
  const pinned = p.startsWith ? p.tracks.findIndex((t) => t[0] === p.startsWith) : -1;
  if (pinned < 0) return { order: shuffleIndices(n), pos: 0 };
  return { order: [pinned, ...shuffleIndices(n).filter((i) => i !== pinned)], pos: 0 };
}

/** Move one step through the play order; going past the end deals a fresh shuffle. */
function stepShuffle(s: Shuffle, n: number, dir: 1 | -1): number {
  if (dir < 0) {
    s.pos = Math.max(0, s.pos - 1);
  } else {
    s.pos += 1;
    if (s.pos >= s.order.length) s.order.push(...shuffleIndices(n, s.order[s.order.length - 1]));
  }
  return s.order[s.pos];
}

/** A song picked from the tracklist plays next-in-history; shuffle carries on after it. */
function jumpShuffle(s: Shuffle, i: number) {
  const later = s.order.indexOf(i, s.pos + 1);
  if (later >= 0) s.order.splice(later, 1); // don't hear it again later in this round
  s.order.splice(s.pos + 1, 0, i);
  s.pos += 1;
}
const noopSubscribe = () => () => {};

/** `value`, but only once it has stayed true for `ms` — hides sub-second flickers. */
function useSettled(value: boolean, ms: number) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!value) {
      setSettled(false);
      return;
    }
    const t = window.setTimeout(() => setSettled(true), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return value && settled;
}

/* ────────────────────────────────────────────────────────────── */

/** "On rotation" — Jay's three Spotify playlists as records on a turntable.
 *  Drop the needle to play, lift it to pause, click a side record to swap. */
export default function Playlists() {
  const gentle = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  /* ── Audio engine (owns playback; its `wantsPlay` is the source of truth) ── */
  const [engine, setEngine] = useState<TurntableAudio | null>(null);
  useEffect(() => {
    const e = new TurntableAudio({ gentle });
    setEngine(e);
    return () => e.destroy();
  }, [gentle]);
  useSyncExternalStore(engine ? engine.subscribe : noopSubscribe, () => engine?.version ?? 0);
  const engineRef = useRef(engine);
  engineRef.current = engine;
  const wantsPlay = engine?.wantsPlay ?? false;
  const audioStatus = engine?.status ?? 'idle';
  const cueing = useSettled(wantsPlay && audioStatus === 'loading', 400);

  /* ── Records and where each one's needle is ── */
  const [order, setOrder] = useState(() => [PLAYLISTS[1].id, PLAYLISTS[0].id, PLAYLISTS[2].id]); // [left, deck, right]
  // Play order per playlist. Mutated in place by skip/pick (it's bookkeeping,
  // not something that renders); `cursor` below is what the UI reads.
  const [shuffles] = useState<Record<string, Shuffle>>(() =>
    Object.fromEntries(PLAYLISTS.map((p) => [p.id, newShuffle(p)])),
  );
  const [cursor, setCursor] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.entries(shuffles).map(([id, s]) => [id, s.order[0]])),
  ); // song index per playlist
  const current = byId(order[1]);
  const songCount = current.tracks.length;
  const index = Math.min(cursor[current.id] ?? 0, songCount - 1);
  const track = current.tracks[index];
  const [swapping, setSwapping] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [ripple, setRipple] = useState<{ n: number; x: number; y: number } | null>(null);

  // Load the first clip only once the section is close to view.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const inViewRef = useRef(false);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (engine && near && !engine.audio.getAttribute('src')) engine.load(previewUrl(track));
  }, [engine, near, track]);

  // Warm up the next song's clip and art so skipping feels instant.
  useEffect(() => {
    if (!engine || !near || songCount < 2) return;
    const s = shuffles[current.id];
    const next = current.tracks[s.order[s.pos + 1] ?? s.order[0]];
    engine.prefetch(previewUrl(next));
    new Image().src = trackArt(current, next, 640);
  }, [engine, near, current, index, songCount, shuffles]);

  /* ── Commands ── */
  const landTimerRef = useRef(0);
  const landedAtRef = useRef(-Infinity);
  const armAngleRef = useRef(ANGLE_REST);
  const impulseRef = useRef(0);
  const discRef = useRef<HTMLDivElement | null>(null);

  /** The stylus meets the vinyl: crackle, ripple, a little settle. */
  const touchDown = useCallback(() => {
    const e = engineRef.current;
    if (!e?.wantsPlay) return;
    landedAtRef.current = performance.now();
    e.crackle();
    const pt = needlePoint(armAngleRef.current);
    setRipple((r) => ({ n: (r?.n ?? 0) + 1, ...pt }));
    if (!gentle) {
      discRef.current?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.988)' }, { transform: 'scale(1)' }],
        { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
    }
  }, [gentle]);

  /** Put the needle down (play). `at` = fraction of the song; `fromDrag` = it's already there. */
  const drop = useCallback(
    (at?: number, fromDrag = false) => {
      const e = engineRef.current;
      if (!e) return;
      if (!e.audio.getAttribute('src')) e.load(previewUrl(track));
      const delay = fromDrag || gentle || e.wantsPlay ? 0 : ARM_TRAVEL_MS;
      e.play({ at, delayMs: delay });
      window.clearTimeout(landTimerRef.current);
      landTimerRef.current = window.setTimeout(touchDown, delay);
    },
    [track, gentle, touchDown],
  );

  /** Lift the needle (pause). */
  const lift = useCallback(() => {
    window.clearTimeout(landTimerRef.current);
    engineRef.current?.pause();
  }, []);

  /** Move the needle to song `i` of a playlist, keeping it playing if it was. */
  const cue = useCallback((playlist: Playlist, i: number, play: boolean) => {
    const e = engineRef.current;
    const n = playlist.tracks.length;
    const idx = ((i % n) + n) % n;
    setCursor((c) => ({ ...c, [playlist.id]: idx }));
    e?.load(previewUrl(playlist.tracks[idx]), play);
  }, []);

  const skip = useCallback(
    (dir: 1 | -1) => {
      const e = engineRef.current;
      if (!e) return;
      // "Previous" restarts the song if we're a few seconds in, like every music player.
      if (dir < 0 && e.audio.currentTime > 3) {
        e.seek(0);
        return;
      }
      if (!gentle) impulseRef.current = dir * 260; // a quick DJ flick of the platter
      cue(current, stepShuffle(shuffles[current.id], songCount, dir), e.wantsPlay);
    },
    [cue, current, songCount, shuffles, gentle],
  );

  /** Pick a song from the tracklist and play it. */
  const pick = useCallback(
    (i: number) => {
      const e = engineRef.current;
      if (!e) return;
      if (i === index && e.wantsPlay) return;
      if (!gentle) impulseRef.current = (i > index ? 1 : -1) * 260;
      if (i !== index) jumpShuffle(shuffles[current.id], i);
      if (e.wantsPlay) cue(current, i, true);
      else {
        cue(current, i, false);
        drop();
      }
    },
    [cue, current, index, drop, gentle, shuffles],
  );

  /** Swap a side record onto the deck. If music was on, the new record picks it up. */
  const select = useCallback(
    (id: string) => {
      const e = engineRef.current;
      if (!e || swapping || id === order[1]) return;
      const resume = e.wantsPlay;
      setSwapping(true);
      if (resume) lift();
      window.setTimeout(() => {
        setOrder((o) => {
          const next = [...o];
          const i = next.indexOf(id);
          [next[1], next[i]] = [next[i], next[1]];
          return next;
        });
        const p = byId(id);
        e.load(previewUrl(p.tracks[Math.min(cursor[id] ?? 0, p.tracks.length - 1)]));
        window.setTimeout(() => {
          setSwapping(false);
          if (resume) dropRef.current();
        }, 720);
      }, resume ? 520 : 0);
    },
    [swapping, order, lift, cursor],
  );

  // Latest commands for timers, media keys and audio events.
  const dropRef = useRef(drop);
  dropRef.current = drop;
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const liftRef = useRef(lift);
  liftRef.current = lift;

  // Roll into the next song; skip clips that fail to load (a few in a row → stop).
  const errorsRef = useRef(0);
  useEffect(() => {
    if (!engine) return;
    engine.onEnded = () => skipRef.current(1);
    engine.onError = () => {
      errorsRef.current += 1;
      if (errorsRef.current > 3 || !engine.wantsPlay) {
        engine.pause();
        return;
      }
      window.setTimeout(() => skipRef.current(1), 900);
    };
    return () => {
      engine.onEnded = null;
      engine.onError = null;
    };
  }, [engine]);
  useEffect(() => {
    if (audioStatus === 'playing') errorsRef.current = 0;
  }, [audioStatus]);

  /* ── Lock screen / media keys ── */
  useEffect(() => {
    if (!engine || !('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => dropRef.current());
    ms.setActionHandler('pause', () => liftRef.current());
    ms.setActionHandler('nexttrack', () => skipRef.current(1));
    ms.setActionHandler('previoustrack', () => skipRef.current(-1));
    return () => {
      for (const a of ['play', 'pause', 'nexttrack', 'previoustrack'] as const) ms.setActionHandler(a, null);
    };
  }, [engine]);
  useEffect(() => {
    if (!('mediaSession' in navigator) || !wantsPlay) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track[1],
      artist: track[2],
      album: `${current.name} · Jay's playlist`,
      artwork: [
        { src: trackArt(current, track, 300), sizes: '300x300', type: 'image/jpeg' },
        { src: trackArt(current, track, 640), sizes: '640x640', type: 'image/jpeg' },
      ],
    });
  }, [track, current, wantsPlay]);
  useEffect(() => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = wantsPlay ? 'playing' : 'paused';
  }, [wantsPlay]);

  /* ── Glow colour follows the album art ── */
  const glowTargetRef = useRef<RGB>(FALLBACK_GLOW);
  useEffect(() => {
    let live = true;
    void albumColour(trackArt(current, track, 64)).then((c) => {
      if (live) glowTargetRef.current = c;
    });
    return () => {
      live = false;
    };
  }, [current, track]);

  /* ── Animation loop: platter, tonearm, ring, clock, live waveform, glow ── */
  const deckSvgRef = useRef<SVGSVGElement | null>(null);
  const rotorRef = useRef<SVGGElement | null>(null);
  const armRef = useRef<SVGGElement | null>(null);
  const armShadowRef = useRef<SVGFEDropShadowElement | null>(null);
  const arcRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const totalRef = useRef<HTMLSpanElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const anglesRef = useRef<Record<string, number>>({});
  const draggingRef = useRef<null | 'arm' | 'ring' | 'wave'>(null);
  const grabOffsetRef = useRef(0);
  const pointerOffRecordRef = useRef(false);
  const overshotRef = useRef(false);
  const seekPreviewRef = useRef<number | null>(null);
  const centreIdRef = useRef(order[1]);
  centreIdRef.current = order[1];
  const restingWave = useMemo(() => waveform(track[0]), [track]);
  const restingWaveRef = useRef(restingWave);
  restingWaveRef.current = restingWave;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let vel = 0;
    let lifted = 1;
    let energy = 0;
    let avgLevel = 0;
    const glow: RGB = [...FALLBACK_GLOW];
    const live = new Float32Array(WAVE_BARS);
    const shown = new Float32Array(WAVE_BARS).fill(0.4);
    const peak = new Float32Array(WAVE_BARS).fill(0.5); // per-bar running max, so quiet songs move too
    let bars: NodeListOf<HTMLElement> | null = null;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const e = engineRef.current;
      const want = e?.wantsPlay ?? false;
      if (!inViewRef.current && vel === 0 && !want) return;
      const k = (rate: number) => 1 - Math.exp(-dt * rate);

      let p = e?.progress ?? 0;
      if (seekPreviewRef.current != null) p = seekPreviewRef.current;

      // Platter: eases up and down like a real one; skips give it a flick.
      vel += impulseRef.current;
      impulseRef.current = 0;
      const target = want && !gentle ? SPIN_DEG_PER_S : 0;
      vel += (target - vel) * k(want ? 3.2 : 4.4);
      if (Math.abs(vel) < 0.05 && target === 0) vel = 0;
      const id = centreIdRef.current;
      const angle = ((anglesRef.current[id] ?? 0) + vel * dt) % 360;
      anglesRef.current[id] = angle;
      rotorRef.current?.setAttribute('transform', `rotate(${angle.toFixed(2)})`);

      // Tonearm: rides the groove while playing, parks on the rim when lifted.
      const dragging = draggingRef.current === 'arm';
      if (!dragging) {
        const wantAngle = want ? grooveAngle(p) : ANGLE_REST;
        armAngleRef.current += (wantAngle - armAngleRef.current) * k(want ? 7.5 : 6);
      }
      lifted += ((want && !dragging ? 0 : 1) - lifted) * k(8);
      const since = (now - landedAtRef.current) / 1000;
      const wobble = !gentle && since < 1.4 ? 0.8 * Math.exp(-since * 5) * Math.sin(since * 26) : 0;
      armRef.current?.setAttribute(
        'transform',
        `translate(${PIVOT.x} ${PIVOT.y}) rotate(${((armAngleRef.current - ARM_BETA) * RAD + wobble).toFixed(2)}) scale(${(1 + lifted * 0.03).toFixed(4)})`,
      );
      const sh = armShadowRef.current;
      if (sh) {
        sh.setAttribute('dx', (1.2 + lifted * 2.6).toFixed(2));
        sh.setAttribute('dy', (2.4 + lifted * 5).toFixed(2));
        sh.setAttribute('stdDeviation', (1.6 + lifted * 2.4).toFixed(2));
      }

      // Progress ring + clock.
      arcRef.current?.setAttribute('d', arcPath(p));
      const a = p * Math.PI * 2;
      dotRef.current?.setAttribute('cx', (ARC_R * Math.sin(a)).toFixed(2));
      dotRef.current?.setAttribute('cy', (-ARC_R * Math.cos(a)).toFixed(2));
      const dur = e?.duration ?? 0;
      if (timeRef.current) timeRef.current.textContent = fmt(p * dur);
      if (totalRef.current) totalRef.current.textContent = fmt(dur || 30);

      // Waveform: dances to the music while playing, settles back when paused.
      const level = e?.level() ?? 0;
      const playing = want && e?.status === 'playing';
      if (playing && e) e.bands(live);
      const wave = waveRef.current;
      if (wave) {
        wave.style.setProperty('--p', p.toFixed(4));
        if (!bars?.length) bars = wave.querySelectorAll<HTMLElement>('.pl-bars i');
        const rest = restingWaveRef.current;
        const decay = Math.exp(-dt * 0.35);
        for (let i = 0; i < WAVE_BARS; i++) {
          peak[i] = Math.max(live[i], peak[i] * decay, 0.2);
          const v = (live[i] / peak[i]) ** 1.6;
          const goal = playing && !gentle ? 0.1 + rest[i] * 0.2 + v * 0.72 : rest[i];
          shown[i] += (Math.min(1, goal) - shown[i]) * k(playing ? 16 : 6);
          const s = `scaleY(${shown[i].toFixed(3)})`;
          bars[i]?.style.setProperty('transform', s);
          bars[i + WAVE_BARS]?.style.setProperty('transform', s);
        }
      }

      // Glow under the record: album colour, breathing with the bass.
      const stage = stageRef.current;
      if (stage) {
        const goal = glowTargetRef.current;
        for (let c = 0; c < 3; c++) glow[c] += (goal[c] - glow[c]) * k(2.5);
        // Pulse on the beat: how far the bass jumps above its own recent average.
        avgLevel += (level - avgLevel) * k(1.4);
        const beat = clamp01((level - avgLevel) * 6);
        const energyGoal = want ? 0.4 + (gentle ? 0 : beat * 0.6) : 0.12;
        energy += (energyGoal - energy) * k(beat > 0.05 ? 18 : 4);
        stage.style.setProperty('--pl-glow', `${glow[0] | 0} ${glow[1] | 0} ${glow[2] | 0}`);
        stage.style.setProperty('--pl-energy', energy.toFixed(3));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gentle]);

  /* ── Pointer: grab the tonearm ── */
  const onArmDown = (e: ReactPointerEvent<SVGGElement>) => {
    const svg = deckSvgRef.current;
    if (!svg || swapping) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = toDeck(svg, e);
    grabOffsetRef.current = armAngleRef.current - Math.atan2(pt.y - PIVOT.y, pt.x - PIVOT.x);
    pointerOffRecordRef.current = Math.hypot(pt.x, pt.y) > R_OUT + 4;
    overshotRef.current = false;
    draggingRef.current = 'arm';
    // Safety net: if the browser swallows the release (let go outside the
    // window, trackpad drag-lock…), still end the drag so the song can't keep
    // playing under a "dropped" arm. onArmUp ignores the second call.
    window.addEventListener('pointerup', onArmUp, { once: true });
  };
  const onArmMove = (e: ReactPointerEvent<SVGGElement>) => {
    const svg = deckSvgRef.current;
    if (!svg || draggingRef.current !== 'arm') return;
    const pt = toDeck(svg, e);
    const TAU = Math.PI * 2;
    // Normalise to 0–2π so swinging past 9 o'clock doesn't wrap round to the run-out groove.
    let a = (((Math.atan2(pt.y - PIVOT.y, pt.x - PIVOT.x) + grabOffsetRef.current) % TAU) + TAU) % TAU;
    const offRecord = Math.hypot(pt.x, pt.y) > R_OUT + 4;
    pointerOffRecordRef.current = offRecord;
    // Swung past the label: off the record means parked, not run-out. Either
    // way it's an overshoot — letting go there lifts the needle (it used to
    // play the last second and roll into the next song, so it never stopped).
    if (a < ANGLE_IN) {
      overshotRef.current = true;
      a = offRecord ? ANGLE_MAX : ANGLE_IN;
    } else if (a > ANGLE_IN + 0.02) {
      overshotRef.current = false; // back over the grooves
    }
    armAngleRef.current = Math.min(ANGLE_MAX, a);
  };
  const onArmUp = () => {
    if (draggingRef.current !== 'arm') return;
    draggingRef.current = null;
    const pt = needlePoint(armAngleRef.current);
    const r = Math.hypot(pt.x, pt.y);
    // Released over the grooves → play from there; anywhere else → lift.
    const onGrooves = r <= R_OUT + 4 && !pointerOffRecordRef.current && !overshotRef.current;
    if (onGrooves) drop(clamp01((R_OUT - r) / (R_OUT - R_IN)), true);
    else lift();
  };

  /* ── Pointer: scrub the progress ring or the waveform ── */
  const scrubStart = (kind: 'ring' | 'wave', e: ReactPointerEvent<Element>, p: number) => {
    if (!engine?.duration) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = kind;
    seekPreviewRef.current = p;
  };
  const scrubEnd = () => {
    const p = seekPreviewRef.current;
    draggingRef.current = null;
    seekPreviewRef.current = null;
    if (p == null || !engine) return;
    if (engine.wantsPlay) engine.seek(p);
    else drop(p);
  };
  const ringP = (e: { clientX: number; clientY: number }) => {
    const svg = deckSvgRef.current;
    if (!svg) return 0;
    const pt = toDeck(svg, e);
    const a = Math.atan2(pt.x, -pt.y);
    return clamp01((a < 0 ? a + Math.PI * 2 : a) / (Math.PI * 2));
  };
  const waveP = (e: { clientX: number }) => {
    const rect = waveRef.current?.getBoundingClientRect();
    return rect ? clamp01((e.clientX - rect.left) / rect.width) : 0;
  };

  /* ── Keyboard: space plays/pauses, arrows skip (while focus is on the turntable) ── */
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (el.closest('input, textarea, [contenteditable]')) return;
    if (e.key === ' ' && !el.closest('button, a')) {
      e.preventDefault();
      if (wantsPlay) lift();
      else drop();
    } else if (e.key === 'ArrowRight' && !el.closest('.pl-wave')) {
      e.preventDefault();
      skip(1);
    } else if (e.key === 'ArrowLeft' && !el.closest('.pl-wave')) {
      e.preventDefault();
      skip(-1);
    }
  };

  /* ── Copy ── */
  const recordArt = (p: Playlist, size: 300 | 640) =>
    trackArt(p, p.tracks[Math.min(cursor[p.id] ?? 0, p.tracks.length - 1)], size);

  let status: string;
  if (audioStatus === 'error') status = "Couldn't load this preview · skipping to the next song";
  else if (engine?.blocked) status = 'Your browser wants a tap first · press play';
  else if (cueing) status = 'Cueing up…';
  else if (wantsPlay) status = `Song ${index + 1} of ${songCount} · 30-second preview`;
  else if (engine && engine.progress > 0) status = 'Paused · grab and drop the needle to resume';
  else status = 'Drop the needle on the record — or press play';

  const sides = [order[0], order[2]] as const;

  return (
    <section id="on-rotation" className="bx-box bx-rotation" aria-label="On rotation">
      {/* The stage is the box's own surface (edge to edge), not a card in it. */}
      <div
        ref={stageRef}
        className={cn('pl-stage', wantsPlay && 'is-playing')}
        onKeyDown={onKeyDown}
      >
        <BoxLabel
          index={5}
          label="On rotation"
          aside={
            <a className="pl-foot-link" href={playlistUrl(current.id)} target="_blank" rel="noreferrer">
              Open in Spotify <ArrowUpRight aria-hidden="true" />
            </a>
          }
        />
        <Reveal>
          <LayoutGroup id="pl-records">
            <div className="pl-row">
              {sides.map((id, i) => (
                <SideRecord
                  key={i === 0 ? 'left' : 'right'}
                  side={i === 0 ? 'left' : 'right'}
                  playlist={byId(id)}
                  art={recordArt(byId(id), 300)}
                  angle={anglesRef.current[id] ?? 0}
                  disabled={swapping}
                  onSelect={() => select(id)}
                />
              ))}

              <div className="pl-deck" role="group" aria-label={`${current.name} on the turntable`}>
                <div className="pl-glow" aria-hidden="true" />
                <svg className="pl-deck-layer" viewBox={VIEWBOX} aria-hidden="true">
                  <defs>
                    <radialGradient id="pl-platter" cx="50%" cy="38%" r="70%">
                      <stop offset="0%" style={{ stopColor: 'var(--pl-platter-hi)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--pl-platter-lo)' }} />
                    </radialGradient>
                    <filter id="pl-platter-shadow" x="-30%" y="-30%" width="160%" height="170%">
                      <feDropShadow dx="0" dy="9" stdDeviation="10" floodColor="#000" style={{ floodOpacity: 'var(--pl-shadow)' }} />
                    </filter>
                  </defs>
                  <circle r={PLATTER_R} fill="url(#pl-platter)" filter="url(#pl-platter-shadow)" />
                  <circle r={PLATTER_R - 0.6} fill="none" strokeWidth="1" style={{ stroke: 'var(--pl-rim)' }} />
                  <circle r={103} style={{ fill: 'var(--pl-mat)' }} />
                </svg>

                <div ref={discRef} className="pl-deck-disc">
                  <Record
                    playlist={current}
                    art={recordArt(current, 640)}
                    rotorRef={rotorRef}
                    angle={anglesRef.current[current.id] ?? 0}
                  />
                </div>

                <svg ref={deckSvgRef} className="pl-deck-layer pl-deck-top" viewBox={VIEWBOX} aria-hidden="true">
                  <defs>
                    <linearGradient id="pl-metal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: 'var(--pl-metal-hi)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--pl-metal-lo)' }} />
                    </linearGradient>
                    <radialGradient id="pl-plate" cx="40%" cy="35%" r="75%">
                      <stop offset="0%" style={{ stopColor: 'var(--pl-platter-hi)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--pl-platter-lo)' }} />
                    </radialGradient>
                    <filter id="pl-base-shadow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="1.5" dy="3.5" stdDeviation="2.2" floodColor="#000" style={{ floodOpacity: 'var(--pl-shadow)' }} />
                    </filter>
                    <filter id="pl-arm-shadow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow
                        ref={armShadowRef}
                        dx="3.8"
                        dy="7.4"
                        stdDeviation="4"
                        floodColor="#000"
                        style={{ floodOpacity: 'var(--pl-shadow)' }}
                      />
                    </filter>
                  </defs>

                  {/* Progress ring — drag it to scrub */}
                  <circle
                    r={ARC_R}
                    className="pl-ring-hit"
                    onPointerDown={(e) => scrubStart('ring', e, ringP(e))}
                    onPointerMove={(e) => {
                      if (draggingRef.current === 'ring') seekPreviewRef.current = ringP(e);
                    }}
                    onPointerUp={scrubEnd}
                    onPointerCancel={scrubEnd}
                  />
                  <path ref={arcRef} className="pl-arc" d="M 0 0" />
                  <circle ref={dotRef} r="2.3" cx="0" cy={-ARC_R} className="pl-arc-dot" />

                  {/* Needle-drop ripple */}
                  {ripple && <circle key={ripple.n} className="pl-ripple" cx={ripple.x} cy={ripple.y} r="18" />}

                  {/* Tonearm base */}
                  <g filter="url(#pl-base-shadow)">
                    <circle cx={PIVOT.x} cy={PIVOT.y} r="24.5" fill="url(#pl-plate)" />
                  </g>
                  <circle cx={PIVOT.x} cy={PIVOT.y} r="19" fill="none" strokeWidth=".7" style={{ stroke: 'var(--pl-line)' }} />
                  <rect
                    x={PIVOT.x - 30}
                    y={PIVOT.y - 20}
                    width="13"
                    height="3.4"
                    rx="1.7"
                    transform={`rotate(32 ${PIVOT.x - 23} ${PIVOT.y - 18})`}
                    style={{ fill: 'var(--pl-lever)' }}
                  />

                  {/* Tonearm — grab the headshell and drop it on the record */}
                  <g
                    ref={armRef}
                    className="pl-arm"
                    filter="url(#pl-arm-shadow)"
                    transform={`translate(${PIVOT.x} ${PIVOT.y}) rotate(${((ANGLE_REST - ARM_BETA) * RAD).toFixed(2)}) scale(1.03)`}
                    onPointerDown={onArmDown}
                    onPointerMove={onArmMove}
                    onPointerUp={onArmUp}
                    onPointerCancel={onArmUp}
                    onLostPointerCapture={onArmUp}
                  >
                    <rect x="-33" y="-5.5" width="19" height="11" rx="2.6" fill="url(#pl-metal)" strokeWidth=".5" style={{ stroke: 'var(--pl-line)' }} />
                    <rect x="-35" y="-3.8" width="3" height="7.6" rx="1" style={{ fill: 'var(--pl-metal-lo)' }} />
                    <path d={`M 4 -0.8 L 78 -14 L ${HEAD_JOINT.x} ${HEAD_JOINT.y}`} className="pl-tube" />
                    <path d={`M 4 -0.8 L 78 -14 L ${HEAD_JOINT.x} ${HEAD_JOINT.y}`} className="pl-tube-shine" />
                    <circle r="10" fill="url(#pl-plate)" strokeWidth=".7" style={{ stroke: 'var(--pl-line)' }} />
                    <circle r="3.6" fill="url(#pl-metal)" strokeWidth=".5" style={{ stroke: 'var(--pl-line)' }} />
                    <g transform={`translate(${HEAD_JOINT.x} ${HEAD_JOINT.y}) rotate(${(HEAD_ANGLE * RAD).toFixed(2)})`}>
                      <rect x="-3" y="-3.4" width="10" height="6.8" rx="1.6" fill="url(#pl-metal)" strokeWidth=".5" style={{ stroke: 'var(--pl-line)' }} />
                      <rect x="6" y="-7.2" width="27" height="14.4" rx="1.8" strokeWidth=".6" style={{ fill: 'var(--pl-head)', stroke: 'var(--pl-line)' }} />
                      <rect x="9" y="-6.2" width="20" height="1.4" rx=".7" style={{ fill: 'var(--pl-head-shade)' }} />
                      <rect x="19" y="-4.6" width="10" height="3.6" rx=".9" style={{ fill: 'var(--pl-slot)' }} />
                      <rect x="19" y="1" width="10" height="3.6" rx=".9" style={{ fill: 'var(--pl-slot)' }} />
                      <rect x="27" y="-11" width="5" height="4.2" rx="1" style={{ fill: 'var(--pl-slot)' }} />
                    </g>
                    {/* generous invisible grab area along the arm */}
                    <path
                      d={`M 30 -7 L 78 -14 L ${HEAD_JOINT.x} ${HEAD_JOINT.y} L ${NEEDLE.x + 3} ${NEEDLE.y + 2}`}
                      className="pl-arm-hit"
                    />
                  </g>
                </svg>
              </div>

              <div className="pl-info">
                <p className="pl-kicker">{current.mood}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={track[0]}
                    className="pl-now"
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(3px)', transition: { duration: gentle ? 0 : 0.12 } }}
                    transition={{ duration: gentle ? 0 : 0.26, ease }}
                  >
                    <a className="pl-title" href={trackUrl(track)} target="_blank" rel="noreferrer" title="Hear the full song on Spotify">
                      {track[1]}
                    </a>
                    <p className="pl-sub">{track[2]}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="pl-player">
                  <button
                    type="button"
                    className="pl-play"
                    onClick={() => (wantsPlay ? lift() : drop())}
                    disabled={!engine || swapping}
                    aria-label={wantsPlay ? 'Pause' : `Play ${track[1]}`}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={wantsPlay ? 'pause' : 'play'}
                        className="pl-play-icon"
                        initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
                        transition={{ duration: gentle ? 0 : 0.2 }}
                      >
                        {wantsPlay ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <span ref={timeRef} className="pl-time">0:00</span>
                  <div
                    ref={waveRef}
                    className="pl-wave"
                    aria-hidden="true"
                    onPointerDown={(e) => scrubStart('wave', e, waveP(e))}
                    onPointerMove={(e) => {
                      if (draggingRef.current === 'wave') seekPreviewRef.current = waveP(e);
                    }}
                    onPointerUp={scrubEnd}
                    onPointerCancel={scrubEnd}
                  >
                    <Bars count={WAVE_BARS} />
                    <Bars count={WAVE_BARS} played />
                    <i className="pl-wave-head" />
                  </div>
                  <span ref={totalRef} className="pl-time pl-time--total">0:30</span>
                  <span className="pl-skips">
                    <button type="button" className="pl-skip" onClick={() => skip(-1)} disabled={!engine || swapping} aria-label="Previous song">
                      <SkipBack aria-hidden="true" />
                    </button>
                    <button type="button" className="pl-skip" onClick={() => skip(1)} disabled={!engine || swapping} aria-label="Next song">
                      <SkipForward aria-hidden="true" />
                    </button>
                  </span>
                </div>

                <p className="pl-status" aria-live="polite">{status}</p>

                <div className="pl-actions">
                  <button
                    type="button"
                    className={cn('pl-source-toggle', listOpen && 'is-open')}
                    onClick={() => setListOpen((o) => !o)}
                    aria-expanded={listOpen}
                  >
                    Tracklist <ChevronUp aria-hidden="true" />
                  </button>
                  {/* Only 30s previews can play here; the full song is one tap away. */}
                  <a className="pl-full" href={trackUrl(track)} target="_blank" rel="noreferrer">
                    Full song on Spotify <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <Tracklist
                  playlist={current}
                  index={index}
                  playing={wantsPlay}
                  open={listOpen}
                  onPick={pick}
                />
              </div>
            </div>
          </LayoutGroup>
        </Reveal>
      </div>
    </section>
  );
}

function SideRecord({
  side,
  playlist,
  art,
  angle,
  disabled,
  onSelect,
}: {
  side: 'left' | 'right';
  playlist: Playlist;
  art: string;
  angle: number;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <div className={`pl-side pl-side--${side}`}>
      <button
        type="button"
        className="pl-side-btn"
        onClick={onSelect}
        disabled={disabled}
        aria-label={`Put ${playlist.name} on the turntable`}
      >
        <Record playlist={playlist} art={art} angle={angle} />
      </button>
      <p className="pl-side-title">{playlist.name}</p>
      <p className="pl-side-sub">{playlist.total} songs</p>
    </div>
  );
}

/** A picture disc: the song's album art pressed into black vinyl, label with the
 *  playlist name curved around the spindle. */
function Record({
  playlist,
  art,
  angle,
  rotorRef,
}: {
  playlist: Playlist;
  art: string;
  angle: number;
  rotorRef?: Ref<SVGGElement>;
}) {
  const uid = useId().replace(/:/g, '');
  const clip = `pl-clip-${uid}`;
  const labelPath = `pl-label-${uid}`;
  const spindle = `pl-spindle-${uid}`;

  return (
    <motion.div
      layoutId={`pl-record-${playlist.id}`}
      className="pl-record"
      transition={{ layout: { duration: 0.72, ease } }}
    >
      <svg viewBox="-100 -100 200 200" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <circle r="95.5" />
          </clipPath>
          <path id={labelPath} d="M -28.5 0 A 28.5 28.5 0 1 1 28.5 0 A 28.5 28.5 0 1 1 -28.5 0" />
          <radialGradient id={spindle} cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#c9c9c9" />
            <stop offset="100%" stopColor="#7d7d7d" />
          </radialGradient>
        </defs>
        <g ref={rotorRef} transform={`rotate(${angle.toFixed(2)})`}>
          <circle r="100" fill="#070707" />
          {/* keyed by URL so each new song's art fades in over the vinyl */}
          <image
            key={art}
            className="pl-record-art"
            href={art}
            x="-96"
            y="-96"
            width="192"
            height="192"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clip})`}
          />
          <circle r="95.5" fill="#000" opacity=".3" />
          {[90, 82, 74, 66, 58, 50, 43].map((r) => (
            <circle key={r} r={r} fill="none" stroke="#000" strokeOpacity=".22" strokeWidth=".5" />
          ))}
          <circle r="95.5" fill="none" stroke="#000" strokeWidth="1.6" />
          <circle r="36" fill="#121212" stroke="#000" strokeWidth="1.2" />
          <circle r="21" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth=".6" />
          <text className="pl-label-text">
            <textPath href={`#${labelPath}`} startOffset="17%">
              {playlist.name.toUpperCase()}
            </textPath>
          </text>
        </g>
        <circle r="3.6" fill={`url(#${spindle})`} stroke="#555" strokeWidth=".3" />
      </svg>
      <span className="pl-record-sheen" aria-hidden="true" />
    </motion.div>
  );
}

/** Waveform bars; their heights are animated from the loop above. */
function Bars({ count, played }: { count: number; played?: boolean }) {
  return (
    <span className={cn('pl-bars', played && 'pl-bars--played')}>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

/** The playlist's songs with their art — tap one to play it. */
function Tracklist({
  playlist,
  index,
  playing,
  open,
  onPick,
}: {
  playlist: Playlist;
  index: number;
  playing: boolean;
  open: boolean;
  onPick: (i: number) => void;
}) {
  const listRef = useRef<HTMLOListElement | null>(null);

  // Keep the current song in view inside the list (without scrolling the page).
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!open || !list || !row) return;
    const top = row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
    list.scrollTo({ top, behavior: 'smooth' });
  }, [open, index, playlist.id]);

  const partial = playlist.tracks.length < playlist.total;

  return (
    <div className={cn('pl-source', open && 'is-open')}>
      <div className="pl-source-inner" inert={!open}>
        <div className="pl-tracklist">
          <div className="pl-tracklist-head">
            <span>{playlist.name}</span>
            <span>{partial ? `${playlist.tracks.length} of ${playlist.total} songs` : `${playlist.total} songs`}</span>
          </div>
          <ol ref={listRef} className="pl-tracklist-list">
            {playlist.tracks.map((t: PlaylistTrack, i) => {
              const isCurrent = i === index;
              return (
                <li key={t[0]}>
                  <button
                    type="button"
                    className="pl-song"
                    aria-current={isCurrent}
                    onClick={() => onPick(i)}
                  >
                    <span className="pl-song-num">
                      {isCurrent && playing ? (
                        <span className="pl-eq" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <img src={trackArt(playlist, t, 64)} alt="" loading="lazy" width="36" height="36" />
                    <span className="pl-song-text">
                      <span className="pl-song-title">{t[1]}</span>
                      <span className="pl-song-artist">{t[2]}</span>
                    </span>
                    <span className="pl-song-dur">{fmtDuration(t[3])}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="pl-source-note">
          30-second previews from Spotify ·{' '}
          <a href={playlistUrl(playlist.id)} target="_blank" rel="noreferrer">
            Hear every full song on Spotify <ArrowUpRight aria-hidden="true" />
          </a>
        </p>
      </div>
    </div>
  );
}
