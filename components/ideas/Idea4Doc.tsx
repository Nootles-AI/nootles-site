/* IDEA 4 — The page everyone is on.
   THESIS: the hero is one shared page, the headline its title, with the
   conversation in the margin instead of in an inbox — and the AI's edit held
   as a suggestion until a person accepts it. Refuses the feature-grid hero
   and the floating-UI-collage hero.
   OWN-WORLD: a single white sheet with a hairline edge on a white desk; a
   text face for the document, a quiet UI sans for everything around it;
   highlights and comment chips in the cast's colours.
   STORY: "which version is the latest?" gets answered by there being one;
   the AI proposes, a person says yes.
   FIRST VIEWPORT: the sheet centred-left, title and subtitle set as document
   text, CTA inside the page; comment rail to its right; the cast standing in
   front of the sheet's lower edge.
   FORM: grounded #3. */
import { Arrow, Characters, Cursor, IdeaNav, cast, copy } from "@/components/ideas/shared";
import { site } from "@/lib/site";

export function Idea4Doc() {
  return (
    <div className="ic-root i4">
      <IdeaNav />

      <section className="i4-desk">
        <article className="i4-sheet">
          <h1 className="i4-title">
            Stop{" "}
            <mark className="i4-hl" style={{ ["--c" as string]: cast.yellow.body, ["--d" as string]: "700ms" }}>
              Passing Docs Around.
              <Cursor who="eng" className="ic-arrive i4-c-eng" style={{ ["--d" as string]: "500ms", ["--from-x" as string]: "160px", ["--from-y" as string]: "120px" }} />
            </mark>
            <br />
            Start Building Together.
          </h1>

          <p className="i4-sub">
            <span className="sr-only">{copy.sub}</span>
            <span aria-hidden="true">
              The <del className="i4-del">shared</del>
              <ins className="i4-ins">multiplayer</ins> AI canvas for teams.
            </span>
          </p>

          <div className="i4-act">
            <a className="i4-cta" href={site.appUrl}>
              Go to app
              <Arrow />
            </a>
          </div>
        </article>

        <aside className="i4-rail" aria-hidden="true">
          <div className="i4-note i4-note-q" style={{ ["--c" as string]: cast.yellow.body }}>
            <div className="i4-who">
              <span className="i4-dot" style={{ background: cast.yellow.body, color: cast.yellow.ink }}>D</span>
              Designer
            </div>
            <p>Which version is the latest?</p>
            <div className="i4-reply">
              <div className="i4-who">
                <span className="i4-dot" style={{ background: cast.peri.body, color: cast.peri.ink }}>PM</span>
                PM
              </div>
              <p>This one. There&rsquo;s only one now.</p>
            </div>
          </div>

          <div className="i4-note i4-note-ai">
            <div className="i4-who">
              <span className="i4-dot i4-dot-ai">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M6 1.5v9M1.5 6h9" />
                </svg>
              </span>
              Nootles AI
              <span className="i4-tag">Suggestion</span>
            </div>
            <p>
              Replace <s>shared</s> with <u>multiplayer</u>
            </p>
            <div className="i4-btns">
              <span className="i4-btn">Reject</span>
              <span className="i4-btn i4-accept">
                Accept
                <Cursor who="analyst" className="i4-c-analyst" />
              </span>
            </div>
            <div className="i4-done">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 7.2 2.6 2.6L11 4.4" />
              </svg>
              Accepted by PM
            </div>
          </div>

        </aside>

        <div className="i4-floor">
          <Characters />
        </div>
      </section>
    </div>
  );
}
