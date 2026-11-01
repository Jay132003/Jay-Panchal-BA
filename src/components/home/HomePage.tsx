import ProfileHeader from './ProfileHeader';
import { Connect, QuickFacts } from './Overview';
import About from './About';
import Impact from './Impact';
import Playlists from './Playlists';
import LiveWiringRow from './LiveWiring';
import Skills from './Skills';
import SignOff from './SignOff';
import CaseStudies from './CaseStudy';
import Gallery from './Gallery';
import Friends from './Friends';
import { Bento, Row } from './Bento';

type HomePageProps = {
  onCopyEmail: () => void;
  /** true once the preloader has lifted — gates the hero cascade. */
  ready: boolean;
  /** Seconds to hold the hero cascade (lets the curtain clear first). */
  revealDelay: number;
  /** The landing intro brings the name in itself (see ScriptsIntro). */
  nameFromIntro?: boolean;
};

/** Landing page: one bento grid of ruled boxes. Rows 1–3 fill the first
 *  screen; the rest reveal on scroll. Below the fold (Nov 1): Experience |
 *  Stack, Skills, Case studies, Gallery | Friends, On rotation, Sign-off. */
export default function HomePage({ onCopyEmail, ready, revealDelay, nameFromIntro }: HomePageProps) {
  // Content follows the lines drawing in, row by row.
  const d = revealDelay + 0.35;

  return (
    <div className="bx-page">
      <Bento ready={ready} delay={revealDelay}>
        <div className="bx-hero">
          <ProfileHeader ready={ready} delay={d} nameFromIntro={nameFromIntro} />
          <Row cols="2fr 3fr" className="bx-hero-row">
            <QuickFacts onCopyEmail={onCopyEmail} ready={ready} delay={d + 0.3} />
            <About ready={ready} delay={d + 0.38} />
          </Row>
          <Row cols="13fr 7fr" className="bx-hero-row bx-hero-row--tall">
            <Impact ready={ready} delay={d + 0.46} />
            <Connect ready={ready} delay={d + 0.54} />
          </Row>
        </div>

        {ready && (
          <>
            <LiveWiringRow />
            <Row>
              <Skills />
            </Row>
            <Row>
              <CaseStudies />
            </Row>
            <Row cols="1fr 1fr">
              <Gallery />
              <Friends />
            </Row>
            <Row>
              <Playlists />
            </Row>
            <Row>
              <SignOff index={12} closing />
            </Row>
          </>
        )}
      </Bento>
    </div>
  );
}
