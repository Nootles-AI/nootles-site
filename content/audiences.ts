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

/* ---- The take -----------------------------------------------------------
   The home sheet is the one page here that is written rather than printed.

   A still document can show that prose and drawings sit on one surface. It
   cannot show the three things that are actually the product — a line being
   finished for you, a sentence turning into a diagram, and that diagram being
   dragged into shape a second later — so the home page writes itself instead,
   with a pointer doing the work, on a loop.

   A launch plan rather than anything closer to the machine: the fold is the one
   place that can assume nothing about who is reading it, and a page about retry
   budgets tells somebody who does not write services that this is not for them.
   Everyone has had to say what has to be true before a thing ships.

   These are the parts of the page the recording has to name. Everything else it
   simply renders, from `baseline.doc` below, which is what the take ends on. */
export const take = {
  /** The line the model finishes, and what it offers for it. Held apart because
      one is in ink while the other is still only an offer; joined, they are
      block `finishes` of the document below. */
  line: "The date we are working back from is",
  completion:
    " the last Thursday in March, which leaves three clear weeks of buffer.",

  /** The sentence the next line is asked for in — answered with a block rather
      than with words, which is the second thing a screenshot cannot show. */
  brief: "draw the path from draft to ship, and where rework comes from",

  /** The box picked up afterwards, and how far it goes. Rework arrives at the
      end of the row, under Ship, where the connector has to run diagonally to
      reach it and reads as though shipping is what produces rework. Dragged one
      step left it sits under the step it actually falls out of, and the
      connector straightens into a drop. The brief asked where rework comes from;
      the drag is the answer to it.

      A demonstration edit that left the picture worse would be showing off the
      drag rather than the point of it, so this one is checked: `geometry.mts`
      proves both positions route soundly. */
  dragged: "rework",
  dx: -192,

  /** Which blocks of `baseline.doc` the first and third beats happen in.
      `scripts/geometry.mts` checks that they still point at what they claim to,
      so a block inserted above cannot quietly desynchronise the recording from
      the page it is supposed to be writing. */
  finishes: 4,
  draws: 7,
};

/** The baseline page. Not in the register — it is the sheet the register sits on. */
export const baseline: Audience = {
  slug: "",
  label: "General",
  makes: "Anything you have to think about first",
  headline: "Write with pure momentum.",
  sub: "Prose, diagrams, code, maths and tables in one document — and an AI that reads and edits all of it, in front of you.",
  doc: {
    alt: "A launch plan being written: the model finishes the line about the date, reads the next line as a drawing and puts one on the page — draft to review to ship — and the rework box is then dragged under the review it falls out of.",
    blocks: [
      { kind: "title", text: "Launch plan" },
      {
        kind: "text",
        text: "What has to be true before we ship, who owns each part, and the order it has to happen in.",
      },
      { kind: "heading", text: "Where we are" },
      /* One line, and it has to stay one line. The drawing lands roughly 380
         document pixels down this page and the field crops at 640, so every
         line added above the diagram pushes the third beat — the drag, the part
         worth watching — under the fade at the foot of the sheet. */
      {
        kind: "text",
        text: "Everything in the first cut is built and behind a flag.",
      },
      /* Block 4 — the line the model finishes. `take.finishes` points here. */
      { kind: "text", text: take.line + take.completion },
      { kind: "heading", text: "How it fits together" },
      { kind: "text", text: "The order things have to happen in:" },
      /* Block 7 — the drawing, as the model first puts it down. `take.draws`
         points here, and the edit at the end of the take moves Rework left by
         `take.dx`, out from under Ship and under Review. Both positions are
         checked by the geometry script.

         Three across and one below, which is the shape this router draws
         cleanly: every connector between two boxes on the same row is a
         straight line, and the one connector that is not runs down a column of
         its own. A loop back into Draft is the drawing you would reach for
         first and it is the one thing the router cannot do — a returning edge
         leaves the bottom box and re-enters the top row along the same centre
         line the row's own connectors sit on, so it arrives overlapping them
         and pointing into an arrowhead. Hence a branch, and hence the drag
         being the thing that puts the branch where it belongs. */
      {
        kind: "diagram",
        diagram: {
          w: 532,
          h: 178,
          nodes: [
            { id: "draft", label: "Draft", x: 0, y: 4, w: 148, h: 44 },
            { id: "review", label: "Review", x: 192, y: 4, w: 148, h: 44 },
            { id: "ship", label: "Ship", x: 384, y: 4, w: 148, h: 44, fill: true },
            { id: "rework", label: "Rework", x: 384, y: 130, w: 148, h: 44 },
          ],
          edges: [
            { from: "draft", to: "review" },
            { from: "review", to: "ship" },
            { from: "review", to: "rework", label: "changes", dashed: true },
          ],
        },
      },
      { kind: "heading", text: "Who owns what" },
      {
        kind: "list",
        items: [
          "Scope and draft — Priya, by the 14th",
          "Build and QA — the platform team",
          "Comms and the launch note — Sam",
          "Support handover — Ana, the week before",
        ],
      },
      { kind: "heading", text: "What would make us stop" },
      {
        kind: "text",
        text: "Anything still in the rework loop by the Monday of launch week. We would rather move the date once than ship it twice.",
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
