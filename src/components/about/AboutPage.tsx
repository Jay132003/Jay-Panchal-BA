import { motion } from 'motion/react';
import Quote from '../Quote';
import Footer from '../Footer';

const ease = [0.22, 1, 0.36, 1] as const;

const secV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease },
  },
} as const;

export function AboutPage() {
  return (
    <>
      <motion.main
        className="page-shell"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
        }}
      >
        {/* ── Intro ─────────────────────────────────── */}
        <motion.section className="ab-intro content-section" variants={secV}>
          <div className="ab-intro-wrap">
            <div className="ab-photo-col">
              <img
                src="/assets/Jay%20-%20About.jpg"
                alt="Jay Panchal"
                className="ab-portrait"
              />
            </div>

            <div className="ab-info-col">
              <p className="exp-label">About</p>
              <p className="ab-opening-quote">
                "Kaun hai yeh jo client ki requirements neend mein bhi sunta hai?"
              </p>
              <p className="ab-intro-me">
                <span className="mark-coral">Yep, That's me — Jay Panchal.</span>
              </p>
              <p className="role" style={{ marginTop: '8px' }}>
                Business Analyst · Solutions Engineer
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Story ─────────────────────────────────── */}
        <motion.section className="ab-story content-section" variants={secV}>
          <p className="exp-label" style={{ marginBottom: '20px' }}>The Story</p>

          <p className="ab-para">
            My journey didn't begin with a fancy title or a big break. It began with curiosity,
            ambition, and a constant desire to understand how businesses actually work behind
            the scenes. Because honestly, software toh sab bana lete hain —{' '}
            <strong><mark>asli khel toh yeh samajhne mein hai ki client ko chahiye kya.</mark></strong>
          </p>

          <p className="ab-para">
            I started my career at QSpiders, where I built a strong foundation in SQL, SDLC,
            and software development principles. It was here that I learned an important lesson:{' '}
            <mark>before solving a problem, you need to understand why it exists in the first place.</mark>
          </p>

          <p className="ab-para">
            Later, I joined BrainyBeam and worked on an Android-based Road Side Assistant
            application. It was my first experience taking an idea and turning it into a real product.
          </p>

          <p className="ab-para">
            And trust me —{' '}
            <strong><span className="mark-coral">pehla production bug dekhne ke baad jo character development hota hai na… uski alag hi kahaani hai.</span></strong>
          </p>

          <p className="ab-para">
            In June 2024, I joined Neomenta Inc, a U.S.-based startup. I initially entered as
            a developer, but very quickly found myself drawn toward something beyond code —
            understanding people, processes, and business challenges.
          </p>

          <p className="ab-para">
            That's when I discovered my passion for Business Analysis.
          </p>

          <p className="ab-para">
            The transition felt natural because I genuinely enjoy asking questions. Sometimes
            so many questions that clients probably wonder whether I'm{' '}
            <mark>gathering requirements or preparing for a crime investigation.</mark>
          </p>

          <p className="ab-para">
            At Neome, I learned that successful solutions aren't built by assumptions; they're
            built by <mark>listening carefully, identifying hidden challenges,</mark> and connecting
            business needs with the right technology.
          </p>

          <p className="ab-para">
            Since then, I have worked on CRM systems, HRMS platforms, FMCG modules, workflow
            automation solutions, and low-code business applications. Every project brought a
            different challenge, but the pattern remained the same:{' '}
            <mark>businesses rarely struggle because they lack ideas — they struggle because processes become messy as they grow.</mark>
          </p>

          <div className="ab-pullquote">
            <span className="mark-coral">Aur wahi mess dekhkar mera dimaag bolta hai</span> —{' '}
            <mark>"Challenge accepted."</mark>
          </div>

          <p className="ab-para">
            One thing I have learned throughout my journey is that clients don't always need
            more software. Sometimes they simply need fewer manual steps, fewer spreadsheets,
            fewer follow-ups, and fewer headaches.
          </p>

          <p className="ab-para">
            <mark>The best solution is often the one that makes people forget a problem ever existed.</mark>
          </p>

          <p className="ab-para">
            I enjoy working at the intersection of business and technology, where conversations
            become requirements, requirements become workflows, and workflows become measurable
            business outcomes.
          </p>

          <p className="ab-para">
            My approach is simple:{' '}
            <strong>Understand deeply. Design thoughtfully. Deliver meaningfully.</strong>
          </p>

          <p className="ab-para">
            Because at the end of the day, dashboards look great, reports look impressive, and
            automations look smart — but if the client still has to call someone five times to
            get work done,{' '}
            <strong><span className="mark-coral">toh phir system sirf digital hai, useful nahi.</span></strong>
          </p>

          <p className="ab-para">
            Today, I focus on building scalable systems, AI-powered workflows, and business
            solutions that simplify operations and help organizations grow efficiently.
          </p>

          <div className="ab-pullquote">
            I don't just gather requirements.{' '}
            <mark>I take ownership of problems until they stop being problems.</mark>
          </div>
        </motion.section>

        {/* ── Quote ─────────────────────────────────── */}
        <motion.div variants={secV}>
          <Quote />
        </motion.div>
      </motion.main>

      <Footer />
    </>
  );
}
