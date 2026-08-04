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

export type Block =
  | { kind: "title"; text: string }
  | { kind: "heading"; text: string }
  /** `streaming` marks the line the model is still writing: it carries the caret. */
  | { kind: "text"; text: string; streaming?: boolean }
  | { kind: "list"; items: string[] }
  | { kind: "rule" }
  | { kind: "diagram"; diagram: Diagram };

export type Doc = {
  /** What the picture is a picture of. Read out to assistive tech. */
  alt: string;
  blocks: Block[];
};

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
