/* IDEA 1 — The poster on the grid.
   THESIS: the headline is the hero, set like an International Style poster: one
   face, hierarchy by size alone, everything hung on a visible 12-column layout
   grid — the same grid a design tool draws while you work. Refuses the centred
   stack with a gradient behind it.
   OWN-WORLD: white stock, near-black ink, hairline column guides; colour only
   arrives with people — cursors and their selection frames, in their
   character's body colour.
   STORY: you read the line, see two people already holding parts of it, and
   understand "together" before the subtitle says it.
   FIRST VIEWPORT: headline flush left across 11 columns; subtitle and CTA hung
   from column 7; the cast standing on a hairline floor across the full grid.
   FORM: grounded #5 (assigned). Raise from the festival-lineup challenger:
   type does every job, one face, hierarchy by size and break alone. */
import { Characters, Cursor, IdeaNav, copy } from "@/components/ideas/shared";
import { Selection } from "@/components/ideas/Selection";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ideas/shared";

export function Idea1Swiss() {
  return (
    <div className="ic-root i1">
      <div className="i1-guides" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="i1-frame">
        <IdeaNav />

        <section className="i1-hero">
          <h1 className="i1-title">
            <span className="i1-line">
              Stop{" "}
              <Selection hue="green" style={{ ["--sel-delay" as string]: "1150ms" }}>
                Passing Docs Around.
                <Cursor who="analyst" className="ic-arrive i1-c-analyst" style={{ ["--d" as string]: "500ms", ["--from-x" as string]: "-180px", ["--from-y" as string]: "140px" }} />
              </Selection>
            </span>
            <span className="i1-line">
              Start Building{" "}
              <Selection hue="blue" style={{ ["--sel-delay" as string]: "1850ms" }}>
                Together.
                <Cursor who="eng" className="ic-arrive i1-c-eng" style={{ ["--d" as string]: "1200ms", ["--from-x" as string]: "160px", ["--from-y" as string]: "-120px" }} />
              </Selection>
            </span>
          </h1>

          <div className="i1-under">
            <p className="i1-sub">
              {copy.sub}
              <Cursor who="ai" className="ic-arrive i1-c-ai" style={{ ["--d" as string]: "2300ms", ["--from-x" as string]: "90px", ["--from-y" as string]: "80px" }} />
            </p>
            <div className="i1-act">
              <a className="i1-cta" href={site.appUrl}>
                Go to app
                <Arrow />
              </a>
              <Cursor who="design" className="ic-arrive i1-c-design" style={{ ["--d" as string]: "2900ms", ["--from-x" as string]: "140px", ["--from-y" as string]: "40px" }} />
            </div>
          </div>
        </section>

        <div className="i1-floor">
          <Characters />
        </div>
      </div>
    </div>
  );
}
