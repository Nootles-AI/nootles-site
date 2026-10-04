/* Three ways to show context enriching the Nootles agent, each built on the
   chosen "Wired in" diagram. Context is shown as content, not as colour:
   items arrive one at a time on one shared rhythm, and each variant shows a
   different result of having them.

   1. Tokens & answer — items travel the wires as tokens, stack into a deck
      behind the mark, and the agent answers with something only the
      combination could tell it.
   2. Rings — one ring per source around the mark, each drawing itself
      closed as its context arrives.
   3. Memory graph — each arrival becomes a node on the agent's graph, and
      then the agent links items across sources.

   Item names are synthetic and match the hero's board. */
import type { CSSProperties } from "react";
import { Brandmark } from "@/components/Brand";
import { Logo } from "@/components/ideas/steps/Step1";
import { sources, type SourceKey } from "@/content/sources";

const WIRED: SourceKey[] = ["github", "linear", "figma", "googledocs", "googlesheets", "claude", "jira", "notion"];

/* One rhythm for all three: the first item leaves at 0.5s, one more every
   0.75s, each taking 1s to arrive. */
const T0 = 0.5;
const STEP = 0.75;
const TRAVEL = 1;
const leaves = (i: number) => T0 + i * STEP;
const lands = (i: number) => leaves(i) + TRAVEL;
const ALL_IN = lands(WIRED.length - 1);
const s = (n: number) => `${n.toFixed(2)}s`;

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

/* What each source sends: a short handle for the token or node. */
const ITEM: Record<SourceKey, string> = {
  github: "#381",
  linear: "ENG-142",
  figma: "Mobile / Invite",
  googledocs: "Invite brief",
  googlesheets: "Pricing",
  claude: "Ideas chat",
  jira: "OPS-27",
  notion: "Launch plan",
};

export const wirePath = (i: number, to: { x: number; y: number }, nodeW = 118) => {
  const y = 2 + i * 30 + 13;
  const mid = nodeW + (to.x - nodeW) / 2;
  return `M${nodeW} ${y} C ${mid} ${y}, ${mid} ${to.y}, ${to.x} ${to.y}`;
};

/** The wiring every variant shares: source nodes on the left, one curve per
    source into the mark. Each wire carries its item once, then stays lit in
    its source's colour — connected. */
function Wires({
  labels = true,
  to,
  showDash = true,
  order,
}: {
  labels?: boolean;
  to: { x: number; y: number };
  showDash?: boolean;
  /** Arrival order, when it isn't top to bottom. */
  order?: SourceKey[];
}) {
  const nodeW = labels ? 118 : 26;
  const rank = (k: SourceKey, i: number) => (order ? order.indexOf(k) : i);
  const nodeY = (i: number) => 2 + i * 30 + 13;
  const d = (i: number) => wirePath(i, to, nodeW);
  return (
    <>
      <svg className="en-svg" width="328" height="240" viewBox="0 0 328 240">
        {WIRED.map((k, i) => (
          <g
            key={k}
            style={{ "--c": GLOW[k], "--go": s(leaves(rank(k, i))), "--in": s(lands(rank(k, i))) } as CSSProperties}
          >
            <path className="en-wire" d={d(i)} />
            <path className="en-wire-on" d={d(i)} />
            {showDash ? <path className="en-wire-dash" d={d(i)} pathLength={100} /> : null}
          </g>
        ))}
      </svg>
      {WIRED.map((k, i) => (
        <span
          key={k}
          className={labels ? "st-wire-node" : "en-node-mini"}
          style={{ top: nodeY(i) - 13 }}
        >
          <Logo name={k} size={14} />
          {labels ? sources[k].title : null}
        </span>
      ))}
    </>
  );
}

function Mark({ size, className }: { size: number; className?: string }) {
  return (
    <span className={`en-mark ${className ?? ""}`} style={{ width: size, height: size }}>
      <Brandmark height={Math.round(size * 0.5)} width={Math.round(size * 0.41)} />
    </span>
  );
}

/* ---- 1. Tokens, deck and answer ------------------------------------------ */
const ANSWER: (string | SourceKey)[] = [
  "linear", "ENG-142", "is", "blocked", "by", "github", "#381.", "The", "figma", "frame", "is", "ready", "to", "build.",
];

export function EnrichTokens() {
  const to = { x: 226, y: 112 };
  const answerAt = ALL_IN + 0.5;
  return (
    <div className="st-v en en-tokens">
      <Wires to={to} showDash={false} />
      {WIRED.map((k, i) => (
        <span
          key={k}
          className="en-token"
          style={
            {
              offsetPath: `path("${wirePath(i, to)}")`,
              "--go": s(leaves(i)),
            } as CSSProperties
          }
        >
          <Logo name={k} size={9} />
          {ITEM[k]}
        </span>
      ))}
      <div className="en-deck" style={{ left: to.x, top: to.y - 38 }}>
        {WIRED.map((k, i) => (
          <span
            key={k}
            className="en-card"
            style={{ "--k": i, "--c": GLOW[k], "--in": s(lands(i)), zIndex: 20 - i } as CSSProperties}
          />
        ))}
        <Mark size={76} />
      </div>
      <div className="en-answer" style={{ "--at": s(answerAt) } as CSSProperties}>
        <span className="en-ai">
          <Brandmark height={11} width={9} />
        </span>
        <p>
          {ANSWER.map((w, i) => (
            <span key={i} className="en-word" style={{ "--w": s(answerAt + 0.3 + i * 0.07) } as CSSProperties}>
              {w in sources ? <Logo name={w as SourceKey} size={11} /> : w}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ---- 2. Rings ---------------------------------------------------------------- */
export function EnrichRings() {
  const c = { x: 250, y: 120 };
  const r = (k: number) => 40 + k * 5.5;
  const outer = r(WIRED.length - 1);
  const to = { x: c.x - outer - 2, y: c.y };
  return (
    <div className="st-v en en-rings">
      <Wires to={to} />
      <svg className="en-svg" width="328" height="240" viewBox="0 0 328 240">
        {WIRED.map((k, i) => (
          <g key={k} transform={`rotate(-90 ${c.x} ${c.y})`}>
            <circle className="en-track" cx={c.x} cy={c.y} r={r(i)} />
            <circle
              className="en-ring"
              cx={c.x}
              cy={c.y}
              r={r(i)}
              pathLength={100}
              style={{ "--c": GLOW[k], "--in": s(lands(i)) } as CSSProperties}
            />
          </g>
        ))}
      </svg>
      <Mark size={64} className="en-ring-mark" />
    </div>
  );
}

/* ---- 3. Memory graph -----------------------------------------------------------
   The agent's memory, laid out as a graph rather than a fan. Four items are
   hubs, tied straight to the mark; the rest hang off the hub they belong to,
   so the graph grows outward as context arrives — hubs first, then their
   children — and ends with two links that close small loops. */
type GNode = { k: SourceKey; x: number; y: number; parent: SourceKey | null; hub?: boolean };
/* Balanced but not mirrored, as a force-directed layout settles: hubs at
   uneven distances and angles from the mark, uneven branching (the Linear
   issue has two children, the Claude chat none), and two short cross-links
   that close small loops — the thing that makes a graph read as a graph. */
const GRAPH: GNode[] = [
  { k: "linear", x: 180, y: 49, parent: null, hub: true },
  { k: "figma", x: 234, y: 94, parent: null, hub: true },
  { k: "notion", x: 212, y: 159, parent: null, hub: true },
  { k: "claude", x: 163, y: 188, parent: null, hub: true },
  { k: "github", x: 258, y: 28, parent: "linear" },
  { k: "jira", x: 290, y: 70, parent: "linear" },
  { k: "googledocs", x: 296, y: 134, parent: "figma" },
  { k: "googlesheets", x: 268, y: 206, parent: "notion" },
];
const ARRIVE = GRAPH.map((g) => g.k);
const CROSS: [SourceKey, SourceKey][] = [
  ["googledocs", "jira"], // the brief and the ticket describe the same change
  ["claude", "notion"], // the chat shaped the plan
];

export function EnrichGraph() {
  const c = { x: 154, y: 120 };
  const to = { x: c.x - 28, y: c.y };
  const at = (k: SourceKey) => GRAPH.find((g) => g.k === k)!;
  const crossAt = (j: number) => ALL_IN + 0.5 + j * 0.45;
  return (
    <div className="st-v en en-graph">
      <Wires labels={false} to={to} order={ARRIVE} />
      <svg className="en-svg" width="328" height="240" viewBox="0 0 328 240">
        {GRAPH.map((g, i) => {
          const from = g.parent ? at(g.parent) : c;
          return (
            <line
              key={g.k}
              className={`en-edge${g.hub ? " is-hub" : ""}`}
              x1={from.x}
              y1={from.y}
              x2={g.x}
              y2={g.y}
              pathLength={100}
              style={{ "--in": s(lands(i)) } as CSSProperties}
            />
          );
        })}
        {CROSS.map(([a, b], j) => {
          const A = at(a);
          const B = at(b);
          return (
            <line
              key={j}
              className="en-link"
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              style={{ "--at": s(crossAt(j)) } as CSSProperties}
            />
          );
        })}
      </svg>
      <Mark size={56} className="en-graph-mark" />
      {GRAPH.map((g, i) => (
        <span
          key={g.k}
          className={`en-gnode${g.hub ? " is-hub" : ""}`}
          style={{ left: g.x, top: g.y, "--in": s(lands(i)) } as CSSProperties}
        >
          <span className="en-gdot">
            <Logo name={g.k} size={g.hub ? 13 : 11} />
          </span>
          <span className="en-glabel">{ITEM[g.k]}</span>
        </span>
      ))}
    </div>
  );
}
