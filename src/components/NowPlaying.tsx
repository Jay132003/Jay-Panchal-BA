import { useMusic } from './MusicProvider';

/**
 * Presentational "Now playing" row. All playback lives in <MusicProvider>, so
 * this component can mount/unmount freely (e.g. across page navigation)
 * without ever interrupting the music.
 */
export default function NowPlaying() {
  const { track, muted, toggleMute } = useMusic();

  return (
    <div className="now-playing">
      <img
        className="np-art"
        src={encodeURI(track.image)}
        alt=""
        width={24}
        height={24}
        decoding="async"
      />
      <span className="np-text" title={track.detail || undefined}>
        <span className="np-label">Now playing</span>
        <span className="np-dash">—</span>
        <span className="np-title">{track.title}</span>
        {track.artist && <span className="np-artist"> · {track.artist}</span>}
      </span>
      <button
        type="button"
        className="np-mute"
        data-music-toggle
        onClick={toggleMute}
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </div>
  );
}
