import type { Doc } from "@/lib/doc";

/* Eight pages, eight documents.

   The page each audience lands on shows work from their own bench, and — this
   is the part that matters — shows it in the blocks that bench actually
   reaches for. Engineering gets a code block, making gets arithmetic that
   evaluates, business gets a chart drawn from its own table. If two of these
   documents could swap their nouns and still be right, one of them is not
   pulling its weight and should be deleted rather than rewritten.

   Every diagram is laid out in document pixels inside the 532 that the 600px
   measure leaves after its margins. `scripts/geometry.mts` checks that the
   boxes fit, that none of them overlap, and that no connector doubles back. */

export type Audience = {
  slug: string;
  /** How the register names it, and what the sheet's title block is stamped with. */
  label: string;
  /** What they make, in four or five words. */
  makes: string;
  headline: string;
  sub: string;
  doc: Doc;
};

/** The baseline page. Not in the register — it is the sheet the register sits on. */
export const baseline: Audience = {
  slug: "",
  label: "General",
  makes: "Anything you have to think about first",
  headline: "Write with pure momentum.",
  sub: "Prose, diagrams, code, maths and tables in one document — and an AI that reads and edits all of it, in front of you.",
  doc: {
    alt: "A page weighing two ways to build the same thing: the decision drawn as a diagram, then the same two options ruled up as a table underneath it.",
    blocks: [
      { kind: "title", text: "Which way to build it" },
      {
        kind: "text",
        text: "Two ways in. The flat model ships this week and boxes us in the moment a second team asks for their own rules. The scoped one costs a fortnight.",
      },
      {
        kind: "diagram",
        diagram: {
          w: 532,
          h: 220,
          nodes: [
            { id: "q", label: "Per-team rules?", x: 191, y: 0, w: 150, h: 66, shape: "diamond" },
            { id: "a", label: "Flat model", note: "3 days", x: 0, y: 170, w: 210, h: 50 },
            { id: "b", label: "Scoped model", note: "2 weeks", x: 322, y: 170, w: 210, h: 50, fill: true },
          ],
          edges: [
            { from: "q", to: "a", label: "no" },
            { from: "q", to: "b", label: "yes" },
          ],
        },
      },
      { kind: "rule" },
      {
        kind: "table",
        head: ["Option", "Ships in", "If a second team asks"],
        rows: [
          ["Flat model", "3 days", "Rewrite the store"],
          ["Scoped model", "2 weeks", "Costs nothing"],
        ],
      },
      {
        kind: "text",
        text: "So the question isn't which is cleaner. It's whether the second team is real, and how soon",
        streaming: true,
      },
    ],
  },
};

export const audiences: Audience[] = [
  {
    slug: "engineering",
    label: "Engineering",
    makes: "RFCs, architecture, incident notes",
    headline: "Draft with pure momentum.",
    sub: "The design doc and the design, on one page. Write the argument, draw the system, keep the handler beside it — and the model reads all three.",
    doc: {
      alt: "An ingestion design: a paragraph of reasoning, the retry rule as real TypeScript, then the services and the dead-letter path drawn beneath both.",
      blocks: [
        { kind: "title", text: "Ingestion, v3" },
        {
          kind: "text",
          text: "Events land in a queue rather than going straight to the store, so a slow write stops being the client's problem. Anything that fails twice goes to the dead letter and pages nobody.",
        },
        {
          kind: "code",
          lang: "TypeScript",
          lines: [
            "// two attempts, then it stops being ours",
            "if (msg.attempts >= 2) {",
            "  return deadLetter.put(msg)",
            "}",
            "return store.write(msg.body)",
          ],
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 170,
            nodes: [
              { id: "client", label: "Client", x: 0, y: 0, w: 112, h: 50 },
              { id: "api", label: "API", x: 140, y: 0, w: 112, h: 50 },
              { id: "queue", label: "Queue", x: 280, y: 0, w: 112, h: 50, fill: true },
              { id: "store", label: "Store", x: 420, y: 0, w: 112, h: 50 },
              { id: "dlq", label: "Dead letter", x: 280, y: 120, w: 112, h: 50 },
            ],
            edges: [
              { from: "client", to: "api" },
              { from: "api", to: "queue" },
              { from: "queue", to: "store" },
              { from: "queue", to: "dlq", label: "2 fails", dashed: true },
            ],
          },
        },
        {
          kind: "text",
          text: "Open question: whether the worker should batch, and at what size",
          streaming: true,
        },
      ],
    },
  },

  {
    slug: "product",
    label: "Product",
    makes: "Specs, flows, roadmaps",
    headline: "Plan with pure momentum.",
    sub: "The spec and the flow can't drift apart, because they are the same page. Change the paragraph and the drawing is right there to change with it.",
    doc: {
      alt: "A checkout spec: the happy path and the saved-card shortcut drawn out, then a table showing which of the two most orders actually take.",
      blocks: [
        { kind: "title", text: "Checkout, v2" },
        {
          kind: "text",
          text: "Four steps for a first-time buyer, two for anyone we already hold a card for. The whole rewrite is really just that second row.",
        },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 170,
            nodes: [
              { id: "cart", label: "Cart", x: 0, y: 0, w: 112, h: 50 },
              { id: "addr", label: "Address", x: 140, y: 0, w: 112, h: 50 },
              { id: "pay", label: "Pay", x: 280, y: 0, w: 112, h: 50 },
              { id: "done", label: "Done", x: 420, y: 0, w: 112, h: 50, shape: "round" },
              { id: "saved", label: "Saved card", x: 140, y: 120, w: 112, h: 50, fill: true },
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
        { kind: "rule" },
        {
          kind: "table",
          head: ["Case", "Steps", "Share of orders"],
          numeric: [1, 2],
          rows: [
            ["First-time buyer", "4", "29%"],
            ["Card on file", "2", "71%"],
          ],
        },
        {
          kind: "text",
          text: "Returning buyers are most of the book, so the shortcut is the default path and not the edge case",
          streaming: true,
        },
      ],
    },
  },

  {
    slug: "business",
    label: "Business",
    makes: "Memos, process, planning",
    headline: "Decide with pure momentum.",
    sub: "Memos that show their working: the argument, the numbers it rests on, and the chart drawn straight from them. Nobody takes the conclusion on trust.",
    doc: {
      alt: "A territory memo: close rates plotted by segment with the failing one filled in, then the same figures ruled up as a table beneath the chart.",
      blocks: [
        { kind: "title", text: "Q3 territory" },
        {
          kind: "text",
          text: "Every inbound lead goes to a named rep today, which is why the reps carrying the small accounts are drowning and closing almost nothing.",
        },
        {
          kind: "chart",
          chart: {
            shape: "bars",
            w: 532,
            h: 148,
            unit: "%",
            mark: 2,
            points: [
              { label: "Enterprise", value: 41 },
              { label: "Mid-market", value: 38 },
              { label: "SMB", value: 9 },
            ],
          },
        },
        { kind: "rule" },
        {
          kind: "table",
          head: ["Segment", "Leads", "Closed", "Rate"],
          numeric: [1, 2, 3],
          rows: [
            ["Enterprise", "94", "39", "41%"],
            ["Mid-market", "210", "80", "38%"],
            ["SMB", "1,480", "133", "9%"],
          ],
        },
        {
          kind: "text",
          text: "Proposal: qualify first. Anything under the line goes to nurture and stays there until it asks",
          streaming: true,
        },
      ],
    },
  },

  {
    slug: "design",
    label: "Design",
    makes: "Rationale, flows, wireframes",
    headline: "Sketch with pure momentum.",
    sub: "Rationale you can point at. The reasoning sits beside the flow it argues for, and neither one is a screenshot of the other.",
    doc: {
      alt: "An onboarding flow with the skip path drawn beneath it, followed by the three decisions the second pass settled, ticked off as they land.",
      blocks: [
        { kind: "title", text: "Onboarding, second pass" },
        {
          kind: "text",
          text: "The template step tested badly: people picked one to get past it, then never used it. So it stops being a wall and becomes an offer you can walk past.",
        },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 184,
            nodes: [
              { id: "s1", label: "Sign up", x: 0, y: 0, w: 155, h: 84 },
              { id: "s2", label: "Pick a template", x: 188, y: 0, w: 155, h: 84 },
              { id: "s3", label: "First page", x: 377, y: 0, w: 155, h: 84, fill: true },
              { id: "skip", label: "Blank page", x: 188, y: 134, w: 155, h: 50 },
            ],
            edges: [
              { from: "s1", to: "s2" },
              { from: "s2", to: "s3" },
              { from: "s2", to: "skip", label: "skip", dashed: true },
              { from: "skip", to: "s3", dashed: true },
            ],
          },
        },
        { kind: "rule" },
        {
          kind: "check",
          items: [
            { text: "Skipping lands on a blank page, not back at the top", done: true },
            { text: "The same three prompts either way", done: true },
            { text: "Decide whether the template picker survives at all" },
          ],
        },
        {
          kind: "text",
          text: "Worth testing whether anyone comes back for the templates once they have a page of their own",
          streaming: true,
        },
      ],
    },
  },

  {
    slug: "making",
    label: "Making",
    makes: "Cut lists, joinery, shop drawings",
    headline: "Build with pure momentum.",
    sub: "Work it out before you cut. The arithmetic, the cut list and the joinery on one page — and the page comes out to the bench with you.",
    doc: {
      alt: "A bench plan: the board count worked out as a fraction and evaluated, the cut list ruled up beneath it, then the joinery drawn out.",
      blocks: [
        { kind: "title", text: "Walnut bench" },
        {
          kind: "text",
          text: "One board, quartersawn, so the top and the legs come off the same stick and the colour matches. Stock comes in at 2 400, and I need 3 140 of usable length.",
        },
        {
          kind: "math",
          expr: [
            { t: "run", text: "n" },
            { t: "op", text: "=" },
            { t: "frac", num: "3 140", den: "2 400" },
          ],
          result: "1.31 — so two boards, and the stretcher out of the offcut",
        },
        { kind: "rule" },
        {
          kind: "table",
          head: ["Part", "Finished size", "Off"],
          numeric: [2],
          rows: [
            ["Top", "1400 × 320 × 40", "1"],
            ["Leg", "740 × 120 × 40", "2"],
            ["Stretcher", "900 × 90 × 30", "1"],
          ],
        },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 180,
            nodes: [
              { id: "top", label: "Top", note: "1400 × 320", x: 188, y: 0, w: 156, h: 56, fill: true },
              { id: "legL", label: "Leg", note: "2 off", x: 0, y: 120, w: 156, h: 60 },
              { id: "rail", label: "Stretcher", note: "1 off", x: 188, y: 120, w: 156, h: 60 },
              { id: "legR", label: "Leg", note: "2 off", x: 376, y: 120, w: 156, h: 60 },
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
    headline: "Block with pure momentum.",
    sub: "See the sequence before you shoot it. The beat written out, the shot list ruled up, and the order drawn beside both.",
    doc: {
      alt: "A scene breakdown: the note about where the tension sits, the shot list as a table, then the order drawn with an insert hanging off the close-up.",
      blocks: [
        { kind: "title", text: "Sc. 14 — the kitchen" },
        {
          kind: "text",
          text: "She reads it standing up and doesn't sit down. Hold the wide long enough that the audience gets bored before she moves — the boredom is the point.",
        },
        {
          kind: "table",
          head: ["Sh.", "Setup", "Lens", "Note"],
          numeric: [0, 2],
          rows: [
            ["1", "WIDE", "32", "establish, hold it"],
            ["2", "OTS", "50", "on her"],
            ["3", "CU", "85", "the letter"],
            ["4", "WIDE", "32", "she leaves"],
          ],
        },
        { kind: "rule" },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 168,
            nodes: [
              { id: "w1", label: "WIDE", note: "estab.", x: 0, y: 0, w: 118, h: 54 },
              { id: "ots", label: "OTS", note: "on her", x: 138, y: 0, w: 118, h: 54 },
              { id: "cu", label: "CU", note: "the letter", x: 276, y: 0, w: 118, h: 54, fill: true },
              { id: "w2", label: "WIDE", note: "she leaves", x: 414, y: 0, w: 118, h: 54 },
              { id: "ins", label: "INSERT", note: "the clock", x: 276, y: 114, w: 118, h: 54 },
            ],
            edges: [
              { from: "w1", to: "ots" },
              { from: "ots", to: "cu" },
              { from: "cu", to: "w2" },
              { from: "cu", to: "ins", label: "if long", dashed: true },
            ],
          },
        },
        {
          kind: "text",
          text: "Insert on the clock only if the wide runs past forty seconds",
          streaming: true,
        },
      ],
    },
  },

  {
    slug: "study",
    label: "Study",
    makes: "Essay plans, revision, notes",
    headline: "Revise with pure momentum.",
    sub: "Think the argument all the way through: the plan, the figure you have to justify, and the causal chain you'll be asked to reproduce.",
    doc: {
      alt: "An essay plan: the causal chain drawn out from reparations to collapse, with the collapse filled in, and the currency figure worked out underneath.",
      blocks: [
        { kind: "title", text: "Essay plan — why it failed" },
        {
          kind: "text",
          text: "The argument is not that reparations were unpayable. It's that the attempt to pay them destroyed the currency, and the currency was the last thing holding the settlement together.",
        },
        {
          kind: "diagram",
          diagram: {
            w: 532,
            h: 172,
            nodes: [
              { id: "c1", label: "Reparations", x: 0, y: 0, w: 160, h: 56 },
              { id: "c2", label: "Hyperinflation", x: 186, y: 0, w: 160, h: 56 },
              { id: "c3", label: "Loss of faith", x: 372, y: 0, w: 160, h: 56 },
              { id: "end", label: "Collapse by 1933", x: 186, y: 116, w: 160, h: 56, fill: true },
            ],
            edges: [
              { from: "c1", to: "c2" },
              { from: "c2", to: "c3" },
              { from: "c2", to: "end" },
              { from: "c3", to: "end" },
            ],
          },
        },
        { kind: "rule" },
        {
          kind: "math",
          expr: [
            { t: "run", text: "v" },
            { t: "op", text: "=" },
            { t: "frac", num: "1", den: "4.2 × 10¹²" },
          ],
          result: "2.38 × 10⁻¹³ — what the 1914 mark was worth by November 1923",
        },
        {
          kind: "text",
          text: "Counter-argument to deal with in ¶4: the 1924 recovery. Answer — it was borrowed",
          streaming: true,
        },
      ],
    },
  },
];

export const bySlug = (slug: string) => audiences.find((a) => a.slug === slug);
