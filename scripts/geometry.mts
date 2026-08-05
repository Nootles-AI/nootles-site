/* Every diagram on the site is laid out by hand in document pixels, and the
   connectors are then computed from those boxes. That means a box nudged into
   the wrong place produces an edge that leaves by one side and doubles back
   past its own start — which looks like a bug and reads as one.

   Nothing here checks taste. It checks the things that are decidable:
   ids resolve, boxes stay inside the frame, boxes don't overlap, and every
   connector runs in the direction it left in.

   Run: node scripts/geometry.ts */

import { audiences, baseline, type Audience } from "../content/audiences.ts";
import {
  chartGeometry,
  edgePath,
  nodeById,
  type Chart,
  type Diagram,
  type Node,
} from "../lib/doc.ts";

/* The document is laid out at 600 document pixels wide with 34px margins, so
   this is the width every drawing on a sheet has to live inside. */
const MEASURE = 532;

const problems: string[] = [];
const fail = (where: string, msg: string) => problems.push(`${where}: ${msg}`);

const overlaps = (a: Node, b: Node) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Re-derive which side the connector left by, so we can check it ran that way. */
function anchorsOf(a: Node, b: Node) {
  const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      axis: "h" as const,
      start: { x: dx >= 0 ? a.x + a.w : a.x, y: ac.y },
      end: { x: dx >= 0 ? b.x : b.x + b.w, y: bc.y },
      away: dx >= 0 ? 1 : -1,
    };
  }
  return {
    axis: "v" as const,
    start: { x: ac.x, y: dy >= 0 ? a.y + a.h : a.y },
    end: { x: bc.x, y: dy >= 0 ? b.y : b.y + b.h },
    away: dy >= 0 ? 1 : -1,
  };
}

function checkDiagram(where: string, d: Diagram) {
  if (d.w > MEASURE) {
    fail(where, `diagram is ${d.w}px wide, past the ${MEASURE} measure`);
  }

  /* One filled node per diagram: it is where the eye is meant to land, and two
     of them means it lands nowhere. */
  const filled = d.nodes.filter((n) => n.fill).length;
  if (filled > 1) fail(where, `${filled} filled nodes — only one may be the point`);

  const ids = new Set<string>();
  for (const n of d.nodes) {
    if (ids.has(n.id)) fail(where, `duplicate node id "${n.id}"`);
    ids.add(n.id);

    if (n.x < 0 || n.y < 0 || n.x + n.w > d.w || n.y + n.h > d.h) {
      fail(
        where,
        `node "${n.id}" escapes the ${d.w}x${d.h} frame ` +
          `(${n.x},${n.y} ${n.w}x${n.h})`,
      );
    }
    // A label needs room. Below this the text wraps to two lines and the box
    // stops looking deliberate.
    if (n.w < 60 || n.h < 40) {
      fail(where, `node "${n.id}" is ${n.w}x${n.h}, too small for its label`);
    }
  }

  for (let i = 0; i < d.nodes.length; i++) {
    for (let j = i + 1; j < d.nodes.length; j++) {
      if (overlaps(d.nodes[i], d.nodes[j])) {
        fail(where, `nodes "${d.nodes[i].id}" and "${d.nodes[j].id}" overlap`);
      }
    }
  }

  for (const e of d.edges) {
    if (!ids.has(e.from)) fail(where, `edge from unknown node "${e.from}"`);
    if (!ids.has(e.to)) fail(where, `edge to unknown node "${e.to}"`);
    if (!ids.has(e.from) || !ids.has(e.to)) continue;

    const a = nodeById(d, e.from);
    const b = nodeById(d, e.to);
    const { axis, start, end, away } = anchorsOf(a, b);

    // The check that matters: the connector must travel in the direction it
    // left by. If it leaves the right-hand side, it must end up further right.
    const travel = axis === "h" ? end.x - start.x : end.y - start.y;
    if (travel * away <= 0) {
      fail(
        where,
        `edge "${e.from}"→"${e.to}" leaves the ` +
          `${axis === "h" ? (away > 0 ? "right" : "left") : away > 0 ? "bottom" : "top"}` +
          ` side and doubles back (travels ${travel.toFixed(0)}px)`,
      );
    }

    const { d: path } = edgePath(a, b);
    if (path.includes("NaN") || path.includes("undefined")) {
      fail(where, `edge "${e.from}"→"${e.to}" produced a broken path`);
    }
  }
}

/* A chart is laid out from its numbers, so what can go wrong is the numbers:
   a bar taller than the frame, a mark pointing at a point that isn't there, a
   value that would divide by nothing. */
function checkChart(where: string, c: Chart) {
  if (!c.points.length) {
    fail(where, "chart has no points");
    return;
  }
  if (c.w > MEASURE) fail(where, `chart is ${c.w}px wide, past the ${MEASURE} measure`);
  if (c.mark !== undefined && (c.mark < 0 || c.mark >= c.points.length)) {
    fail(where, `chart marks point ${c.mark}, which does not exist`);
  }
  for (const p of c.points) {
    if (!Number.isFinite(p.value) || p.value < 0) {
      fail(where, `point "${p.label}" has a value of ${p.value}`);
    }
  }

  const g = chartGeometry(c);
  for (const [i, b] of g.bars.entries()) {
    if (b.y < 0 || b.h < 0 || b.x + b.w > c.w + 0.5) {
      fail(where, `bar ${i} escapes the ${c.w}x${c.h} frame`);
    }
  }
  if (g.path.includes("NaN")) fail(where, "chart produced a broken path");
}

function checkAudience(a: Audience) {
  const where = a.slug || "(home)";

  if (a.headline.length > 46) {
    fail(where, `headline is ${a.headline.length} chars — it will overflow`);
  }
  if (a.sub.length > 170) {
    fail(where, `lede is ${a.sub.length} chars — too long for the fold`);
  }
  if (!a.doc.alt) fail(where, "document has no caption");
  if (!a.label) fail(where, "no label for the register and the title block");

  /* The amber caret means the model is working. Two of them on one page would
     mean it is working in two places at once, which is not a thing it does. */
  const streaming = a.doc.blocks.filter(
    (b) => (b.kind === "text" || b.kind === "code") && b.streaming,
  ).length;
  if (streaming > 1) {
    fail(where, `${streaming} blocks are streaming — the model works in one place`);
  }

  a.doc.blocks.forEach((b, i) => {
    const at = `${where} block ${i}`;
    switch (b.kind) {
      case "diagram":
        checkDiagram(at, b.diagram);
        break;
      case "chart":
        checkChart(at, b.chart);
        break;
      case "table": {
        if (!b.head.length) fail(at, "table has no columns");
        for (const [j, row] of b.rows.entries()) {
          if (row.length !== b.head.length) {
            fail(at, `row ${j} has ${row.length} cells for ${b.head.length} columns`);
          }
        }
        for (const n of b.numeric ?? []) {
          if (n < 0 || n >= b.head.length) fail(at, `numeric column ${n} does not exist`);
        }
        break;
      }
      case "code":
        if (!b.lines.length) fail(at, "code block has no lines");
        if (!b.lang) fail(at, "code block names no language");
        break;
      case "math":
        if (!b.expr.length) fail(at, "maths block has no expression");
        break;
    }
  });
}

[baseline, ...audiences].forEach(checkAudience);

const slugs = new Set(audiences.map((a) => a.slug));
if (slugs.size !== audiences.length) problems.push("duplicate audience slugs");

const pages = [baseline, ...audiences];
const tally = new Map<string, number>();
for (const a of pages) {
  for (const b of a.doc.blocks) {
    tally.set(b.kind, (tally.get(b.kind) ?? 0) + 1);
  }
}

if (problems.length) {
  console.log(`${problems.length} problem(s):\n`);
  for (const p of problems) console.log(`  ${p}`);
  process.exit(1);
}

const drawn = ["diagram", "chart", "table", "code", "math"]
  .map((k) => `${tally.get(k) ?? 0} ${k}`)
  .join(", ");
console.log(`${pages.length} pages — ${drawn} — geometry clean.`);
