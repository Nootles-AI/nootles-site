/* IDEA 5 — Six copies, one canvas.
   THESIS: the headline's two sentences are played out by the cast. First
   everyone is holding their own version of the doc; then the copies are
   struck, pulled together, and become one live canvas that every cursor is
   on. Refuses the hero that only asserts the problem it solves.
   OWN-WORLD: white ground, near-black ink, a grotesk for words and a mono for
   what are literally filenames; the cast's colours on cursors and presence.
   STORY: you recognise the version mess in a second, watch it collapse into
   one place, and the CTA is the way into that place.
   FIRST VIEWPORT: headline flush left with subtitle and CTA on one row
   beneath; the stage below: six filename tags over six heads, merging into a
   single canvas card hovering over the cast, cursors gathered at it.
   FORM: grounded #4. */
import { Arrow, Characters, Cursor, IdeaNav, cast, copy } from "@/components/ideas/shared";
import { site } from "@/lib/site";

const copies = [
  { f: "brief.docx", x: 5, y: 12 },
  { f: "brief_v2.docx", x: 26.5, y: 2 },
  { f: "brief_v2_design.docx", x: 45, y: 40 },
  { f: "brief_final.docx", x: 61, y: 13 },
  { f: "brief_final_v2.docx", x: 78.5, y: 34 },
  { f: "brief_FINAL_final.docx", x: 94, y: 18 },
];

const here = [cast.green, cast.blue, cast.yellow, cast.purple];

export function Idea5Merge() {
  return (
    <div className="ic-root i5">
      <IdeaNav />
      <section className="i5-hero">
        <div className="i5-say">
          <h1 className="i5-title">
            <span>{copy.titleA}</span>
            <span>{copy.titleB}</span>
          </h1>
          <div className="i5-row">
            <p className="i5-sub">{copy.sub}</p>
            <a className="i5-cta" href={site.appUrl}>
              Go to app
              <Arrow />
            </a>
          </div>
        </div>

        <div className="i5-stage">
          <Characters />
          <div className="i5-over" aria-hidden="true">
            {copies.map((c, k) => (
              <span
                key={c.f}
                className="i5-copy"
                style={{
                  ["--x" as string]: c.x,
                  ["--y" as string]: c.y,
                  ["--k" as string]: k,
                }}
              >
                {c.f}
              </span>
            ))}

            <div className="i5-card">
              <div className="i5-card-top">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                  <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2.5" />
                  <path d="M5 6h6M5 9h4" strokeLinecap="round" />
                </svg>
                <b>Launch brief</b>
                <ul className="i5-pile">
                  {here.map((h, k) => (
                    <li key={k} style={{ background: h.body }} />
                  ))}
                  <li className="i5-pile-ai" />
                </ul>
              </div>
              <div className="i5-card-body">
                <span className="i5-ln" style={{ ["--c" as string]: cast.green.body }}>Scope</span>
                <span className="i5-ln" style={{ ["--c" as string]: cast.blue.body }}>Build plan</span>
                <span className="i5-ln" style={{ ["--c" as string]: cast.yellow.body }}>Launch copy</span>
              </div>
              <Cursor who="analyst" className="ic-arrive i5-c-analyst" style={{ ["--d" as string]: "3900ms", ["--from-x" as string]: "-160px", ["--from-y" as string]: "140px" }} />
              <Cursor who="eng" className="ic-arrive i5-c-eng" style={{ ["--d" as string]: "4050ms", ["--from-x" as string]: "120px", ["--from-y" as string]: "150px" }} />
              <Cursor who="design" className="ic-arrive i5-c-design" style={{ ["--d" as string]: "4200ms", ["--from-x" as string]: "-30px", ["--from-y" as string]: "160px" }} />
              <Cursor who="ai" className="ic-arrive i5-c-ai" style={{ ["--d" as string]: "4400ms", ["--from-x" as string]: "160px", ["--from-y" as string]: "60px" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
