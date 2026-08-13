import Link from "next/link";
import { AudienceIndex } from "@/components/AudienceIndex";
import { ArrowLeft, Footer, GoToApp, Nav } from "@/components/Chrome";
import { Frictions } from "@/components/Frictions";
import { Recording } from "@/components/Recording";
import { Sheet } from "@/components/Sheet";
import { audiences, type Audience } from "@/content/audiences";

/* Every page on the site is this page. What changes is the claim at the top and
   the sheet beside it — and the sheet is the part that matters, because the
   document is the argument. A segment page that differed only in its noun would
   not be worth the route. */

/* A legend is what a drawing uses to say what its marks mean, which makes it
   the honest place to state what a page can hold. Stated as a legend rather
   than as a grid of icon cards, which is the same list wearing a costume. */
const legend = [
  ["Canvas", "Diagrams and wireframes, dragged rather than redrawn"],
  ["Code", "A real editor, with the grammar for the language"],
  ["Maths", "Set properly, and evaluated where it stands"],
  ["Tables", "Numbers ruled and ranged, next to the argument"],
  ["Charts", "Bars and plots, drawn from the numbers above them"],
];

export function Landing({ audience }: { audience: Audience }) {
  const isSegment = audience.slug !== "";
  /* The home page is sheet one; the seven benches follow it in register order.
     Both halves are padded, because a title block that reads "01 / 8" is a
     title block nobody squared up. */
  const index = audiences.findIndex((a) => a.slug === audience.slug);
  const total = String(audiences.length + 1).padStart(2, "0");
  const sheetNo = `${String(isSegment ? index + 2 : 1).padStart(2, "0")} / ${total}`;

  return (
    <>
      <Nav />

      <main>
        <section className="nt-hero nt-shell">
          {isSegment ? (
            <Link className="nt-back" href="/">
              <ArrowLeft />
              Nootles
            </Link>
          ) : null}

          <div className="nt-hero-grid">
            <div className="nt-hero-say">
              <h1 className="nt-h1">{audience.headline}</h1>
              <p className="nt-lede">{audience.sub}</p>
              <div className="nt-hero-act">
                <GoToApp />
              </div>

              <dl className="nt-legend">
                {legend.map(([key, what]) => (
                  <div className="nt-legend-row" key={key}>
                    <dt className="nt-legend-key nt-meta nt-stamp">{key}</dt>
                    <dd className="nt-legend-text">{what}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Sheet
              doc={audience.doc}
              id={audience.slug || "home"}
              name={audience.label}
              sheet={sheetNo}
              across="600 px — one measure"
              down="One page"
            >
              {/* Sheet one is written in front of you; the seven benches are
                  printed. The claim being made at the fold is that the model
                  writes, draws and edits the page — which is a thing that
                  happens, and so a thing that has to be shown happening. */}
              {isSegment ? null : <Recording />}
            </Sheet>
          </div>
        </section>

        <section className="nt-section nt-shell">
          <div className="nt-section-head">
            <span className="nt-section-no nt-meta nt-stamp" aria-hidden="true">
              01
            </span>
            <div>
              <h2 className="nt-h2">Three things you stop doing.</h2>
              <p className="nt-h2-note">
                None of these are interesting as features. They are interesting
                because you no longer have to do them.
              </p>
            </div>
          </div>
          <Frictions />
        </section>

        <section id="who" className="nt-section nt-shell">
          <div className="nt-section-head">
            <span className="nt-section-no nt-meta nt-stamp" aria-hidden="true">
              02
            </span>
            <div>
              <h2 className="nt-h2">Different work. Same page.</h2>
              <p className="nt-h2-note">
                What changes between these is the document, not the tool. Each
                one shows the blocks that bench actually reaches for.
              </p>
            </div>
          </div>
          <AudienceIndex except={audience.slug} />
        </section>

        <section className="nt-section nt-close">
          <div className="nt-shell nt-close-in">
            <div>
              <h2 className="nt-h2">Nothing to set up. Open a page.</h2>
              <p className="nt-h2-note">
                It is one document. Everything you need goes on it.
              </p>
            </div>
            <div className="nt-hero-act">
              <GoToApp />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
