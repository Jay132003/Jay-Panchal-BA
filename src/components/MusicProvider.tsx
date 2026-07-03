import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type Track = {
  title: string;
  artist?: string;
  detail?: string; // shown on hover (album / year / context)
  song: string;
  image: string;
};

/**
 * Songs live in /public/assets. Add or edit entries here.
 * `artist` shows inline as "Title · Artist"; `detail` shows on hover.
 */
const TRACKS: Track[] = [
  {
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    detail: 'Spider-Man: Into the Spider-Verse (2018)',
    song: '/assets/Sunflower - Song.mp3',
    image: '/assets/Sunflower - Image.jpg',
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    detail: 'After Hours (2019)',
    song: '/assets/Blinding Lights - Song.mp3',
    image: '/assets/Blinding Lights - Image.jpeg',
  },
  {
    title: 'Counting Stars',
    artist: 'OneRepublic',
    detail: 'Native (2013)',
    song: '/assets/Counting Starts - Song.mp3',
    image: '/assets/Counting Start - Image.jpg',
  },
  {
    title: 'Bye Bye',
    // artist: '', detail: '',  // TODO: add the singer / details
    song: '/assets/Bye Bye - Song.mp3',
    image: '/assets/Bye Bye - Image.jpeg',
  },
  {
    title: 'Destiny',
    // artist: '', detail: '',  // TODO: add the singer / details
    song: '/assets/Destiny - Song.mp3',
    image: '/assets/Destiny - Image.jpeg',
  },
];

const LAST_KEY = 'jp-last-song';

// Random track index, different from the previous page load's song, so a fresh
// (random) track plays on every refresh / reopen.
function pickInitial(): number {
  const n = TRACKS.length;
  if (n <= 1) return 0;
  let last = -1;
  try {
    last = Number(window.localStorage.getItem(LAST_KEY) ?? -1);
  } catch {
    /* ignore */
  }
  let idx = Math.floor(Math.random() * n);
  if (idx === last) idx = (idx + 1) % n;
  try {
    window.localStorage.setItem(LAST_KEY, String(idx));
  } catch {
    /* ignore */
  }
  return idx;
}

type MusicContextValue = {
  track: Track;
  muted: boolean;
  toggleMute: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within <MusicProvider>');
  return ctx;
}

/**
 * Owns the single <audio> element for the whole site. Because the provider is
 * mounted once at the app root (above the page router), the audio never
 * unmounts — the same song keeps playing across every page until the tab is
 * refreshed or reopened, when a new random track is chosen.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // True once sound has been unlocked, either by the first click anywhere or
  // by the visitor explicitly using the mute button.
  const startedRef = useRef(false);
  // Holds the document-level "first click" listener so it can be torn down
  // from either the listener itself or toggleMute, whichever fires first.
  const unlockRef = useRef<((event: MouseEvent) => void) | null>(null);

  // One random track per page load; loops until the tab is refreshed.
  const [current] = useState<number>(() => (typeof window === 'undefined' ? 0 : pickInitial()));
  // Session-only — intentionally NOT persisted, so every load starts muted
  // and unlocks fresh on the next first click.
  const [muted, setMuted] = useState(false);

  const track = TRACKS[current];
  const songSrc = useMemo(() => encodeURI(track.song), [track.song]);

  // Play muted immediately on load (always permitted by every browser), then
  // switch sound on at the visitor's very first click anywhere on the page.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.play().catch(() => {});

    const unlock = (event: MouseEvent) => {
      if (startedRef.current) return;
      // The mute button's own onClick handles the first click on itself.
      const target = event.target;
      if (target instanceof Element && target.closest('[data-music-toggle]')) return;
      startedRef.current = true;
      audio.muted = false;
      setMuted(false);
      if (audio.paused) audio.play().catch(() => {});
      document.removeEventListener('click', unlock, true);
      unlockRef.current = null;
    };

    unlockRef.current = unlock;
    document.addEventListener('click', unlock, true);
    return () => {
      document.removeEventListener('click', unlock, true);
      unlockRef.current = null;
    };
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!startedRef.current) {
      // First click is on the button itself: unlock and play out loud rather
      // than toggling to muted.
      startedRef.current = true;
      audio.muted = false;
      setMuted(false);
      if (audio.paused) audio.play().catch(() => {});
      if (unlockRef.current) {
        document.removeEventListener('click', unlockRef.current, true);
        unlockRef.current = null;
      }
      return;
    }
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted && audio.paused) audio.play().catch(() => {});
  }, []);

  const value = useMemo<MusicContextValue>(
    () => ({ track, muted, toggleMute }),
    [track, muted, toggleMute],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={songSrc} loop preload="auto" />
    </MusicContext.Provider>
  );
}
