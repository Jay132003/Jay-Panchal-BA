import { useState } from 'react';
import { motion } from 'motion/react';
import Footer from '../Footer';
import AvatarPreview from '../AvatarPreview';
import { QuoteCard } from '../home/Glance';
import { Panel, Reveal, Separator } from '../home/Panel';

const ABOUT_PHOTO = '/assets/Jay%20-%20About.jpg';

const ease = [0.16, 1, 0.3, 1] as const;

// Each step quotes a line from the story below.
const APPROACH = [
  { title: 'Understand deeply', line: 'Before solving a problem, understand why it exists in the first place.' },
  { title: 'Design thoughtfully', line: 'Conversations become requirements, requirements become workflows.' },
  { title: 'Deliver meaningfully', line: 'Workflows become measurable business outcomes.' },
] as const;

export function AboutPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, delay: d, ease },
  });

  return (
    <>
      <main className="gx-page">
        <div className="gx-col">
          {/* ── Intro ─────────────────────────────────── */}
          <section className="gx-about-hero gx-rule-bottom" aria-labelledby="about-title">
            <motion.div className="gx-about-photo-cell" {...rise(0)}>
              <button
                type="button"
                className="gx-about-photo"
                onClick={() => setPreviewOpen(true)}
                aria-label="View photo of Jay Panchal"
              >
                <img src={ABOUT_PHOTO} alt="Jay Panchal" />
              </button>
            </motion.div>

            <div className="gx-about-info">
              <motion.p className="gx-hero-label" {...rise(0.08)}>About</motion.p>
              <motion.p className="gx-about-opening" {...rise(0.14)}>
                “Kaun hai yeh jo client ki requirements neend mein bhi sunta hai?”
              </motion.p>
              <motion.h1 id="about-title" className="gx-about-me" {...rise(0.2)}>
                <span className="mark-coral">Yep, That's me — Jay Panchal.</span>
              </motion.h1>
              <motion.p className="gx-about-role" {...rise(0.26)}>
                Business Analyst · Solutions Engineer
              </motion.p>
            </div>
          </section>
          <Separator />

          {/* ── Story ─────────────────────────────────── */}
          <Panel title="The Story">
            <Reveal className="gx-story">
              <p>
                My journey didn't begin with a fancy title or a big break. It began with curiosity,
                ambition, and a constant desire to understand how businesses actually work behind
                the scenes. Because honestly, software toh sab bana lete hain —{' '}
                <strong><mark>asli khel toh yeh samajhne mein hai ki client ko chahiye kya.</mark></strong>
              </p>
              <p>
                I started my career at QSpiders, where I built a strong foundation in SQL, SDLC,
                and software development principles. It was here that I learned an important lesson:{' '}
                <mark>before solving a problem, you need to understand why it exists in the first place.</mark>
              </p>
              <p>
                Later, I joined BrainyBeam and worked on an Android-based Road Side Assistant
                application. It was my first experience taking an idea and turning it into a real product.
              </p>
              <p>
                And trust me —{' '}
                <strong><span className="mark-coral">pehla production bug dekhne ke baad jo character development hota hai na… uski alag hi kahaani hai.</span></strong>
              </p>
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
              <p>
                Since then, I have worked on CRM systems, HRMS platforms, FMCG modules, workflow
                automation solutions, and low-code business applications. Every project brought a
                different challenge, but the pattern remained the same:{' '}
                <mark>businesses rarely struggle because they lack ideas — they struggle because processes become messy as they grow.</mark>
              </p>
            </Reveal>

            <Reveal className="gx-pullquote gx-rule-top gx-rule-bottom">
              <span className="mark-coral">Aur wahi mess dekhkar mera dimaag bolta hai</span> —{' '}
              <mark>"Challenge accepted."</mark>
            </Reveal>

            <Reveal className="gx-story">
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
              <p>
                Today, I focus on building scalable systems, AI-powered workflows, and business
                solutions that simplify operations and help organizations grow efficiently.
              </p>
            </Reveal>

            <Reveal className="gx-pullquote gx-rule-top">
              I don't just gather requirements.{' '}
              <mark>I take ownership of problems until they stop being problems.</mark>
            </Reveal>
          </Panel>
          <Separator />

          {/* ── Approach ──────────────────────────────── */}
          <Panel title="Approach">
            <div className="gx-approach">
              {APPROACH.map((step, i) => (
                <Reveal key={step.title} className="gx-approach-cell" delay={i * 0.06}>
                  <span className="gx-index">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="gx-approach-title">{step.title}</h3>
                  <p className="gx-approach-line">{step.line}</p>
                </Reveal>
              ))}
            </div>
          </Panel>
          <Separator />

          {/* ── Quote ─────────────────────────────────── */}
          <Panel title="Before you go">
            <div className="gx-bento">
              <QuoteCard />
            </div>
          </Panel>
        </div>
      </main>

      <Footer />

      <AvatarPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={ABOUT_PHOTO}
        alt="Jay Panchal"
      />
    </>
  );
}
