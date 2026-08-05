/* The document model, cut down to what a picture of a page needs.
   It mirrors the product's own shape — a page is blocks, a canvas block is
   shapes and edges — so the thing shown here is the thing that arrives. */

export type Shape = "rect" | "round" | "diamond" | "ellipse";

export type Node = {
  id: string;
  label: string;
  /** Document pixels, laid out inside the diagram's own box. */
  x: number;
  y: number;
  w: number;
  h: number;
  shape?: Shape;
  /** A filled node is the one the eye should land on first. One per diagram. */
  fill?: boolean;
  /** A second line under the label, in the metadata voice. */
  note?: string;
};

export type Edge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export type Diagram = {
  w: number;
  h: number;
  nodes: Node[];
  edges: Edge[];
};

/* ---- Maths --------------------------------------------------------------
   Flat by design, like everything else here: a row of tokens, and a token may
   hold two strings but never another token. Real fractions and superscripts
   without a parser, and nothing that could nest its way into a bad layout. */

export type MathToken =
  /** A variable, set in the italic a variable is conventionally set in. */
  | { t: "run"; text: string }
  /** Upright: operators, numbers, unit names. */
  | { t: "op"; text: string }
  | { t: "frac"; num: string; den: string };

export type Chart = {
  shape: "bars" | "line";
  w: number;
  h: number;
  points: { label: string; value: number }[];
  /** Axis top. Left out, it is the largest value with a tenth of headroom. */
  max?: number;
  /** Written against the axis, in the metadata voice. */
  unit?: string;
  /** Which point the eye should land on. One per chart, same rule as a node. */
  mark?: number;
};

export type Block =
  | { kind: "title"; text: string }
  | { kind: "heading"; text: string }
  /** `streaming` marks the line the model is still writing: it carries the caret. */
  | { kind: "text"; text: string; streaming?: boolean }
  | { kind: "list"; items: string[] }
  | { kind: "check"; items: { text: string; done?: boolean }[] }
  | { kind: "rule" }
  | { kind: "diagram"; diagram: Diagram }
  /** A line beginning `//` or `#` is set muted; nothing else is coloured. */
  | { kind: "code"; lang: string; lines: string[]; streaming?: boolean }
  /** `result` is what the compute engine returned, shown the way the app shows it. */
  | { kind: "math"; expr: MathToken[]; result?: string }
  | { kind: "table"; head: string[]; rows: string[][]; numeric?: number[] }
  | { kind: "chart"; chart: Chart };

export type Doc = {
  /** What the picture is a picture of. Read out to assistive tech. */
  alt: string;
  blocks: Block[];
};

/* The block types a document actually uses, named the way the app names them.

   This is stamped into every sheet's title block, and it is the site's whole
   argument in one line: the seven benches differ because the work on them
   differs, and a register that reads TEXT · MATHS · TABLE · CANVAS says that
   faster than a paragraph claiming it. Derived rather than authored, so a
   document cannot advertise a block it does not contain. */
export function blockRegister(doc: Doc): string {
  const names: Record<Block["kind"], string | null> = {
    title: "Text",
    heading: "Text",
    text: "Text",
    list: "List",
    check: "List",
    code: "Code",
    math: "Maths",
    table: "Table",
    chart: "Chart",
    diagram: "Canvas",
    rule: null,
  };

  const seen: string[] = [];
  for (const block of doc.blocks) {
    const name = names[block.kind];
    if (name && !seen.includes(name)) seen.push(name);
  }
  return seen.join(" · ");
}

/* ---- Edge geometry ------------------------------------------------------
   Which sides an edge leaves and lands on is computed from where the two boxes
   actually are, never hand-authored — so a node can be moved and the drawing
   stays correct. Same rule the canvas runs on. */

type Point = { x: number; y: number };

const centre = (n: Node): Point => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

function anchors(a: Node, b: Node) {
  const ac = centre(a);
  const bc = centre(b);
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      axis: "h" as const,
      start: { x: dx >= 0 ? a.x + a.w : a.x, y: ac.y },
      end: { x: dx >= 0 ? b.x : b.x + b.w, y: bc.y },
    };
  }
  return {
    axis: "v" as const,
    start: { x: ac.x, y: dy >= 0 ? a.y + a.h : a.y },
    end: { x: bc.x, y: dy >= 0 ? b.y : b.y + b.h },
  };
}

const CORNER = 9;

/** An orthogonal run with rounded corners, or a straight line when the two
 *  boxes already line up. */
export function edgePath(a: Node, b: Node): { d: string; mid: Point } {
  const { axis, start, end } = anchors(a, b);
  const dirX = end.x >= start.x ? 1 : -1;
  const dirY = end.y >= start.y ? 1 : -1;

  if (axis === "h") {
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    if (Math.abs(start.y - end.y) < 0.5) {
      return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, mid };
    }
    const mx = (start.x + end.x) / 2;
    const r = Math.min(
      CORNER,
      Math.abs(end.y - start.y) / 2,
      Math.abs(mx - start.x),
      Math.abs(end.x - mx),
    );
    return {
      d: [
        `M ${start.x} ${start.y}`,
        `L ${mx - r * dirX} ${start.y}`,
        `Q ${mx} ${start.y} ${mx} ${start.y + r * dirY}`,
        `L ${mx} ${end.y - r * dirY}`,
        `Q ${mx} ${end.y} ${mx + r * dirX} ${end.y}`,
        `L ${end.x} ${end.y}`,
      ].join(" "),
      mid: { x: mx, y: mid.y },
    };
  }

  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  if (Math.abs(start.x - end.x) < 0.5) {
    return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, mid };
  }
  const my = (start.y + end.y) / 2;
  const r = Math.min(
    CORNER,
    Math.abs(end.x - start.x) / 2,
    Math.abs(my - start.y),
    Math.abs(end.y - my),
  );
  return {
    d: [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${my - r * dirY}`,
      `Q ${start.x} ${my} ${start.x + r * dirX} ${my}`,
      `L ${end.x - r * dirX} ${my}`,
      `Q ${end.x} ${my} ${end.x} ${my + r * dirY}`,
      `L ${end.x} ${end.y}`,
    ].join(" "),
    mid: { x: mid.x, y: my },
  };
}

export function nodeById(d: Diagram, id: string): Node {
  const n = d.nodes.find((x) => x.id === id);
  if (!n) throw new Error(`No node "${id}" in diagram`);
  return n;
}

/* ---- Chart geometry -----------------------------------------------------
   Same rule the diagrams run on: the shape is computed from the data, never
   hand-placed, so a number can be changed and the picture stays honest. Kept
   here rather than in the component so the geometry check can run it too. */

const AXIS_ROOM = 20; // under the baseline, for the labels
const HEAD_ROOM = 16; // over the tallest bar, for its value
const BAR_GAP = 10;
const DOT_INSET = 5;

export type ChartGeometry = {
  max: number;
  baseline: number;
  bars: { x: number; y: number; w: number; h: number; cx: number }[];
  dots: { x: number; y: number }[];
  path: string;
};

export function chartGeometry(c: Chart): ChartGeometry {
  const values = c.points.map((p) => p.value);
  const max = c.max ?? Math.max(...values, 1) * 1.1;
  const baseline = c.h - AXIS_ROOM;
  const span = baseline - HEAD_ROOM;
  const y = (v: number) => baseline - (v / max) * span;

  const n = c.points.length;
  const barW = (c.w - BAR_GAP * (n - 1)) / n;
  const bars = c.points.map((p, i) => {
    const x = i * (barW + BAR_GAP);
    const top = y(p.value);
    return { x, y: top, w: barW, h: baseline - top, cx: x + barW / 2 };
  });

  const step = n > 1 ? (c.w - DOT_INSET * 2) / (n - 1) : 0;
  const dots = c.points.map((p, i) => ({
    x: DOT_INSET + i * step,
    y: y(p.value),
  }));

  const path = dots
    .map((d, i) => `${i === 0 ? "M" : "L"} ${d.x.toFixed(1)} ${d.y.toFixed(1)}`)
    .join(" ");

  return { max, baseline, bars, dots, path };
}
