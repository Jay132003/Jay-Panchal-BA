import { PLAYLIST_TOTALS, PLAYLIST_TRACKS, type PlaylistTrack } from './playlistTracks';

export type { PlaylistTrack };

export type Playlist = {
  /** Spotify playlist id (the part after /playlist/ in the share link). */
  id: string;
  name: string;
  emoji?: string;
  /** Small caps kicker above the title, like a genre tag. */
  mood: string;
  cover: string;
  /** Songs the turntable can play (Spotify's embed exposes the first 100). */
  tracks: PlaylistTrack[];
  /** Real number of songs in the playlist on Spotify. */
  total: number;
  /** Spotify track id of the song this record always starts on; after it the
   *  playlist shuffles. Without one, it starts on a random song. */
  startsWith?: string;
};

type PlaylistInput = Omit<Playlist, 'tracks' | 'total'> & {
  /** Songs from further down the playlist than the public embed reaches (its
   *  first 100). Added by hand from each song's own public Spotify page, so
   *  `npm run playlists:sync` doesn't overwrite them. */
  extraTracks?: PlaylistTrack[];
};

const make = ({ extraTracks = [], ...p }: PlaylistInput): Playlist => {
  const synced = PLAYLIST_TRACKS[p.id] ?? [];
  const known = new Set(synced.map((t) => t[0]));
  // Only songs with a preview clip can spin.
  const tracks = [...synced, ...extraTracks.filter((t) => !known.has(t[0]))].filter((t) => t[5]);
  return { ...p, tracks, total: Math.max(PLAYLIST_TOTALS[p.id] ?? 0, tracks.length) };
};

/**
 * Jay's Spotify playlists, shown as three records on the turntable. The first
 * entry starts on the deck. Covers live in /public/assets/playlists.
 * After changing songs on Spotify, run `npm run playlists:sync`.
 */
export const PLAYLISTS: Playlist[] = [
  make({
    id: '72PKk905OzSzSog1N8OLmC',
    name: 'Alive',
    emoji: '🕊️',
    mood: 'Bollywood · Upbeat',
    cover: '/assets/playlists/alive.jpg',
    startsWith: '5ira9VcDBJhaEVSrbHOlIK', // 295 — Sidhu Moose Wala
    extraTracks: [
      [
        '5ira9VcDBJhaEVSrbHOlIK',
        '295',
        'Sidhu Moose Wala',
        270000,
        'ab67616d0000b2734bb4f74a33e147bac76c470a',
        '17b9f725e0c997fd03bd2474c4900c2f5bc78ab0',
      ],
    ],
  }),
  make({
    id: '3GTTRXXSnKGdzmz6DuVlPp',
    name: 'Mastana',
    emoji: '💛',
    mood: 'Bollywood · Romance',
    cover: '/assets/playlists/mastana.jpg',
    startsWith: '46hzNOUOAlivuCZZ0wE3zi', // Tere Vaaste
  }),
  make({
    id: '6JmjJn7Ex6aZ3TppK4yMf2',
    name: 'Gujju Rocks',
    mood: 'Gujarati · Folk pop',
    cover: '/assets/playlists/gujju-rocks.jpg',
    startsWith: '0A3vs8i1ohTU2y0coFK7ja', // Garba Shuffle
  }),
];

export const playlistUrl = (id: string) => `https://open.spotify.com/playlist/${id}`;
export const trackUrl = (track: PlaylistTrack) => `https://open.spotify.com/track/${track[0]}`;
/** Spotify's official 30-second preview clip for a song. */
export const previewUrl = (track: PlaylistTrack) => `https://p.scdn.co/mp3-preview/${track[5]}`;

// Spotify album-art size prefixes for the same image id.
const ART_SIZES = { 64: 'ab67616d00004851', 300: 'ab67616d00001e02', 640: 'ab67616d0000b273' } as const;

/** Album art for a song (Spotify's CDN), falling back to the playlist cover. */
export function trackArt(p: Playlist, track: PlaylistTrack | undefined, size: 64 | 300 | 640 = 300): string {
  const art = track?.[4];
  if (!art) return p.cover;
  return `https://i.scdn.co/image/${art.replace(/^ab67616d0000b273/, ART_SIZES[size])}`;
}

/** "3:41" */
export function fmtDuration(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
