// Boxes 10–12 on the landing page and their own pages: case studies, Jay's
// photos and his friends. All three say "Coming soon" (Oct 25) until Jay sends
// the content — Gallery and Friends switch to the real thing on their own as soon
// as the lists below have entries.

export type Photo = {
  /** e.g. '/assets/gallery/01.jpg' (put the files in public/assets/gallery). */
  src: string;
  caption: string;
  /** Landscape shot. */
  wide?: boolean;
};

/** Photos Jay has taken. Empty until he sends them. */
export const gallery: Photo[] = [];

export type Friend = {
  /** e.g. '/assets/friends/aarav.jpg' (put the files in public/assets/friends). */
  photo: string;
  name: string;
  /** One little story about them. */
  story: string;
  /** Instagram handle, without the @. */
  instagram: string;
};

/** Jay's friends. Empty until he sends their photos, names and stories. */
export const friends: Friend[] = [];
