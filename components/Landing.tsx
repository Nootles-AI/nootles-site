import Link from "next/link";
import { AudienceIndex } from "@/components/AudienceIndex";
import { ArrowLeft, Footer, GoToApp, Nav } from "@/components/Chrome";
import { Moments } from "@/components/Moments";
import { Sheet } from "@/components/Sheet";
import type { Audience } from "@/content/audiences";

/* Every page on the site is this page. What changes is the sentence at the top
   and the document under it — which is the only difference that matters, because
   the document is the argument. */

export function Landing({ audience }: { audience: Audience }) {
  const isSegment = audience.slug !== "";

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

          <div className="nt-hero-say">
            <h1 className="nt-h1">{audience.headline}</h1>
            <p className="nt-lede">{audience.sub}</p>
            <div className="nt-hero-act">
              <GoToApp />
            </div>
          </div>

          <div className="nt-desk">
            <div className="nt-desk-back" aria-hidden="true" />
            <Sheet doc={audience.doc} id={audience.slug || "home"} />
          </div>
        </section>

        <section className="nt-section nt-shell">
          <div className="nt-section-head">
            <h2 className="nt-h2">Three things it does while you write.</h2>
          </div>
          <Moments />
        </section>

        <section id="who" className="nt-section nt-shell">
          <div className="nt-section-head">
            <h2 className="nt-h2">Different benches. Same page.</h2>
            <p className="nt-h2-note">
              The tool doesn&rsquo;t change. What people put on it does.
            </p>
          </div>
          <AudienceIndex except={audience.slug} />
        </section>

        <section className="nt-section nt-close">
          <div className="nt-shell">
            <h2 className="nt-h2">Go and think something through.</h2>
            <p className="nt-h2-note">One page, and it keeps up.</p>
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
