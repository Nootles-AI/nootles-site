# nootles-site

The marketing site for [Nootles](https://app.nootles.com) — the page outside the door.

```bash
npm install
npm run dev     # http://localhost:3000
npm run check   # types, lint, contrast, diagram geometry
npm run build
```

## Shape

Eight pages, one composition. `/` speaks to anyone who plans; `/for/<slug>` says the
same thing to one bench. What changes between them is the sentence at the top and the
document under it — and the document is the argument, so that is the only difference
worth having.

```
app/                      routes: / and /for/[audience] (all static)
components/Sheet.tsx      the drawing sheet: frame, title block, caption
components/Block.tsx      one block of a document, set the way the editor sets it
components/Recording.tsx  sheet one, written rather than printed
components/Diagram.tsx    outlines + connectors in SVG, labels in boxes over it
content/audiences.ts      the eight pages, the eight documents, and the take
lib/doc.ts                the document model and the edge router
scripts/                  the two checks that are decidable
```

Sheet one is the exception to "one composition": it is the same document as the
others, in the same blocks at the same measure, but it writes itself in front of
you on a loop — a line finished and accepted with Tab, a sentence read as a
drawing, and that drawing dragged into shape. The beats live in `take` beside the
document they write, and `check:geometry` proves the two still point at each
other. Anyone who has asked not to be moved gets the last frame instead.

## The one rule

The imagery on this site is the product's own surface. Not a screenshot of it, not a
mock of it — the same document model, set with the same type at the same measure, so
what is promised at the door is what arrives after it. If the app's typography or
tokens move, these should move with them.

Adding a page means adding an entry to `content/audiences.ts`. The route, the metadata,
the index row and the static build all follow from it.

## Checks

`npm run check` runs four things, two of which are worth explaining:

- **`check:contrast`** measures every text-on-background pair the design actually
  produces, in OKLCH, against WCAG. Colour is not judged by eye here.
- **`check:geometry`** proves the hand-laid diagrams are sound: ids resolve, boxes stay
  inside their frame and don't overlap, and — the one that matters — every connector
  runs in the direction it left in. A box nudged 20px can make an edge leave by the
  right and double back past its own start, which looks like a bug because it is one.
