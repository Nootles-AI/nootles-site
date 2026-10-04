import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Wordmark } from "@/components/Brand";
import { site } from "@/lib/site";

/* Shared parts for the five hero ideas. Every idea draws from one cast: the six
   characters in characters.png, each with its own body colour, and each
   collaborator's cursor wears the colour of the character standing below. That
   tie is the one system all five ideas keep — the rest is theirs to decide. */

export const cast = {
  green: { body: "#7bd5a3", ink: "#123d26" },
  peri: { body: "#aac3f9", ink: "#17284f" },
  yellow: { body: "#ffcc62", ink: "#4a3000" },
  blue: { body: "#65afff", ink: "#0b2a4d" },
  purple: { body: "#884ed3", ink: "#ffffff" },
  pink: { body: "#f68ea0", ink: "#4d0f1b" },
} as const;

export type Hue = keyof typeof cast;

/* Cursors carry roles, not names: the point is that every kind of teammate
   is on the same page. Each role wears the colour of the character whose prop
   says that job — the builder with </> is the engineer, the painter the
   designer, and so on. The AI cursor is the product's own. */
export const people = {
  pm: { name: "PM", hue: "peri" },
  eng: { name: "Engineer", hue: "blue" },
  design: { name: "Designer", hue: "yellow" },
  marketing: { name: "Marketing", hue: "purple" },
  analyst: { name: "Analyst", hue: "green" },
  support: { name: "Support", hue: "pink" },
  ai: { name: "Nootles AI", hue: "ink" },
} as const;

type Who = keyof typeof people;

/** A collaborator's pointer and name tag. Purely decorative, never read. */
export function Cursor({
  who,
  className,
  style,
  label = true,
}: {
  who: Who;
  className?: string;
  style?: CSSProperties;
  label?: boolean;
}) {
  const p = people[who];
  const fill = p.hue === "ink" ? "#16181a" : cast[p.hue].body;
  const text = p.hue === "ink" ? "#ffffff" : cast[p.hue].ink;
  return (
    <span
      className={`ic-cursor ${className ?? ""}`}
      style={{ ...style, ["--c" as string]: fill, ["--ct" as string]: text }}
      aria-hidden="true"
    >
      <svg width="18" height="20" viewBox="0 0 18 20" className="ic-cursor-arrow">
        <path
          d="M1.5 1.6 16 9.2 9.4 10.9 6 17.4 1.5 1.6Z"
          fill="var(--c)"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      {label ? <span className="ic-cursor-tag">{p.name}</span> : null}
    </span>
  );
}

/** The cast, standing on the hero's floor. Cropped to the figures, so the
    image's own width is the row's width. */
export function Characters({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`ic-characters ${className ?? ""}`}
      src="/hero/characters.webp"
      width={4161}
      height={975}
      alt="Six Nootles characters side by side: one presenting a chart, one waving a flag, one painting, one building, one directing and one on a support call."
      fetchPriority="high"
    />
  );
}

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 7h9M7.75 3.25 11.5 7l-3.75 3.75" />
    </svg>
  );
}

/** The nav every idea shares in content; each idea styles it through its own
    class on the root. */
export function IdeaNav({ cta = "Go to app" }: { cta?: ReactNode }) {
  return (
    <header className="ic-nav">
      <Link className="ic-nav-mark" href="/" aria-label={`${site.name} — home`}>
        <Wordmark height={22} width={86} />
      </Link>
      <nav className="ic-nav-links" aria-label="Primary">
        <Link href="/#who">Who it&rsquo;s for</Link>
        <Link href="/team">Team</Link>
      </nav>
      <a className="ic-nav-cta" href={site.appUrl}>
        {cta}
      </a>
    </header>
  );
}

export const copy = {
  titleA: "Stop Passing Docs Around.",
  titleB: "Start Planning Together.",
  sub: "The multiplayer AI canvas for teams.",
} as const;

/* The cast, cut from characters.png, in the order they stand. Widths are the
   cut-outs' own (at half the source scale), so every figure shares one scale. */
export const CAST = [
  { role: "analyst", src: "/hero/cast/analyst.webp", w: 464, h: 426 },
  { role: "pm", src: "/hero/cast/pm.webp", w: 364, h: 487 },
  { role: "design", src: "/hero/cast/designer.webp", w: 352, h: 286 },
  { role: "eng", src: "/hero/cast/engineer.webp", w: 296, h: 408 },
  { role: "marketing", src: "/hero/cast/marketing.webp", w: 330, h: 318 },
  { role: "support", src: "/hero/cast/support.webp", w: 240, h: 388 },
] as const;
