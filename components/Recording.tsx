"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { renderBlock } from "@/components/Block";
import { DiagramView } from "@/components/Diagram";
import { baseline, take } from "@/content/audiences";
import { moveNode, type Diagram } from "@/lib/doc";

/**
 * The home sheet, being written.
 *
 * Three beats, in the order the work actually happens: a line finished for you
 * and accepted with a key, a sentence read as a drawing and answered with one,
 * and that drawing dragged into shape a second later. Everything else on the
 * page is there to give them somewhere to happen.
 *
 * It is the same document the rest of the site prints. The blocks come from
 * `baseline.doc` and go through the same `renderBlock` every other sheet uses,
 * so the page being written cannot drift from the page being claimed — only the
 * two blocks the take actually touches are rendered differently, and which two
 * is stated in `take` and checked by `scripts/geometry.mts`.
 *
 * The drawing is drawn by the site's own `DiagramView` and the drag is a real
 * `moveNode` applied per frame, which is why the connectors re-route while the
 * shape is still moving rather than snapping when it lands. Nothing here is a
 * video of the product, or a picture of one.
 */

const source = baseline.doc.blocks[take.draws];
if (source?.kind !== "diagram") {
  throw new Error(`take.draws points at a ${source?.kind ?? "missing block"}`);
}
const SOURCE = source.diagram;

/* A word and the space in front of it, which is roughly what a token is. */
const WORDS = take.completion.match(/\s*\S+/g) ?? [];

type Head = "off" | "live" | "steady";
type Slot = "off" | "drawing" | "on";

interface Frame {
  /** Words of the completion offered so far. */
  ghost: number;
  head: Head;
  key: "off" | "on" | "press";
  /** The completion has stopped being an offer and become text. */
  ink: boolean;
  /** Characters of the brief the model reads the next line as. */
  brief: number;
  slot: Slot;
  /** Shapes on the canvas so far; connectors follow their endpoints. */
  shapes: number;
  diagram: Diagram;
  /** Where the pointer is, in document pixels, or null while it is offstage. */
  at: { x: number; y: number } | null;
  down: boolean;
  /** The last beat is over and the take is on its way out. */
  out: boolean;
}

const OPENING: Frame = {
  ghost: 0,
  head: "off",
  key: "off",
  ink: false,
  brief: 0,
  slot: "off",
  shapes: 0,
  diagram: SOURCE,
  at: null,
  down: false,
  out: false,
};

/** Every beat played out, for anyone who has asked not to be moved. */
const FINISHED: Frame = {
  ...OPENING,
  ghost: Infinity,
  ink: true,
  slot: "on",
  shapes: Infinity,
  diagram: moveNode(SOURCE, take.dragged, take.dx),
};

/** How far the shape travels, and over how long. */
const DRAG_MS = 520;

export function Recording() {
  const [still, setStill] = useState(false);
  const [frame, setFrame] = useState<Frame>(OPENING);
  /** Bumped to play the whole thing again. */
  const [cycle, setCycle] = useState(0);

  /* Measured rather than assumed: where the pointer has to be for each beat
     depends on where the text happens to wrap, and the wrap depends on the
     font that actually loaded. */
  const caret = useRef<HTMLSpanElement>(null);
  const ask = useRef<HTMLParagraphElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setStill(q.matches);
    read();
    q.addEventListener("change", read);
    return () => q.removeEventListener("change", read);
  }, []);

  useEffect(() => {
    if (still) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;
    const at = (delay: number, run: () => void) => {
      timers.push(setTimeout(run, delay));
    };
    /* Layout values, so the page's own `scale()` is not in them — which is what
       lets the pointer be driven in document pixels at any breakpoint. */
    const spotOf = (el: HTMLElement | null, dx = 0, dy = 0) =>
      el ? { x: el.offsetLeft + dx, y: el.offsetTop + dy } : null;

    let t = 0;

    /* ---- The line ------------------------------------------------------ */
    t += 620;
    at(t, () =>
      setFrame((f) => ({ ...f, at: spotOf(caret.current, 2, 10), head: "live" })),
    );

    t += 300;
    for (let i = 1; i <= WORDS.length; i += 1) {
      t += 34 + i * 4;
      at(t, () => setFrame((f) => ({ ...f, ghost: i })));
    }

    // Steady means "this is where you will be if you press Tab" — the head has
    // stopped saying that tokens are arriving, because they have stopped.
    t += 160;
    at(t, () => setFrame((f) => ({ ...f, head: "steady", key: "on" })));

    t += 620;
    at(t, () => setFrame((f) => ({ ...f, key: "press" })));
    t += 130;
    at(t, () => setFrame((f) => ({ ...f, ink: true, head: "off", key: "off" })));

    /* ---- The drawing --------------------------------------------------- */
    t += 620;
    at(t, () =>
      setFrame((f) => ({ ...f, at: spotOf(ask.current, 6, 10), head: "live" })),
    );

    t += 260;
    for (let i = 1; i <= take.brief.length; i += 1) {
      t += 13;
      at(t, () => setFrame((f) => ({ ...f, brief: i })));
    }

    // The brief stops being words and becomes the block that answers it.
    t += 300;
    at(t, () => setFrame((f) => ({ ...f, brief: 0, head: "off", slot: "drawing" })));

    t += 700;
    for (let i = 1; i <= SOURCE.nodes.length; i += 1) {
      t += 150;
      at(t, () => setFrame((f) => ({ ...f, shapes: i })));
    }

    t += 260;
    at(t, () => setFrame((f) => ({ ...f, slot: "on" })));

    /* ---- The edit ------------------------------------------------------ */
    const grip = () => {
      const box = slot.current;
      const node = SOURCE.nodes.find((n) => n.id === take.dragged);
      if (!box || !node) return null;
      return {
        x: box.offsetLeft + node.x + node.w / 2,
        y: box.offsetTop + node.y + node.h / 2,
      };
    };

    t += 420;
    at(t, () => setFrame((f) => ({ ...f, at: grip() })));

    t += 300;
    at(t, () => setFrame((f) => ({ ...f, down: true })));

    t += 220;
    at(t, () => {
      const start = performance.now();
      let done = 0;
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / DRAG_MS);
        // The curve the site eases everything on: most of the distance early,
        // the last of it settling. A drag that arrives at a constant speed reads
        // as a tween; this reads as a hand.
        const want = take.dx * (1 - Math.pow(1 - k, 4));
        const dx = want - done;
        done = want;
        setFrame((f) => ({
          ...f,
          diagram: moveNode(f.diagram, take.dragged, dx),
          at: f.at ? { x: f.at.x + dx, y: f.at.y } : f.at,
        }));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });

    t += DRAG_MS + 160;
    at(t, () => setFrame((f) => ({ ...f, down: false })));

    /* ---- Again --------------------------------------------------------- */
    // Long enough to read the finished page, which is the thing being sold.
    t += 2200;
    at(t, () => setFrame((f) => ({ ...f, out: true, at: null })));
    t += 520;
    at(t, () => {
      setFrame(OPENING);
      setCycle((n) => n + 1);
    });

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [cycle, still]);

  const f = still ? FINISHED : frame;

  const offered = WORDS.slice(
    0,
    f.ghost === Infinity ? WORDS.length : f.ghost,
  ).join("");

  /* Only the shapes placed so far, and only the connectors whose two ends are
     both on the page — a connector to a box that has not arrived yet has
     nothing to be routed from. */
  const nodes = f.diagram.nodes.slice(
    0,
    f.shapes === Infinity ? f.diagram.nodes.length : f.shapes,
  );
  const placed = new Set(nodes.map((n) => n.id));
  const drawn: Diagram = {
    ...f.diagram,
    nodes,
    edges: f.diagram.edges.filter((e) => placed.has(e.from) && placed.has(e.to)),
  };

  return (
    <div
      className={`nt-sheet-page is-live${f.out ? " is-out" : ""}`}
      aria-hidden="true"
    >
      {baseline.doc.blocks.map((block, i) => {
        /* The line the model finishes. Written out rather than rendered from
           the block, because half of it is in ink and half of it is still only
           an offer. */
        if (i === take.finishes) {
          return (
            <p key={i} className="nt-doc-text">
              {take.line}
              <span className={f.ink ? "nt-kept" : "nt-ghost"}>{offered}</span>
              <span ref={caret} className="nt-anchor">
                {f.head !== "off" ? (
                  <span
                    className={
                      f.head === "steady"
                        ? "nt-stream-head is-steady"
                        : "nt-stream-head"
                    }
                  />
                ) : null}
              </span>
              {f.key !== "off" ? (
                <span className={f.key === "press" ? "nt-key is-press" : "nt-key"}>
                  Tab
                </span>
              ) : null}
            </p>
          );
        }

        /* The drawing, and the line it is asked for on. The line is empty at
           rest and never unmounted: a blank line in a document is ordinary, and
           one that appeared for the beat would shift everything under it at the
           moment the eye is on it. */
        if (i === take.draws) {
          return (
            <Fragment key={i}>
              <p ref={ask} className="nt-doc-text">
                <span className="nt-ghost">{take.brief.slice(0, f.brief)}</span>
                <span className="nt-anchor">
                  {f.head === "live" && f.brief > 0 ? (
                    <span className="nt-stream-head" />
                  ) : null}
                </span>
              </p>

              {f.slot !== "off" ? (
                <div ref={slot} className="nt-take-slot" style={{ height: SOURCE.h }}>
                  <DiagramView
                    diagram={drawn}
                    id="home-take"
                    held={f.down ? take.dragged : undefined}
                  />
                  {f.slot === "drawing" ? (
                    <span className="nt-take-drawing nt-meta nt-stamp">Drawing…</span>
                  ) : null}
                </div>
              ) : null}
            </Fragment>
          );
        }

        return renderBlock(block, i, "home");
      })}

      {f.at ? (
        <span
          className={f.down ? "nt-take-pointer is-down" : "nt-take-pointer"}
          style={{ transform: `translate(${f.at.x}px, ${f.at.y}px)` }}
        >
          <svg viewBox="0 0 12 18" width={13} height={19}>
            <path d="M1 1.2 10.6 10.4 6.2 10.9 8.6 15.8 6.6 16.8 4.2 11.9 1 14.8Z" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
