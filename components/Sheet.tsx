import type { CSSProperties } from "react";
import { DiagramView } from "@/components/Diagram";
import type { Block, Doc } from "@/lib/doc";

/* A page lying on the desk: laid out at the width the document is written at
   and shrunk by a transform, so line breaks and diagram geometry are the page's
   own rather than a narrow reflow of them.

   Everything inside is a picture. The caption under it is the part meant to be
   read, and it is what assistive tech gets. */

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
        <p key={i} className="nt-doc-text">
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
    case "rule":
      return <hr key={i} className="nt-doc-rule" />;
    case "diagram":
      return (
        <div key={i} className="nt-doc-canvas">
          <DiagramView diagram={block.diagram} id={`${id}-${i}`} />
        </div>
      );
  }
}

export function Sheet({
  doc,
  id,
  scale,
  height,
  className,
}: {
  doc: Doc;
  id: string;
  /** Fraction of document pixels. The app draws its own sheets at 0.78. */
  scale?: number;
  /** Height of the crop, in CSS. The page carries on past it. */
  height?: string;
  className?: string;
}) {
  const vars = {
    ...(scale !== undefined ? { "--page-scale": String(scale) } : {}),
    ...(height !== undefined ? { "--page-h": height } : {}),
  } as CSSProperties;

  return (
    <figure className={className ? `nt-sheet-figure ${className}` : "nt-sheet-figure"}>
      <div className="nt-sheet" style={vars}>
        <div className="nt-sheet-page" aria-hidden="true">
          {doc.blocks.map((b, i) => renderBlock(b, i, id))}
        </div>
      </div>
      <figcaption className="nt-sheet-caption">{doc.alt}</figcaption>
    </figure>
  );
}
