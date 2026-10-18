import ProfileHeader from './ProfileHeader';
import { Connect, QuickFacts } from './Overview';
import About from './About';
import Impact from './Impact';
import Playlists from './Playlists';
import Experience from './Experience';
import { StackBox } from './Stack';
import Skills, { Education } from './Skills';
import SignOff from './SignOff';
import { ActivityBox } from './Activity';
import { Bento, Row } from './Bento';
import { LinkedHoverProvider } from './LinkedHover';

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
 *  screen; the rest reveal on scroll. Row splits follow Jay's sketch. */
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
            <Row>
              <Playlists />
            </Row>
            <LinkedHoverProvider>
              <Row cols="11fr 9fr">
                <Experience />
                <StackBox />
              </Row>
            </LinkedHoverProvider>
            <Row cols="1fr 3fr">
              <Education />
              <Skills />
            </Row>
            <Row>
              <ActivityBox />
            </Row>
            <Row>
              <SignOff />
            </Row>
          </>
        )}
      </Bento>
    </div>
  );
}
