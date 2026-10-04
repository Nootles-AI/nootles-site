/* Step 1 of the second section, "Import your context": five ideas for the
   box's visual, each shown in a real three-box row. Every visual is pure CSS
   motion on a loop, with a still final frame under reduced motion; all of it
   is decorative (aria-hidden), and the box's own heading and line carry the
   meaning. Item names are synthetic and match the hero's board (the invite
   flow, the launch board) so the page tells one story. */
import type { CSSProperties, ReactNode } from "react";
import { Brandmark } from "@/components/Brand";
import { Cursor } from "@/components/ideas/shared";
import { sources, type SourceKey, type SourceMark } from "@/content/sources";

const ORDER: SourceKey[] = ["github", "linear", "figma", "claude", "jira", "notion"];
/* The chosen visual wires in every source, Google's two included. */
const WIRED: SourceKey[] = ["github", "linear", "figma", "googledocs", "googlesheets", "claude", "jira", "notion"];

export function Logo({ name, size = 18, mono }: { name: SourceKey; size?: number; mono?: boolean }) {
  const s: SourceMark = sources[name];
  if (s.color && !mono) {
    return (
      <svg className="st-logo" width={size} height={size} viewBox={s.color.viewBox} aria-hidden="true">
        {s.color.parts.map((p) => (
          <path key={p.d} d={p.d} fill={p.fill} />
        ))}
      </svg>
    );
  }
  return (
    <svg className="st-logo" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={s.d} fill={mono ? "currentColor" : s.hex} />
    </svg>
  );
}

/** The step box itself: number, heading, one line, then the visual. */
export function StepBox({
  n,
  title,
  line,
  children,
  muted,
}: {
  n: number;
  title: string;
  line: string;
  children?: ReactNode;
  muted?: boolean;
}) {
  return (
    <article className={`st-box${muted ? " is-muted" : ""}`}>
      <h3 className="st-title">
        <span className="st-n">{n}</span>
        {title}
      </h3>
      <p className="st-line">{line}</p>
      <div className="st-visual" aria-hidden="true">
        {children}
      </div>
    </article>
  );
}

export const STEP1 = {
  title: "Import your context",
  line: "Bring in the issues, designs, docs and code your team already works from. The Nootles agent can reference these!",
};

/* ---- 1. Pull-in ------------------------------------------------------------
   The six sources ring a small canvas; one by one, each sends in a piece of
   work, which lands on the canvas as a card. */
const PULL = [
  { k: "github", tile: [8, 10], label: "#381 Invite API", slot: [0, 0] },
  { k: "linear", tile: [144, 0], label: "ENG-142", slot: [1, 0] },
  { k: "figma", tile: [280, 10], label: "Mobile / Invite", slot: [0, 1] },
  { k: "claude", tile: [8, 190], label: "Onboarding ideas", slot: [1, 1] },
  { k: "jira", tile: [144, 200], label: "OPS-27", slot: [0, 2] },
  { k: "notion", tile: [280, 190], label: "Launch plan", slot: [1, 2] },
] as const;

export function PullIn() {
  // Canvas at (84, 62), 160 × 116; slots 70 × 26 on a 2 × 3 grid inside it.
  const cx = 84;
  const cy = 62;
  return (
    <div className="st-v st-pull">
      <div className="st-pull-canvas" style={{ left: cx, top: cy }}>
        <span className="st-pull-name">Launch board</span>
      </div>
      {PULL.map((p, i) => {
        const sx = cx + 8 + p.slot[0] * 74;
        const sy = cy + 26 + p.slot[1] * 30;
        const tx = p.tile[0] + 20 - (sx + 35);
        const ty = p.tile[1] + 20 - (sy + 13);
        return (
          <span key={p.k}>
            <span className="st-tile" style={{ left: p.tile[0], top: p.tile[1], "--i": i } as CSSProperties}>
              <Logo name={p.k} size={20} />
            </span>
            <span
              className="st-chip"
              style={{ left: sx, top: sy, "--i": i, "--fx": `${tx}px`, "--fy": `${ty}px` } as CSSProperties}
            >
              <Logo name={p.k} size={10} />
              {p.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* ---- 2. Drag from the dock -------------------------------------------------
   The sources sit in a dock above the canvas. The PM drags an issue out of
   Linear, a frame out of Figma and a pull request out of GitHub, and drops
   each on the board — the hero's own mechanics. */
export function DragDock() {
  return (
    <div className="st-v st-dock">
      <div className="st-dock-row">
        {ORDER.map((k) => (
          <span key={k} className={`st-tile is-${k}`}>
            <Logo name={k} size={18} />
          </span>
        ))}
      </div>
      <div className="st-canvas st-dock-canvas" />
      <div className="st-dk-card st-dk-a">
        <Logo name="linear" size={14} />
        <span>
          <b>Invite flow</b>
          <em>ENG-142 · In progress</em>
        </span>
      </div>
      <div className="st-dk-frame st-dk-b">
        <span className="st-dk-frame-name">
          <Logo name="figma" size={9} />
          Mobile / Invite
        </span>
        <span className="st-dk-frame-art">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="st-dk-card st-dk-c">
        <Logo name="github" size={14} />
        <span>
          <b>Add invite API</b>
          <em>#381 · 3 files</em>
        </span>
      </div>
      <Cursor who="pm" className="st-dk-hand" />
    </div>
  );
}

/* ---- 3. Paste & unfurl -------------------------------------------------------
   A link is pasted onto the canvas and opens into the thing it points at —
   cycling through every source, with the dock below marking which is live. */
const UNFURL: { k: SourceKey; url: string; title: string; meta: string }[] = [
  { k: "linear", url: "linear.app/nootles/issue/ENG-142", title: "Invite flow", meta: "Issue · In progress" },
  { k: "figma", url: "figma.com/design/nootles/Mobile", title: "Mobile / Invite", meta: "Frame · 164 × 354" },
  { k: "github", url: "github.com/nootles/app/pull/381", title: "Add invite API", meta: "Pull request · 3 files" },
  { k: "notion", url: "notion.so/nootles/Launch-plan", title: "Launch plan", meta: "Page · 6 sections" },
  { k: "jira", url: "nootles.atlassian.net/browse/OPS-27", title: "Beta access", meta: "Ticket · To do" },
  { k: "claude", url: "claude.ai/share/onboarding-ideas", title: "Onboarding ideas", meta: "Chat · 14 messages" },
];

export function PasteUnfurl() {
  return (
    <div className="st-v st-paste">
      <div className="st-canvas st-paste-canvas">
        {UNFURL.map((u, i) => (
          <div key={u.k} className="st-slide" style={{ "--i": i } as CSSProperties}>
            <div className="st-url">
              <span className="st-url-text">{u.url}</span>
            </div>
            <div className="st-unfurl">
              <span className="st-unfurl-logo">
                <Logo name={u.k} size={20} />
              </span>
              <span className="st-unfurl-body">
                <em>{sources[u.k].title}</em>
                <b>{u.title}</b>
                <span>{u.meta}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="st-paste-dock">
        {UNFURL.map((u, i) => (
          <span key={u.k} className="st-paste-dot" style={{ "--i": i } as CSSProperties}>
            <Logo name={u.k} size={14} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- 4. Slash import ---------------------------------------------------------
   Someone types /import on the canvas, the six sources come up, they pick
   Figma, and the frame lands in place of the menu. */
export function SlashImport() {
  return (
    <div className="st-v st-slash">
      <div className="st-canvas st-slash-canvas">
        <div className="st-slash-line">
          <span className="st-slash-typed">/import</span>
          <span className="st-slash-caret" />
        </div>
        <div className="st-menu">
          <span className="st-menu-hl" />
          {ORDER.map((k) => (
            <div key={k} className="st-menu-row">
              <Logo name={k} size={14} />
              {sources[k].title}
            </div>
          ))}
        </div>
        <div className="st-embed">
          <span className="st-embed-name">
            <Logo name="figma" size={10} />
            Mobile / Invite
          </span>
          <span className="st-embed-art">
            <span className="st-embed-phone">
              <i />
              <i />
              <i />
            </span>
            <span className="st-embed-phone is-b">
              <i />
              <i />
              <i />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---- 5. Wired in -------------------------------------------------------------
   A diagram in the canvas's own drawing language: six source nodes wired into
   the Nootles mark, light running along the wires. Calm, and complete at
   a glance. The chosen Step 1 visual. */
/* The colour each source's light and glow takes: its brand colour, except the
   two black marks, which glow as soft greys — black light reads as dirt. */
const GLOW: Record<SourceKey, string> = {
  github: "#8a8f98",
  linear: "#5E6AD2",
  figma: "#1ABCFE",
  googledocs: "#4285F4",
  googlesheets: "#34A853",
  claude: "#D97757",
  jira: "#0052CC",
  notion: "#a7a39b",
};

/* The mist inside the tile: six soft clouds in the sources' clean colours,
   each with its own resting place, rise time and drift period, so the fill
   billows rather than moving as one front. */
const MIST = [
  { c: "#6f9dff", x: 14, y: 52, rise: 4.6, drift: 9 },
  { c: "#46c9f5", x: 56, y: 60, rise: 5.6, drift: 11 },
  { c: "#5fd68a", x: 30, y: 74, rise: 3.8, drift: 10 },
  { c: "#ff8f73", x: 64, y: 26, rise: 7.2, drift: 12 },
  { c: "#8c7bff", x: 20, y: 18, rise: 6.6, drift: 13 },
  { c: "#ffb36b", x: 50, y: 40, rise: 6, drift: 8 },
];

export function WiredIn() {
  const nodeY = (i: number) => 2 + i * 30 + 13;
  const target = { x: 222, y: 118 };
  return (
    <div className="st-v st-wire">
      <svg className="st-wire-svg" width="328" height="240" viewBox="0 0 328 240">
        {WIRED.map((k, i) => {
          const y = nodeY(i);
          const d = `M118 ${y} C 168 ${y}, 168 ${target.y}, ${target.x} ${target.y}`;
          return (
            <g key={k}>
              <path className="st-wire-base" d={d} />
              <path
                className="st-wire-flow"
                d={d}
                pathLength={100}
                style={{ "--i": i, "--c": GLOW[k] } as CSSProperties}
              />
            </g>
          );
        })}
      </svg>
      {WIRED.map((k, i) => (
        <span key={k} className="st-wire-node" style={{ top: nodeY(i) - 13 }}>
          <Logo name={k} size={14} />
          {sources[k].title}
        </span>
      ))}
      {/* The mark soaks it up: a glowing mist of the sources' colours rises
          and gathers inside the tile — softer than liquid, fuller than smoke —
          until it's full, then keeps slowly drifting. Nothing pulses. */}
      <div className="st-wire-n">
        <span className="st-wire-mark">
          <span className="st-ink">
            <span className="st-mist">
              {MIST.map((m, i) => (
                <span
                  key={i}
                  className="st-puff"
                  style={
                    {
                      "--c": m.c,
                      "--x": `${m.x}px`,
                      "--y": `${m.y}px`,
                      "--rise": `${m.rise}s`,
                      "--drift": `${m.drift}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          </span>
          <Brandmark height={46} width={38} />
        </span>
      </div>
    </div>
  );
}
