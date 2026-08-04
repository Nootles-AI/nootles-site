import type { Doc } from "@/lib/doc";

/* Eight pages, eight documents.
   The page each audience lands on shows work from their own bench — that is the
   whole reason the segment pages exist rather than being one page with the noun
   swapped. Every diagram is laid out in document pixels inside the 516 the
   600px measure leaves after its margins. */

export type Audience = {
  slug: string;
  /** How the audience index names it. */
  label: string;
  /** What they make, in three or four words. */
  makes: string;
  headline: string;
  sub: string;
  doc: Doc;
};

/** The baseline page. Not in the index — it is the page the index sits on. */
export const baseline: Audience = {
  slug: "",
  label: "Everyone else",
  makes: "Anything you have to think about first",
  headline: "Somewhere to think it all the way through.",
  sub: "Write the plan and draw it on the same page. An AI reads both, edits in front of you, and waits to be told yes.",
  doc: {
    alt: "A page weighing two ways to build the same thing, with the decision drawn directly under the paragraph arguing it.",
    blocks: [
      { kind: "title", text: "Which way to build it" },
      {
        kind: "text",
        text: "Two ways in. The flat model ships this week and boxes us in the moment a second team asks for their own rules. The scoped one costs a fortnight.",
      },
      {
        kind: "text",
        text: "So the question isn't which is cleaner. It's whether the second team is real, and how soon",
        streaming: true,
      },
      { kind: "rule" },
      {
        kind: "diagram",
        diagram: {
          w: 516,
          h: 220,
          nodes: [
            { id: "q", label: "Per-team rules?", x: 183, y: 0, w: 150, h: 66, shape: "diamond" },
            { id: "a", label: "Flat model", note: "3 days", x: 0, y: 170, w: 210, h: 50 },
            { id: "b", label: "Scoped model", note: "2 weeks", x: 306, y: 170, w: 210, h: 50, fill: true },
          ],
          edges: [
            { from: "q", to: "a", label: "no" },
            { from: "q", to: "b", label: "yes" },
          ],
        },
      },
    ],
  },
};

export const audiences: Audience[] = [
  {
    slug: "engineering",
    label: "Engineering",
    makes: "RFCs, architecture, incident notes",
    headline: "The design doc, and the design.",
    sub: "Write the argument and draw the system in one page. Tab finishes the sentence, and the shape after it.",
    doc: {
      alt: "An ingestion pipeline written out in prose, with the services and the dead-letter path drawn beneath it.",
      blocks: [
        { kind: "title", text: "Ingestion, v3" },
        {
          kind: "text",
          text: "Events land in a queue rather than going straight to the store, so a slow write stops being the client's problem. Anything that fails twice goes to the dead letter and pages nobody.",
        },
        {
          kind: "text",
          text: "Open question: whether the worker should batch, and at what size",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 170,
            nodes: [
              { id: "client", label: "Client", x: 0, y: 0, w: 112, h: 50 },
              { id: "api", label: "API", x: 134, y: 0, w: 112, h: 50 },
              { id: "queue", label: "Queue", x: 268, y: 0, w: 112, h: 50, fill: true },
              { id: "store", label: "Store", x: 402, y: 0, w: 114, h: 50 },
              { id: "dlq", label: "Dead letter", x: 268, y: 120, w: 112, h: 50 },
            ],
            edges: [
              { from: "client", to: "api" },
              { from: "api", to: "queue" },
              { from: "queue", to: "store" },
              { from: "queue", to: "dlq", label: "2 fails", dashed: true },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "product",
    label: "Product",
    makes: "Specs, flows, roadmaps",
    headline: "The spec and the flow can't drift apart.",
    sub: "Because they are the same page. Change the paragraph, the drawing is right there to change with it.",
    doc: {
      alt: "A checkout spec with the happy path and the saved-card shortcut drawn under the paragraph that describes them.",
      blocks: [
        { kind: "title", text: "Checkout, v2" },
        {
          kind: "text",
          text: "Four steps for a first-time buyer, two for anyone we already have a card for. The whole rewrite is really just that second row.",
        },
        {
          kind: "text",
          text: "Returning buyers are 71% of orders, so the shortcut is the default path, not the edge case",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 170,
            nodes: [
              { id: "cart", label: "Cart", x: 0, y: 0, w: 112, h: 50 },
              { id: "addr", label: "Address", x: 134, y: 0, w: 112, h: 50 },
              { id: "pay", label: "Pay", x: 268, y: 0, w: 112, h: 50 },
              { id: "done", label: "Done", x: 402, y: 0, w: 114, h: 50, shape: "round" },
              { id: "saved", label: "Saved card", x: 134, y: 120, w: 112, h: 50, fill: true },
            ],
            edges: [
              { from: "cart", to: "addr" },
              { from: "addr", to: "pay" },
              { from: "pay", to: "done" },
              { from: "cart", to: "saved", dashed: true },
              { from: "saved", to: "pay", label: "skip", dashed: true },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "business",
    label: "Business",
    makes: "Memos, process, planning",
    headline: "Memos that show their working.",
    sub: "The argument, the numbers, and the one diagram people actually remember afterwards.",
    doc: {
      alt: "A territory memo with the lead-routing rule drawn under the paragraph that argues for it.",
      blocks: [
        { kind: "title", text: "Q3 territory" },
        {
          kind: "text",
          text: "Every inbound lead goes to a named rep today, which is why the reps who cover the small accounts are drowning and closing nothing.",
        },
        {
          kind: "text",
          text: "Proposal: qualify first. Anything under the line goes to nurture and stays there until it asks",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 168,
            nodes: [
              { id: "in", label: "Inbound", x: 0, y: 8, w: 140, h: 50 },
              { id: "q", label: "Fits ICP?", x: 180, y: 0, w: 156, h: 66, shape: "diamond" },
              { id: "rep", label: "Named rep", x: 376, y: 8, w: 140, h: 50, fill: true },
              { id: "nurture", label: "Nurture", x: 376, y: 118, w: 140, h: 50 },
            ],
            edges: [
              { from: "in", to: "q" },
              { from: "q", to: "rep", label: "yes" },
              { from: "q", to: "nurture", label: "no" },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "design",
    label: "Design",
    makes: "Rationale, flows, wireframes",
    headline: "Rationale you can point at.",
    sub: "The reasoning beside the flow, and neither one a screenshot of the other.",
    doc: {
      alt: "An onboarding flow with the skip path drawn beneath the note explaining why it exists.",
      blocks: [
        { kind: "title", text: "Onboarding, second pass" },
        {
          kind: "text",
          text: "The template step tested badly: people picked one to get past it, then never used it. So it stops being a wall and becomes an offer you can walk past.",
        },
        {
          kind: "text",
          text: "Skipping lands on a blank page with the same three prompts, which is where they ended up anyway",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 184,
            nodes: [
              { id: "s1", label: "Sign up", x: 0, y: 0, w: 150, h: 84 },
              { id: "s2", label: "Pick a template", x: 183, y: 0, w: 150, h: 84 },
              { id: "s3", label: "First page", x: 366, y: 0, w: 150, h: 84, fill: true },
              { id: "skip", label: "Blank page", x: 183, y: 134, w: 150, h: 50 },
            ],
            edges: [
              { from: "s1", to: "s2" },
              { from: "s2", to: "s3" },
              { from: "s2", to: "skip", label: "skip", dashed: true },
              { from: "skip", to: "s3", dashed: true },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "making",
    label: "Making",
    makes: "Cut lists, joinery, shop drawings",
    headline: "Work it out before you cut.",
    sub: "Stock, joinery and the drawing on one page — and the page comes out to the bench with you.",
    doc: {
      alt: "A bench plan: the paragraph about grain direction, then the parts drawn out with their counts.",
      blocks: [
        { kind: "title", text: "Walnut bench" },
        {
          kind: "text",
          text: "One board, quartersawn, so the top and the legs come off the same stick and the colour matches. The stretcher is the offcut — nobody sees it.",
        },
        {
          kind: "text",
          text: "Draw-bored mortise and tenon at the legs. No hardware anywhere in it",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 180,
            nodes: [
              { id: "top", label: "Top", note: "1400 × 320 × 40", x: 183, y: 0, w: 150, h: 56, fill: true },
              { id: "legL", label: "Leg", note: "2 off", x: 0, y: 120, w: 150, h: 60 },
              { id: "rail", label: "Stretcher", note: "1 off", x: 183, y: 120, w: 150, h: 60 },
              { id: "legR", label: "Leg", note: "2 off", x: 366, y: 120, w: 150, h: 60 },
            ],
            edges: [
              { from: "top", to: "legL", label: "M&T" },
              { from: "top", to: "rail" },
              { from: "top", to: "legR", label: "M&T" },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "film",
    label: "Film",
    makes: "Beats, blocking, shot order",
    headline: "See the sequence before you shoot it.",
    sub: "The beat on the left, the order on the right. Move a shot and the page keeps up.",
    doc: {
      alt: "A scene breakdown: the note about where the tension sits, then the shot order with an insert hanging off it.",
      blocks: [
        { kind: "title", text: "Sc. 14 — the kitchen" },
        {
          kind: "text",
          text: "She reads it standing up and doesn't sit down. Hold the wide long enough that the audience gets bored before she moves — the boredom is the point.",
        },
        {
          kind: "text",
          text: "Insert on the clock only if the wide runs past forty seconds",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 168,
            nodes: [
              { id: "w1", label: "WIDE", note: "estab.", x: 0, y: 0, w: 116, h: 54 },
              { id: "ots", label: "OTS", note: "on her", x: 133, y: 0, w: 116, h: 54 },
              { id: "cu", label: "CU", note: "the letter", x: 266, y: 0, w: 116, h: 54, fill: true },
              { id: "w2", label: "WIDE", note: "she leaves", x: 399, y: 0, w: 117, h: 54 },
              { id: "ins", label: "INSERT", note: "the clock", x: 266, y: 114, w: 116, h: 54 },
            ],
            edges: [
              { from: "w1", to: "ots" },
              { from: "ots", to: "cu" },
              { from: "cu", to: "w2" },
              { from: "cu", to: "ins", label: "if long", dashed: true },
            ],
          },
        },
      ],
    },
  },

  {
    slug: "study",
    label: "Study",
    makes: "Essay plans, revision, notes",
    headline: "Think the argument all the way through.",
    sub: "The plan, the notes, and the diagram you'll be asked to reproduce — on one page you actually revise from.",
    doc: {
      alt: "An essay plan with the causal chain drawn under the paragraph that sets out the argument.",
      blocks: [
        { kind: "title", text: "Essay plan — why it failed" },
        {
          kind: "text",
          text: "The argument is not that reparations were unpayable. It's that the attempt to pay them destroyed the currency, and the currency was the last thing holding the settlement together.",
        },
        {
          kind: "text",
          text: "Counter-argument to deal with in ¶4: the 1924 recovery. Answer — it was borrowed",
          streaming: true,
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 516,
            h: 172,
            nodes: [
              { id: "c1", label: "Reparations", x: 0, y: 0, w: 158, h: 56 },
              { id: "c2", label: "Hyperinflation", x: 179, y: 0, w: 158, h: 56 },
              { id: "c3", label: "Loss of faith", x: 358, y: 0, w: 158, h: 56 },
              { id: "end", label: "Collapse by 1933", x: 179, y: 116, w: 158, h: 56, fill: true },
            ],
            edges: [
              { from: "c1", to: "c2" },
              { from: "c2", to: "c3" },
              { from: "c2", to: "end" },
              { from: "c3", to: "end" },
            ],
          },
        },
      ],
    },
  },
];

export const bySlug = (slug: string) => audiences.find((a) => a.slug === slug);
