/** Header jumps (Jay, Oct 18): after landing on a box, a line traces once
 *  around its edge and fades, so you can see where you arrived. */
export function markArrival(el: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.querySelector(':scope > .bx-arrive')?.remove();
  const ring = document.createElement('span');
  ring.className = 'bx-arrive';
  ring.setAttribute('aria-hidden', 'true');
  ring.addEventListener('animationend', (e) => {
    if (e.animationName === 'bx-arrive-fade') ring.remove();
  });
  el.appendChild(ring);
}

/** Scroll a home-page box under the header and mark it. */
export function arriveAt(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'instant' });
  markArrival(el);
  return true;
}
