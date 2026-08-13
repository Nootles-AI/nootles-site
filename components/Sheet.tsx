import type { CSSProperties, ReactNode } from "react";
import { renderBlock } from "@/components/Block";
import { blockRegister, type Doc } from "@/lib/doc";

/* A drawing sheet: a trim line, a lighter frame inside it, the document in the
   field between, and a title block stamped across the foot.

   The page is laid out at the width the document is written at and shrunk by a
   transform, never reflowed — the line breaks and the diagram geometry are the
   page's own, and a page that rewraps is a picture of a different page.

   Everything inside the frame is a picture. The caption under it is the part
   meant to be read, and it is what assistive tech gets instead. */

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
  children,
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
  /** A page being written rather than printed, which takes the field instead of
   *  the static one. `doc` is still what the take ends on, so the register and
   *  the caption are derived from the real document either way. */
  children?: ReactNode;
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
            {children ?? (
              <div className="nt-sheet-page" aria-hidden="true">
                {doc.blocks.map((b, i) => renderBlock(b, i, id))}
              </div>
            )}
          </div>
          <TitleBlock name={name} register={blockRegister(doc)} sheet={sheet} />
        </div>
      </div>

      <figcaption className="nt-sheet-caption">{doc.alt}</figcaption>
    </figure>
  );
}
