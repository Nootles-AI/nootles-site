export const site = {
  name: "Nootles",
  /** The one place the product's address is written. */
  appUrl: "https://app.nootles.com",
  /* What the site is called everywhere it appears without its page around it:
     the tab strip, a search result, an iMessage bubble. "Pure momentum" is the
     headline and it works in the fold because a readable document sits beside
     it doing the explaining; in a link preview there is no document and no
     page, so the line has to carry the whole job on its own. */
  tagline: "Think on the page",
  description:
    "Prose, diagrams, code, maths and tables in one document — and an AI that reads and edits all of it, in front of you. Nootles is where you go to work something out.",
} as const;
