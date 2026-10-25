import { useEffect, useState, type ReactNode } from 'react';
import { gallery } from '../data/life';
import { AnimatedTestimonials } from './ui/animated-testimonials';
import { Bento, Box, Row } from './home/Bento';
import { FRIEND_CARDS } from './home/Friends';
import { GalleryReel } from './home/Gallery';
import NextPage from './home/NextPage';
import SignOff from './home/SignOff';
import { CardDeck, DevelopingReel, SoonBadge, UntanglingBoard } from './home/Soon';

// The pages behind "View all" on boxes 10–12 (Oct 25): case studies, gallery and
// friends. Jay has much more to show than a box holds; until it's ready each page
// says what's coming, over a large version of its box's stand-in.

type LifePageProps = {
  label: string;
  title: string;
  intro: string;
  stageLabel: string;
  stage: ReactNode;
  next: { href: string; title: string; note: string };
};

function LifePage({ label, title, intro, stageLabel, stage, next }: LifePageProps) {
  // No intro here: the lines start drawing as soon as the page is in.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="bx-page">
      <Bento ready={ready} delay={0.05}>
        <Row>
          <Box index={1} label={label} aside={<SoonBadge />} ready={ready} delay={0.2} className="bx-page-hero">
            <h1 className="bx-page-title">{title}</h1>
            <p className="bx-page-intro">{intro}</p>
          </Box>
        </Row>
        <Row>
          <Box index={2} label={stageLabel} ready={ready} delay={0.35} className="soon-page-stage">
            {stage}
          </Box>
        </Row>
        <Row>
          <NextPage index={3} {...next} />
        </Row>
        <Row>
          <SignOff index={4} />
        </Row>
      </Bento>
    </div>
  );
}

export function CaseStudiesPage() {
  return (
    <LifePage
      label="Case studies"
      title="Case studies, in the works."
      intro="The projects I'd rather walk you through than list: the problem, the messy middle, the calls I made and what changed. The first one is being written now."
      stageLabel="In the works"
      stage={
        <>
          <UntanglingBoard height={380} />
          <Plan
            items={[
              'The problem, and who it was costing',
              'What I found once I dug in',
              'What I built, and the trade-offs',
              'What changed, in numbers',
            ]}
          />
        </>
      }
      next={{ href: '#gallery-page', title: 'Gallery', note: "Photos I've taken" }}
    />
  );
}

export function GalleryPage() {
  return (
    <LifePage
      label="Gallery"
      title="Through my lens."
      intro="Streets, skies and whatever made me stop walking. Every photo here is one I took myself. They're still developing."
      stageLabel="Darkroom"
      stage={gallery.length ? <GalleryReel height={760} /> : <DevelopingReel height={760} />}
      next={{ href: '#friends-page', title: 'Friends', note: 'The people behind the weekends' }}
    />
  );
}

export function FriendsPage() {
  return (
    <LifePage
      label="Friends"
      title="The people behind the weekends."
      intro="The friends I spend my time outside work with. Each one gets a photo, their name, their Instagram and one little story."
      stageLabel="The crew"
      stage={
        FRIEND_CARDS.length ? (
          <AnimatedTestimonials testimonials={FRIEND_CARDS} autoplay />
        ) : (
          <div className="soon-page-friends">
            <CardDeck height={380} />
            <div>
              <SoonBadge />
              <p className="soon-title">Every card will have</p>
              <Plan items={['A photo', 'Their name', 'Their Instagram', 'One little story']} />
            </div>
          </div>
        )
      }
      next={{ href: '#home', title: 'Home', note: 'Back to the start' }}
    />
  );
}

/** A numbered list of what's coming. */
function Plan({ items }: { items: string[] }) {
  return (
    <ol className="soon-list">
      {items.map((item, i) => (
        <li key={item}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
