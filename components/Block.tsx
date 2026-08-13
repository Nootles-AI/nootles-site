import { ChartView } from "@/components/Chart";
import { DiagramView } from "@/components/Diagram";
import { MathView } from "@/components/Math";
import type { Block } from "@/lib/doc";

/* One block of a document, set the way the editor sets it.

   It lives on its own rather than inside `Sheet` because two things now set a
   page: the seven sheets that are printed, and the home sheet that is written
   in front of you. Those must be the same type at the same measure or the
   recording is a mock of the product rather than the product — so they render
   through this, and there is only one of it to keep honest. */

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

export function renderBlock(block: Block, i: number, id: string) {
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
