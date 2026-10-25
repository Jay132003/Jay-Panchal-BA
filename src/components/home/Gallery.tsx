import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { gallery, type Photo } from '../../data/life';
import { Box } from './Bento';
import { ViewAll } from './CaseStudy';
import { DevelopingReel } from './Soon';

// Jay's photos (Oct 25), after a parallax reference he shared. Until he sends
// them the box shows the "developing" stand-in from Soon.tsx. The reel: three columns
// drift at different speeds as the page scrolls, the middle one against the
// other two. A spring on the scroll gives the gliding feel without taking over
// the page's own scrolling (no Lenis). Each column repeats its shots three times so it
// never runs dry inside the window, even on a narrow phone.

/** Where each column starts and ends (px) over the box's trip through the viewport. */
const RANGES: [number, number][] = [
  [-60, -560],
  [-720, -160],
  [-20, -760],
];

export default function Gallery({ index = 11 }: { index?: number }) {
  return (
    <Box index={index} label="Gallery" aside={<ViewAll href="#gallery-page" />} className="bx-gallery">
      {gallery.length ? <GalleryReel /> : <DevelopingReel />}
    </Box>
  );
}

/** The real reel, once Jay's photos are in `gallery`. */
export function GalleryReel({ height = 600 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const glide = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const cols = RANGES.map((_, c) => gallery.filter((_, i) => i % RANGES.length === c));

  return (
    <div ref={ref} className="gl-stage" style={{ height }}>
      {cols.map((photos, c) => (
        <Column key={c} photos={[...photos, ...photos, ...photos]} progress={glide} range={RANGES[c]} still={!!reduce} />
      ))}
    </div>
  );
}

function Column({
  photos,
  progress,
  range,
  still,
}: {
  photos: Photo[];
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const y = useTransform(progress, [0, 1], range);
  return (
    <motion.div className="gl-col" style={{ y: still ? (range[0] + range[1]) / 2 : y }}>
      {photos.map((p, i) => (
        <figure key={i} className="gl-shot">
          <img
            src={p.src}
            alt={i < photos.length / 3 ? p.caption : ''}
            width={800}
            height={p.wide ? 600 : 1040}
            decoding="async"
            draggable={false}
          />
          <figcaption>{p.caption}</figcaption>
        </figure>
      ))}
    </motion.div>
  );
}
