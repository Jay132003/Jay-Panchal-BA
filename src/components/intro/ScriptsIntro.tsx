import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { VerifiedBadge } from '../home/ProfileHeader';
import type { IntroProps } from './types';

gsap.registerPlugin(ScrambleTextPlugin);

// Consonants only for the scramble noise — matras on their own render as
// dotted circles, so they only appear once the real name settles.
const SCRIPTS = [
  { text: 'જય પંચાલ', lang: 'gu', label: 'ગુજરાતી', chars: 'કખગઘચછજઝટઠડઢણતથદધનપફબભમયરલવશસહ' },
  { text: 'जय पंचाल', lang: 'hi', label: 'हिन्दी', chars: 'कखगघचछजझटठडढणतथदधनपफबभमयरलवशसह' },
  { text: 'Jay Panchal', lang: 'en', label: 'English', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' },
] as const;

/** Where the name lives on the page — the intro's name lands exactly on it. */
const TARGET = '#profile-name';
const CENTRE_SCALE = 1.45;

/**
 * Intro, take 2 — "Three scripts" (Oct 17). Jay's name scrambles through
 * Gujarati → Hindi → English at the centre of the screen (a nod to the
 * જય પંચાલ · जय पंचाल line on the page), the verified tick pops in, then the
 * name glides into its exact place in the name box as the page fades in
 * around it. GSAP + ScrambleText.
 */
export default function ScriptsIntro({ onReveal, onDone }: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef({ onReveal, onDone });
  cbRef.current = { onReveal, onDone };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const name = nameRef.current;
    const text = textRef.current;
    const slot = slotRef.current;
    const target = document.querySelector<HTMLElement>(TARGET);
    if (!root || !name || !text || !slot) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      // Park the name exactly where the page's name sits (minus any entrance
      // offset it still has), then push it to the centre of the screen. The
      // landing is just "undo the push".
      if (target) {
        const r = target.getBoundingClientRect();
        const t = getComputedStyle(target).transform;
        const dy = t && t !== 'none' ? new DOMMatrix(t).m42 : 0;
        gsap.set(name, { left: r.left, top: r.top - dy, fontSize: getComputedStyle(target).fontSize });
      }
      const n = name.getBoundingClientRect();
      // Each script is a different width; measure all three so every one sits
      // centred (the name is anchored at its landing spot, so centring is an x shift).
      const widths = SCRIPTS.map((sc) => {
        text.textContent = sc.text;
        return name.getBoundingClientRect().width;
      });
      text.textContent = '';
      const origin = widths[2] / 2; // scale around the English name's middle
      const s = slot.getBoundingClientRect();
      const slotX = s.left + s.width / 2;
      const xFor = (i: number) => slotX - n.left - origin - CENTRE_SCALE * (widths[i] / 2 - origin);
      const toY = s.top + s.height / 2 - (n.top + n.height / 2);
      gsap.set(name, { x: xFor(0), y: toY, scale: CENTRE_SCALE, transformOrigin: `${origin}px 50%` });
      gsap.set('.sc-badge', { scale: 0, opacity: 0 });
      gsap.set('.sc-seg-fill', { scaleX: 0 });
      gsap.set('.sc-kicker, .sc-bar', { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to('.sc-kicker, .sc-bar', { opacity: 1, duration: 0.3 });

      SCRIPTS.forEach((script, i) => {
        tl.call(() => {
          text.lang = script.lang;
          const idx = root.querySelector('.sc-idx');
          if (idx) idx.textContent = `0${i + 1} / 03`;
        })
          .to('.sc-script', { duration: 0.35, scrambleText: { text: script.label, chars: script.chars } })
          .to(text, { duration: 0.75, scrambleText: { text: script.text, chars: script.chars, speed: 0.5 } }, '<')
          .to(name, { x: xFor(i), duration: 0.75, ease: 'power2.inOut' }, '<')
          .to(`.sc-seg:nth-child(${i + 1}) .sc-seg-fill`, { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, '<')
          .to({}, { duration: i < 2 ? 0.4 : 0.15 });
      });

      tl.to('.sc-badge', { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.6)' })
        // Land: kicker and bar step aside, the name glides into its box.
        .addLabel('land', '+=0.25')
        .to('.sc-kicker, .sc-bar', { opacity: 0, duration: 0.25 }, 'land')
        .to(name, { x: 0, y: 0, scale: 1, duration: 0.85, ease: 'expo.inOut' }, 'land')
        .addLabel('reveal', 'land+=0.8')
        .call(() => cbRef.current.onReveal(), undefined, 'reveal')
        .to('.sc-backdrop', { opacity: 0, duration: 0.55, ease: 'power2.out' }, 'reveal')
        // The page's own name is already sitting right underneath (it skips
        // its entrance when this intro runs), so the hand-off is invisible.
        .to(name, { opacity: 0, duration: 0.3 }, 'reveal+=0.6')
        .call(() => cbRef.current.onDone());
    }, root);

    return () => {
      ctx.revert();
      html.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div ref={rootRef} className="sc" role="status" aria-label="Loading Jay Panchal's portfolio">
      <div className="sc-backdrop" />

      <div className="sc-stack">
        <p className="sc-kicker">
          <span className="sc-idx">01 / 03</span>
          <span className="sc-dash" aria-hidden="true">—</span>
          <span className="sc-script" />
        </p>
        <div ref={slotRef} className="sc-slot" aria-hidden="true" />
        <div className="sc-bar" aria-hidden="true">
          {SCRIPTS.map((s) => (
            <span key={s.lang} className="sc-seg">
              <i className="sc-seg-fill" />
            </span>
          ))}
        </div>
      </div>

      <h1 ref={nameRef} className="sc-name bx-name" aria-hidden="true">
        <span ref={textRef} />
        <span className="sc-badge">
          <VerifiedBadge />
        </span>
      </h1>
    </div>
  );
}
