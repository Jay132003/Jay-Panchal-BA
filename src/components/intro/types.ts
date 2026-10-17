/** Props of the landing intro (ScriptsIntro). */
export type IntroProps = {
  /** The intro has handed over to the grid: time for the page to show itself. */
  onReveal: () => void;
  /** The overlay has faded away and can be unmounted. */
  onDone: () => void;
};
