/* The site's chrome, shared by every page in the new design: the app-style
   bar, which stays with you down the page, and the footer, where the cast
   stands on the top rule the way they stand on the hero's ground. Styles in
   app/ideas/2/idea2.css (.i2-bar, .i2-foot); both live inside an `.i2` root. */
import Link from "next/link";
import { Wordmark } from "@/components/Brand";
import { Arrow, CAST, cast, copy, people } from "@/components/ideas/shared";
import { legal, site } from "@/lib/site";

type Role = keyof typeof people;

const toneOf = (role: Role) => {
  const hue = people[role].hue;
  return hue === "ink" ? { body: "#16181a", ink: "#ffffff" } : cast[hue];
};

/* Who's on the page: the bar's presence pile, the way the app shows it. */
const here: { role: Role; mark: string }[] = [
  { role: "pm", mark: "PM" },
  { role: "design", mark: "D" },
  { role: "eng", mark: "E" },
  { role: "marketing", mark: "M" },
  { role: "analyst", mark: "A" },
  { role: "support", mark: "S" },
];

export function SiteNav() {
  return (
    <header className="i2-bar">
      <Link className="i2-mark" href="/" aria-label={`${site.name} — home`}>
        <Wordmark height={22} width={86} />
      </Link>
      <nav className="i2-links" aria-label="Primary">
        <Link href="/team">Team</Link>
      </nav>
      <div className="i2-right">
        <ul className="i2-pile" aria-hidden="true">
          {here.map((h) => {
            const c = toneOf(h.role);
            return (
              <li key={h.role} style={{ background: c.body, color: c.ink }}>
                {h.mark}
              </li>
            );
          })}
          <li className="i2-pile-ai">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 1.5v9M1.5 6h9" />
            </svg>
          </li>
        </ul>
        <a className="i2-cta" href={site.appUrl}>
          Go to app
        </a>
      </div>
    </header>
  );
}

/* ---- The footer -----------------------------------------------------------------
   The cast again, small, standing on the footer's top rule the way they stood
   on the hero's ground: the page ends where it began. Under the rule, the
   closing line and the CTA once more, then the plain map of the site: the
   product and the legal pages. */
const FOOT_SCALE = 0.22;
export function SiteFooter() {
  return (
    <footer className="i2-foot">
      <div className="i2-foot-cast" aria-hidden="true">
        {CAST.map((c) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={c.role}
            src={c.src}
            width={Math.round(c.w * FOOT_SCALE)}
            height={Math.round(c.h * FOOT_SCALE)}
            alt=""
          />
        ))}
      </div>
      <div className="i2-foot-in">
        <div className="i2-foot-close">
          <p className="i2-foot-line">The context layer for teams</p>
          <a className="i2-foot-go" href={site.appUrl}>
            Get Nootles Free
            <Arrow />
          </a>
        </div>
        <div className="i2-foot-map">
          <div className="i2-foot-brand">
            <Link className="i2-mark" href="/" aria-label={`${site.name} — home`}>
              <Wordmark height={22} width={86} />
            </Link>
            <p>{copy.sub}</p>
          </div>
          <nav className="i2-foot-col" aria-labelledby="i2-foot-product">
            <h2 id="i2-foot-product">Nootles</h2>
            <ul>
              <li>
                <a href={site.appUrl}>Go to app</a>
              </li>
              <li>
                <Link href="/team">Team</Link>
              </li>
            </ul>
          </nav>
          <nav className="i2-foot-col" aria-labelledby="i2-foot-legal">
            <h2 id="i2-foot-legal">Legal</h2>
            <ul>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="i2-foot-base">
          <span>&copy; 2026 {legal.entity}</span>
          <span>{legal.venue}</span>
        </div>
      </div>
    </footer>
  );
}
