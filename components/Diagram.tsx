import { edgePath, nodeById, type Diagram, type Node } from "@/lib/doc";

/* Outlines and connectors are drawn in one SVG; labels sit in DOM boxes over
   it. Splitting them that way is what lets a diamond be a real diamond and its
   label still be ordinary upright text — a clip-path would take the stroke with
   it, and rotated SVG text sets badly at this size. */

function outline(n: Node, held?: string) {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const cls = [
    "nt-shape",
    n.fill ? "is-fill" : null,
    n.id === held ? "is-held" : null,
  ]
    .filter(Boolean)
    .join(" ");

  switch (n.shape) {
    case "ellipse":
      return (
        <ellipse key={n.id} className={cls} cx={cx} cy={cy} rx={n.w / 2} ry={n.h / 2} />
      );
    case "diamond":
      return (
        <path
          key={n.id}
          className={cls}
          d={`M ${cx} ${n.y} L ${n.x + n.w} ${cy} L ${cx} ${n.y + n.h} L ${n.x} ${cy} Z`}
        />
      );
    case "round":
      return (
        <rect key={n.id} className={cls} x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} />
      );
    default:
      return (
        <rect key={n.id} className={cls} x={n.x} y={n.y} width={n.w} height={n.h} rx={6} />
      );
  }
}

export function DiagramView({
  diagram,
  id,
  held,
}: {
  diagram: Diagram;
  id: string;
  /** The node currently under a pointer that is holding it down. */
  held?: string;
}) {
  const arrow = `nt-arrow-${id}`;

  return (
    <div className="nt-diagram" style={{ width: diagram.w, height: diagram.h }}>
      <svg
        className="nt-diagram-ink"
        viewBox={`0 0 ${diagram.w} ${diagram.h}`}
        width={diagram.w}
        height={diagram.h}
      >
        <defs>
          <marker
            id={arrow}
            markerUnits="userSpaceOnUse"
            markerWidth={9}
            markerHeight={8}
            refX={9}
            refY={4}
            orient="auto"
          >
            <path className="nt-arrowhead" d="M 0 0 L 9 4 L 0 8 z" />
          </marker>
        </defs>

        {diagram.nodes.map((n) => outline(n, held))}

        {diagram.edges.map((e, i) => {
          const { d } = edgePath(nodeById(diagram, e.from), nodeById(diagram, e.to));
          return (
            <path
              key={`${e.from}-${e.to}-${i}`}
              className={e.dashed ? "nt-edge is-dashed" : "nt-edge"}
              d={d}
              markerEnd={`url(#${arrow})`}
            />
          );
        })}
      </svg>

      {diagram.nodes.map((n) => (
        <div
          key={n.id}
          className="nt-node-label"
          style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
        >
          <span className="nt-node-text">{n.label}</span>
          {n.note ? <span className="nt-node-note nt-meta">{n.note}</span> : null}
        </div>
      ))}

      {diagram.edges.map((e, i) => {
        if (!e.label) return null;
        const { mid } = edgePath(nodeById(diagram, e.from), nodeById(diagram, e.to));
        return (
          <span
            key={`l-${e.from}-${e.to}-${i}`}
            className="nt-edge-label nt-meta"
            style={{ left: mid.x, top: mid.y }}
          >
            {e.label}
          </span>
        );
      })}
    </div>
  );
}
