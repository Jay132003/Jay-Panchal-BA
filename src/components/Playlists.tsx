import { useEffect, useState } from 'react';
import { playlists } from '../data/portfolio';

type CoverMap = Record<string, string>;

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function Playlists() {
  const [covers, setCovers] = useState<CoverMap>({});

  useEffect(() => {
    playlists.forEach(({ id, url }) => {
      fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}&format=json`)
        .then((r) => r.json())
        .then((data) => {
          if (data.thumbnail_url) {
            setCovers((prev) => ({ ...prev, [id]: data.thumbnail_url }));
          }
        })
        .catch(() => {});
    });
  }, []);

  const doubled = [...playlists, ...playlists];

  return (
    <section className="playlists-section content-section" id="playlists">
      <h2 className="playlists-heading">
        <span className="spotify-heading-badge" aria-hidden="true">
          <SpotifyLogo />
        </span>
        What I'm listening to.
      </h2>
      <p className="playlists-sub">Five playlists — one for every mood.</p>

      <div className="marquee-wrapper" role="region" aria-label="Spotify playlists">
        <div className="marquee-fade marquee-fade--left" aria-hidden="true" />
        <div className="marquee-fade marquee-fade--right" aria-hidden="true" />
        <div className="marquee-track">
          {doubled.map((p, i) => (
            <a
              key={`${p.id}-${i}`}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="playlist-card"
              aria-label={`Open ${p.name} on Spotify`}
            >
              <div className="playlist-img-wrap">
                {covers[p.id] ? (
                  <img src={covers[p.id]} alt={p.name} className="playlist-cover" />
                ) : (
                  <div className="playlist-gradient-bg" style={{ background: p.gradient }} />
                )}
                <div className="playlist-play-overlay" aria-hidden="true">
                  <span className="play-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="playlist-footer">
                <SpotifyLogo className="playlist-footer-icon" />
                <span className="playlist-name">{p.name}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
