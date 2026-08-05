import Link from "next/link";
import { Wordmark } from "@/components/Brand";
import { site } from "@/lib/site";

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7h9M7.75 3.25 11.5 7l-3.75 3.75" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.5 7h-9M6.25 3.25 2.5 7l3.75 3.75" />
    </svg>
  );
}

export function GoToApp({ quiet }: { quiet?: boolean }) {
  return (
    <a className={quiet ? "nt-cta is-quiet" : "nt-cta"} href={site.appUrl}>
      Go to app
      <ArrowRight className="nt-cta-arrow" />
    </a>
  );
}

export function Nav() {
  return (
    <header className="nt-nav">
      <div className="nt-shell nt-nav-in">
        <Link className="nt-nav-mark" href="/" aria-label={`${site.name} — home`}>
          <Wordmark height={21} width="auto" />
        </Link>
        <GoToApp />
      </div>
    </header>
  );
}

/* The site's own title block, stamped the way every sheet on it is stamped.
   This is where "zero friction" lives: as a drawing's annotation rather than as
   a slogan, which is the difference between stating a fact about the thing and
   selling it back to the reader. */
export function Footer() {
  return (
    <footer className="nt-footer">
      <div className="nt-shell nt-footer-in">
        <Link className="nt-footer-mark" href="/" aria-label={`${site.name} — home`}>
          <Wordmark height={19} width="auto" />
        </Link>
        <p className="nt-meta nt-stamp">Zero friction</p>
        <nav className="nt-footer-links" aria-label="Footer">
          <a className="nt-footer-link" href={site.appUrl}>
            Go to app
          </a>
          <Link className="nt-footer-link" href="/#who">
            Who it&rsquo;s for
          </Link>
        </nav>
      </div>
    </footer>
  );
}
