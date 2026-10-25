import { friends } from '../../data/life';
import { AnimatedTestimonials } from '../ui/animated-testimonials';
import { Box } from './Bento';
import { ViewAll } from './CaseStudy';
import { CardDeck, SoonBadge } from './Soon';

/** Jay's friends as Aceternity cards: photo, name, @instagram and one little story. */
export const FRIEND_CARDS = friends.map((f) => ({
  src: f.photo,
  name: f.name,
  designation: `@${f.instagram}`,
  link: `https://www.instagram.com/${f.instagram}/`,
  quote: f.story,
}));

/** Box 12 (Oct 25): a shuffling deck of blank cards until Jay sends his friends' photos. */
export default function Friends({ index = 12 }: { index?: number }) {
  return (
    <Box index={index} label="Friends" aside={<ViewAll href="#friends-page" />} className="bx-friends">
      {FRIEND_CARDS.length ? (
        <AnimatedTestimonials testimonials={FRIEND_CARDS} autoplay />
      ) : (
        <div className="soon-friends">
          <CardDeck />
          <div>
            <SoonBadge />
            <p className="soon-title">The people I spend my time off with.</p>
            <p className="soon-note">Their faces, names and one little story each.</p>
          </div>
        </div>
      )}
    </Box>
  );
}

