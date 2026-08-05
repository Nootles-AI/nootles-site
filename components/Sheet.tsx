import type { CSSProperties } from "react";
import { ChartView } from "@/components/Chart";
import { DiagramView } from "@/components/Diagram";
import { MathView } from "@/components/Math";
import { blockRegister, type Block, type Doc } from "@/lib/doc";

/* A drawing sheet: a trim line, a lighter frame inside it, the document in the
   field between, and a title block stamped across the foot.

   The page is laid out at the width the document is written at and shrunk by a
   transform, never reflowed — the line breaks and the diagram geometry are the
   page's own, and a page that rewraps is a picture of a different page.

   Everything inside the frame is a picture. The caption under it is the part
   meant to be read, and it is what assistive tech gets instead. */

function Tick() {
  return (
    <svg
      className="nt-check-tick"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 5.2 4.1 7.4 8 2.9" />
    </svg>
  );
}

function renderBlock(block: Block, i: number, id: string) {
  switch (block.kind) {
    case "title":
      return (
        <h3 key={i} className="nt-doc-title">
          {block.text}
        </h3>
      );
    case "heading":
      return (
        <h4 key={i} className="nt-doc-heading">
          {block.text}
        </h4>
      );
    case "text":
      return (
        <p key={i} className={block.streaming ? "nt-doc-text is-streaming" : "nt-doc-text"}>
          {block.text}
          {block.streaming ? <span className="nt-stream-head" /> : null}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="nt-doc-list">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "check":
      return (
        <ul key={i} className="nt-doc-check">
          {block.items.map((item, j) => (
            <li key={j} className={item.done ? "nt-check-row is-done" : "nt-check-row"}>
              <span className="nt-check-box">{item.done ? <Tick /> : null}</span>
              <span className="nt-check-text">{item.text}</span>
            </li>
          ))}
        </ul>
      );
    case "rule":
      return <hr key={i} className="nt-doc-rule" />;
    case "diagram":
      return (
        <div key={i} className="nt-doc-canvas">
          <DiagramView diagram={block.diagram} id={`${id}-${i}`} />
        </div>
      );
    case "chart":
      return (
        <div key={i} className="nt-doc-chart">
          <ChartView chart={block.chart} id={`${id}-${i}`} />
        </div>
      );
    case "math":
      return <MathView key={i} expr={block.expr} result={block.result} />;
    case "code":
      return (
        <div
          key={i}
          className={block.streaming ? "nt-doc-code is-streaming" : "nt-doc-code"}
        >
          <div className="nt-code-head">
            <span className="nt-meta nt-stamp">{block.lang}</span>
          </div>
          <pre className="nt-code-body">
            {block.lines.map((line, j) => (
              <span
                key={j}
                className={
                  /^\s*(\/\/|#)/.test(line) ? "nt-code-line is-note" : "nt-code-line"
                }
              >
                {line || " "}
                {block.streaming && j === block.lines.length - 1 ? (
                  <span className="nt-stream-head" />
                ) : null}
              </span>
            ))}
          </pre>
        </div>
      );
    case "table":
      return (
        <table key={i} className="nt-doc-table">
          <thead>
            <tr>
              {block.head.map((h, j) => (
                <th key={j} className={block.numeric?.includes(j) ? "is-num" : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, j) => (
              <tr key={j}>
                {row.map((cell, k) => (
                  <td key={k} className={block.numeric?.includes(k) ? "is-num" : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

/* The title block carries what the drawing is, which blocks are on it, and its
   number in the set. The register is derived from the document, so a sheet
   cannot advertise a block it does not contain. */
function TitleBlock({ name, register, sheet }: { name: string; register: string; sheet: string }) {
  return (
    <div className="nt-title-block" aria-hidden="true">
      <div className="nt-tb-cell">
        <span className="nt-tb-label nt-meta nt-stamp">Document</span>
        <span className="nt-tb-value">{name}</span>
      </div>
      <div className="nt-tb-cell is-optional">
        <span className="nt-tb-label nt-meta nt-stamp">Blocks</span>
        <span className="nt-tb-value">{register}</span>
      </div>
      <div className="nt-tb-cell">
        <span className="nt-tb-label nt-meta nt-stamp">Sheet</span>
        <span className="nt-tb-value">{sheet}</span>
      </div>
    </div>
  );
}

export function Sheet({
  doc,
  id,
  name,
  sheet,
  across,
  down,
  scale,
  height,
}: {
  doc: Doc;
  id: string;
  /** What the title block calls this drawing. */
  name: string;
  /** Its number in the set, e.g. "01 / 08". */
  sheet: string;
  /** Dimension figures. Left out, the run is not drawn at all. */
  across?: string;
  down?: string;
  /** Fraction of document pixels. Defaults to the stylesheet's own steps. */
  scale?: number;
  /** Height of the field. The document carries on past it. */
  height?: string;
}) {
  const vars = {
    ...(scale !== undefined ? { "--page-scale": String(scale) } : {}),
    ...(height !== undefined ? { "--page-h": height } : {}),
  } as CSSProperties;

  return (
    <figure className="nt-sheet-wrap">
      {/* The dimensions measure the sheet, so they are hung on a stage that
          holds the sheet alone — hanging them on the figure would have them
          measure the caption too. */}
      <div className="nt-sheet-stage">
        {across ? (
          <span className="nt-dim nt-dim-h" aria-hidden="true">
            <span className="nt-dim-label nt-meta nt-stamp">{across}</span>
          </span>
        ) : null}
        {down ? (
          <span className="nt-dim nt-dim-v" aria-hidden="true">
            <span className="nt-dim-label nt-meta nt-stamp">{down}</span>
          </span>
        ) : null}

        <div className="nt-sheet" style={vars}>
          <div className="nt-sheet-field">
            <div className="nt-sheet-page" aria-hidden="true">
              {doc.blocks.map((b, i) => renderBlock(b, i, id))}
            </div>
          </div>
          <TitleBlock name={name} register={blockRegister(doc)} sheet={sheet} />
        </div>
      </div>

      <figcaption className="nt-sheet-caption">{doc.alt}</figcaption>
    </figure>
  );
}
