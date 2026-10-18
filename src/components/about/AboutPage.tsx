import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import AvatarPreview from '../AvatarPreview';
import { Bento, Box, Row } from '../home/Bento';
import NextPage from '../home/NextPage';
import { LOGOS } from '../home/roles';
import SignOff from '../home/SignOff';

const ABOUT_PHOTO = '/assets/Jay%20-%20About.jpg';

const ease = [0.22, 1, 0.36, 1] as const;

// Each step quotes a line from the story below.
const APPROACH = [
  { title: 'Understand deeply', line: 'Before solving a problem, understand why it exists in the first place.' },
  { title: 'Design thoughtfully', line: 'Conversations become requirements, requirements become workflows.' },
  { title: 'Deliver meaningfully', line: 'Workflows become measurable business outcomes.' },
] as const;

type Chapter = { when?: string; title: string; logo?: string; body: ReactNode };

/** Jay's story, word for word, split into chapters (Oct 18). */
const CHAPTERS: Chapter[] = [
  {
    title: 'Where it began',
    body: (
      <p>
        My journey didn't begin with a fancy title or a big break. It began with curiosity,
        ambition, and a constant desire to understand how businesses actually work behind
        the scenes. Because honestly, software toh sab bana lete hain —{' '}
        <strong><mark>asli khel toh yeh samajhne mein hai ki client ko chahiye kya.</mark></strong>
      </p>
    ),
  },
  {
    when: '2023',
    title: 'QSpiders',
    logo: LOGOS['QSpiders'],
    body: (
      <p>
        I started my career at QSpiders, where I built a strong foundation in SQL, SDLC,
        and software development principles. It was here that I learned an important lesson:{' '}
        <mark>before solving a problem, you need to understand why it exists in the first place.</mark>
      </p>
    ),
  },
  {
    when: '2024',
    title: 'BrainyBeam',
    logo: LOGOS['Brainybeam Info-Tech Pvt Ltd'],
    body: (
      <>
        <p>
          Later, I joined BrainyBeam and worked on an Android-based Road Side Assistant
          application. It was my first experience taking an idea and turning it into a real product.
        </p>
        <p>
          And trust me —{' '}
          <strong><span className="mark-coral">pehla production bug dekhne ke baad jo character development hota hai na… uski alag hi kahaani hai.</span></strong>
        </p>
      </>
    ),
  },
  {
    when: '2024',
    title: 'Neome',
    logo: LOGOS['Neome.ai'],
    body: (
      <>
        <p>
          In June 2024, I joined Neomenta Inc, a U.S.-based startup. I initially entered as
          a developer, but very quickly found myself drawn toward something beyond code —
          understanding people, processes, and business challenges.
        </p>
        <p>That's when I discovered my passion for Business Analysis.</p>
        <p>
          The transition felt natural because I genuinely enjoy asking questions. Sometimes
          so many questions that clients probably wonder whether I'm{' '}
          <mark>gathering requirements or preparing for a crime investigation.</mark>
        </p>
        <p>
          At Neome, I learned that successful solutions aren't built by assumptions; they're
          built by <mark>listening carefully, identifying hidden challenges,</mark> and connecting
          business needs with the right technology.
        </p>
      </>
    ),
  },
  {
    title: 'What I build',
    body: (
      <p>
        Since then, I have worked on CRM systems, HRMS platforms, FMCG modules, workflow
        automation solutions, and low-code business applications. Every project brought a
        different challenge, but the pattern remained the same:{' '}
        <mark>businesses rarely struggle because they lack ideas — they struggle because processes become messy as they grow.</mark>
      </p>
    ),
  },
  {
    title: "What I've learned",
    body: (
      <>
        <p>
          One thing I have learned throughout my journey is that clients don't always need
          more software. Sometimes they simply need fewer manual steps, fewer spreadsheets,
          fewer follow-ups, and fewer headaches.
        </p>
        <p>
          <mark>The best solution is often the one that makes people forget a problem ever existed.</mark>
        </p>
        <p>
          I enjoy working at the intersection of business and technology, where conversations
          become requirements, requirements become workflows, and workflows become measurable
          business outcomes.
        </p>
        <p>
          My approach is simple:{' '}
          <strong>Understand deeply. Design thoughtfully. Deliver meaningfully.</strong>
        </p>
        <p>
          Because at the end of the day, dashboards look great, reports look impressive, and
          automations look smart — but if the client still has to call someone five times to
          get work done,{' '}
          <strong><span className="mark-coral">toh phir system sirf digital hai, useful nahi.</span></strong>
        </p>
      </>
    ),
  },
  {
    title: 'Today',
    body: (
      <p>
        Today, I focus on building scalable systems, AI-powered workflows, and business
        solutions that simplify operations and help organizations grow efficiently.
      </p>
    ),
  },
];

/** Big-type quotes that sit between chapters, after the chapter at `after`. */
const PULL_QUOTES: { after: number; quote: ReactNode }[] = [
  {
    after: 4,
    quote: (
      <>
        <span className="mark-coral">Aur wahi mess dekhkar mera dimaag bolta hai</span> —{' '}
        <mark>"Challenge accepted."</mark>
      </>
    ),
  },
  {
    after: 6,
    quote: (
      <>
        I don't just gather requirements.{' '}
        <mark>I take ownership of problems until they stop being problems.</mark>
      </>
    ),
  },
];

/** The About page on the landing grid (Oct 18): photo + intro, the story in
 *  chapters with pull quotes between them, the approach, then on to Work. */
export function AboutPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  useHighlighter(storyRef);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const rise = (d: number) => ({
    initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 0.65, delay: d, ease },
  });

  // Box numbers run down the page: intro 01, then two per chapter, one per
  // pull quote, three for the approach.
  let box = 1;
  const rows: ReactNode[] = [];
  CHAPTERS.forEach((ch, i) => {
    const n = (box += 1);
    box += 1;
    rows.push(
      <Row key={ch.title} cols="1fr 3fr" className="bx-chapter">
        <Box index={n} label={ch.when ?? 'Story'} className="bx-chapter-head">
          {ch.logo && (
            <span className="gx-company-logo bx-chapter-logo">
              <img src={ch.logo} alt="" />
            </span>
          )}
          <h2 className="bx-chapter-title">{ch.title}</h2>
        </Box>
        <Box index={n + 1} label={`Chapter ${i + 1}`} className="bx-chapter-body">
          <div className="bx-story">{ch.body}</div>
        </Box>
      </Row>,
    );
    const pull = PULL_QUOTES.find((q) => q.after === i);
    if (pull) {
      const q = (box += 1);
      rows.push(
        <Row key={`quote-${i}`}>
          <Box index={q} label="In short" className="bx-pull">
            <blockquote className="bx-story bx-pull-quote">{pull.quote}</blockquote>
          </Box>
        </Row>,
      );
    }
  });
  const approachStart = box + 1;
  box += APPROACH.length;

  return (
    <div className="bx-page">
      <Bento ready={ready} delay={0.05}>
        <Row cols="var(--bx-about-photo) 1fr" className="bx-about-hero">
          <section className="bx-box bx-photo-cell bx-about-photo" aria-label="Photo">
            <motion.button
              type="button"
              className="bx-photo"
              onClick={() => setPreviewOpen(true)}
              aria-label="View photo of Jay Panchal"
              initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
              animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
              transition={{ duration: 0.9, delay: 0.15, ease }}
            >
              <img src={ABOUT_PHOTO} alt="" />
            </motion.button>
          </section>

          <Box index={1} label="About" ready={ready} delay={0.25} className="bx-about-intro">
            <motion.p className="bx-about-opening" {...rise(0.35)}>
              “Kaun hai yeh jo client ki requirements neend mein bhi sunta hai?”
            </motion.p>
            <motion.h1 className="bx-about-me" {...rise(0.45)}>
              <span className="mark-coral">Yep, That's me — Jay Panchal.</span>
            </motion.h1>
            <motion.p className="bx-about-role" {...rise(0.55)}>
              Business Analyst · Solutions Engineer
            </motion.p>
          </Box>
        </Row>

        <div ref={storyRef} className="bx-rows">{rows}</div>

        <Row cols={`repeat(${APPROACH.length}, minmax(0, 1fr))`} className="bx-approach">
          {APPROACH.map((step, i) => (
            <Box key={step.title} index={approachStart + i} label="Approach" delay={i * 0.06}>
              <h3 className="bx-approach-title">{step.title}</h3>
              <p className="bx-approach-line">{step.line}</p>
            </Box>
          ))}
        </Row>
        <Row>
          <NextPage index={box + 1} href="#work-page" title="See the work" note="Roles, numbers and the tools behind them" />
        </Row>
        <Row>
          <SignOff index={box + 2} />
        </Row>
      </Bento>

      <AvatarPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={ABOUT_PHOTO}
        alt="Jay Panchal"
      />
    </div>
  );
}

/** Marker-pen highlights (Jay, Oct 18): each highlighted phrase in the story
 *  sweeps in left to right the first time it scrolls into view. */
function useHighlighter(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const marks = root.querySelectorAll<HTMLElement>('mark, .mark-coral');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      marks.forEach((m) => m.setAttribute('data-lit', ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-lit', '');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 1 },
    );
    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [ref]);
}
