import { chartGeometry, type Chart } from "@/lib/doc";

/* A plot on the sheet, drawn in the same graphite as everything else. The
   geometry comes from `lib/doc.ts` rather than from here, so the numbers can be
   changed and the picture stays honest — and so the geometry check can run the
   same arithmetic the renderer does.

   One point carries the reason the chart is on the page and is filled; the rest
   are outlined. Same rule the diagrams use for their one filled node. */

export function ChartView({ chart, id }: { chart: Chart; id: string }) {
  const g = chartGeometry(chart);

  return (
    <div className="nt-chart" style={{ width: chart.w, height: chart.h }}>
      <svg
        className="nt-chart-ink"
        viewBox={`0 0 ${chart.w} ${chart.h}`}
        width={chart.w}
        height={chart.h}
      >
        {chart.shape === "bars"
          ? g.bars.map((b, i) => (
              <rect
                key={`${id}-${i}`}
                className={i === chart.mark ? "nt-chart-bar is-mark" : "nt-chart-bar"}
                x={b.x}
                y={b.y}
                width={b.w}
                height={Math.max(b.h, 1)}
              />
            ))
          : null}

        {chart.shape === "line" ? (
          <>
            <path className="nt-chart-line" d={g.path} />
            {g.dots.map((d, i) => (
              <circle
                key={`${id}-${i}`}
                className={i === chart.mark ? "nt-chart-dot is-mark" : "nt-chart-dot"}
                cx={d.x}
                cy={d.y}
                r={3}
              />
            ))}
          </>
        ) : null}

        <line
          className="nt-chart-axis"
          x1={0}
          y1={g.baseline + 0.5}
          x2={chart.w}
          y2={g.baseline + 0.5}
        />
      </svg>

      {chart.points.map((p, i) => (
        <span
          key={`l-${id}-${i}`}
          className="nt-chart-label nt-meta"
          style={{
            left: chart.shape === "bars" ? g.bars[i].cx : g.dots[i].x,
            top: g.baseline + 6,
          }}
        >
          {p.label}
        </span>
      ))}

      {/* Only the point the chart is about carries its figure. Labelling all of
          them turns a drawing back into the table it was made to replace. */}
      {chart.mark !== undefined ? (
        <span
          className="nt-chart-value nt-meta"
          style={{
            left: chart.shape === "bars" ? g.bars[chart.mark].cx : g.dots[chart.mark].x,
            top: (chart.shape === "bars" ? g.bars[chart.mark].y : g.dots[chart.mark].y) - 5,
          }}
        >
          {chart.points[chart.mark].value.toLocaleString("en-GB")}
          {chart.unit ? ` ${chart.unit}` : ""}
        </span>
      ) : null}
    </div>
  );
}
