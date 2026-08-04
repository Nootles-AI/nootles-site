import Link from "next/link";
import { ArrowLeft, Footer, Nav } from "@/components/Chrome";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="nt-hero nt-shell">
        <div className="nt-hero-say">
          <h1 className="nt-h1">This page isn&rsquo;t one of ours.</h1>
          <p className="nt-lede">
            Nothing here. The ones that do exist are all a click away.
          </p>
          <div className="nt-hero-act">
            <Link className="nt-cta is-quiet" href="/">
              <ArrowLeft />
              Back to Nootles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
