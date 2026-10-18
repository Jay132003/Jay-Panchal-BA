/** Tracklist pick (Jay, Oct 18): the song's cover lifts out of the list, arcs
 *  over and lands on the record — rounding into a disc and spinning down to
 *  the platter's own angle, so the hand-off to the real record doesn't snap.
 *
 *  Driven by requestAnimationFrame (not CSS) because the target keeps moving:
 *  the record spins and the page may scroll mid-flight. */

const DURATION = 760;
const ART = 0.96; // the art covers 96% of the record (r 96 of 100)

type Flight = {
  from: HTMLImageElement;
  /** The record on the deck. */
  to: HTMLElement;
  /** Bigger art for the landing; the list thumbnail shows until it loads. */
  src: string;
  /** The platter's current angle in degrees. */
  angle: () => number;
  onLand: () => void;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Returns false (and does nothing) when a flight wouldn't read well: reduced
 *  motion, a hidden tab, or the record scrolled out of view (phones). */
export function flyCover({ from, to, src, angle, onLand }: Flight): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return false;
  const a = from.getBoundingClientRect();
  const d = to.getBoundingClientRect();
  if (!a.width || d.top < 0 || d.bottom > window.innerHeight) return false;

  const size = d.width * ART;
  const ghost = document.createElement('div');
  ghost.className = 'pl-flight';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.width = ghost.style.height = `${size}px`;
  ghost.style.backgroundImage = `url("${src}"), url("${from.currentSrc || from.src}")`;

  const startScale = a.width / size;
  const startRadius = (6 / a.width) * 100; // the thumbnail's 6px corners, as %
  const sx = a.left + a.width / 2;
  const sy = a.top + a.height / 2;
  const lift = Math.min(90, 36 + Math.hypot(sx - d.left, sy - d.top) * 0.12);
  const t0 = performance.now();
  let landed = false;

  // The hand-off starts in the last stretch of the flight: the real art shows
  // under the ghost while it fades and keeps settling, so the tonearm (which
  // the ghost passes over) is never hidden for long.
  const land = () => {
    if (landed) return;
    landed = true;
    onLand();
    ghost
      .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' })
      .finished.finally(() => ghost.remove());
  };

  const place = (e: number) => {
    const r = to.getBoundingClientRect(); // follows the record if the page scrolls
    const tx = r.left + r.width / 2;
    const ty = r.top + r.height / 2;
    const x = sx + (tx - sx) * e;
    const y = sy + (ty - sy) * e - lift * Math.sin(Math.PI * e);
    const scale = startScale + (1 - startScale) * e;
    // A turn and a bit, unwinding onto the platter's live angle.
    const spin = angle() - 400 * (1 - e);
    ghost.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px) scale(${scale}) rotate(${spin}deg)`;
    ghost.style.borderRadius = `${startRadius + (50 - startRadius) * e}%`;
    ghost.style.boxShadow = `0 ${10 + 26 * Math.sin(Math.PI * e)}px ${18 + 30 * Math.sin(Math.PI * e)}px -14px rgba(0, 0, 0, ${0.25 + 0.25 * Math.sin(Math.PI * e)})`;
  };
  const frame = (now: number) => {
    if (!ghost.isConnected) return;
    const t = Math.min(1, (now - t0) / DURATION);
    place(easeInOut(t));
    if (t >= 0.86) land();
    if (t < 1) requestAnimationFrame(frame);
  };
  place(0); // sits on the thumbnail before the first frame
  document.body.appendChild(ghost);
  requestAnimationFrame(frame);
  // If frames stall (background tab), still hand over to the record.
  window.setTimeout(land, DURATION + 500);
  return true;
}
