/* Section 3 — "Everything you can do, our agent can too." A masonry of the kinds
   of work a board holds, each one being made by the same Nootles AI cursor,
   so the claim is shown rather than listed. Each tile plays once, when it is
   first scrolled into view; every visual is decorative (aria-hidden), and the
   tile's own heading and line carry the meaning. Content is synthetic and
   continues the hero's story: the invite flow and its launch.

   Time is written in milliseconds from the moment a tile starts. A tile's
   --d0 offsets its whole timeline, so a row of tiles doesn't start in step. */
import type { CSSProperties, ReactNode } from "react";
import { Cursor, cast } from "@/components/ideas/shared";
import { AppProject } from "./AppProject";
import { InView } from "./InView";

const t = (n: number) => `calc(var(--d0) + ${Math.round(n)}ms)`;
type V = CSSProperties & Record<`--${string}`, string | number>;

/* The cursor's path, as keyframes: [ms, x, y] stops, each leg eased. */
type Stop = [number, number, number];
type Track = { name: string; css: string; total: number };
function track(name: string, total: number, stops: Stop[]): Track {
  const frames = stops
    .map(([at, x, y]) => `${((at / total) * 100).toFixed(2)}%{translate:${x}px ${y}px}`)
    .join("");
  return { name, total, css: `@keyframes ${name}{${frames}}` };
}

function Agent({ path }: { path: Track }) {
  return (
    <>
      <style>{path.css}</style>
      <Cursor
        who="ai"
        className="sc-ai"
        style={
          {
            animation: `${path.name} ${path.total}ms cubic-bezier(0.45, 0, 0.25, 1) var(--d0) both`,
            "--rest": t(path.total + 600),
          } as V
        }
      />
    </>
  );
}

/** Text written in front of you: one span per character (or word), each
    landing on its beat, with the amber head that marks the model at work
    riding the newest one. Layout is final from the start, so nothing reflows. */
function Typed({
  text,
  at,
  step,
  hold = 0,
  by = "char",
  cls,
}: {
  text: string;
  at: number;
  step: number;
  hold?: number;
  by?: "char" | "word";
  cls?: string;
}) {
  const parts = by === "word" ? text.split(/(?<= )/) : [...text];
  const last = parts.length - 1;
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          className={`sc-c${cls ? ` ${cls}` : ""}`}
          style={{ "--ws": t(at + i * step), "--we": t(i === last ? at + i * step + step + hold : at + (i + 1) * step) } as V}
        >
          {p}
        </span>
      ))}
    </>
  );
}
const typedEnd = (text: string, at: number, step: number, by: "char" | "word" = "char") =>
  at + (by === "word" ? text.split(/(?<= )/).length : [...text].length) * step;

function Tile({
  kind,
  title,
  hint,
  line,
  soon,
  d0 = 0,
  h,
  total,
  children,
}: {
  kind: string;
  title: string;
  hint?: string;
  line: string;
  soon?: boolean;
  d0?: number;
  h: number;
  /** One take's length in ms, for hover replays. */
  total: number;
  children: ReactNode;
}) {
  return (
    <InView className={`sc-tile is-${kind}`} d0={d0} total={total}>
      <div className="sc-stage" aria-hidden="true">
        <div className="sc-art" style={{ height: h }}>
          {children}
        </div>
      </div>
      <div className="sc-cap">
        <h3>{title}</h3>
        {soon ? <span className="sc-soon">Coming soon</span> : <code className="sc-hint">{hint}</code>}
        <p>{line}</p>
      </div>
    </InView>
  );
}

/* ---- Diagrams ------------------------------------------------------------------
   A checkout flow, box by box: the agent places each node, then wires it. */
const DG_NODES = [
  { label: "Cart", x: 34, y: 34, w: 84, at: 300, fill: "#eef3fe", line: "#9fb6ea" },
  { label: "Payment", x: 132, y: 34, w: 104, at: 900, fill: "#fff5dc", line: "#e6bd5c" },
  { label: "Receipt", x: 232, y: 214, w: 92, at: 2100, fill: "#e8f7ef", line: "#7cc9a0" },
  { label: "Retry", x: 34, y: 214, w: 92, at: 2700, fill: "#fdeef0", line: "#f0a3b0" },
];
const DG_WIRES = [
  { d: "M118 54H130", head: "M125 49.5 130.5 54 125 58.5", at: 600 },
  { d: "M184 74V103", head: "M179.5 98 184 103.5 188.5 98", at: 1200 },
  { d: "M219 140H278V212", head: "M273.5 206.5 278 212 282.5 206.5", at: 1800 },
  { d: "M149 140H80V212", head: "M75.5 206.5 80 212 84.5 206.5", at: 2400 },
  { d: "M34 234H18V54H31", head: "M26 49.5 31.5 54 26 58.5", at: 3050, dashed: true },
];
const DG_D = 3600;
function Diagram() {
  const D = DG_D;
  const path = track("sc-cur-dg", D, [
    [0, 300, 292], [250, 104, 66], [600, 104, 66], [850, 226, 66], [1200, 226, 66], [1450, 200, 150],
    [1800, 200, 150], [2050, 310, 246], [2400, 310, 246], [2650, 112, 246], [2950, 112, 246],
    [3150, 12, 150], [3450, 12, 150], [D, 24, 168],
  ]);
  return (
    <>
      <span className="sc-label">Checkout flow</span>
      <svg className="sc-dg-wires" width="340" height="290" viewBox="0 0 340 290">
        {DG_WIRES.map((w) => (
          <g key={w.d} style={{ "--at": t(w.at) } as V}>
            <path className={`sc-wire${w.dashed ? " is-dashed" : ""}`} d={w.d} pathLength={100} />
            <path className="sc-wire-head" d={w.head} />
          </g>
        ))}
      </svg>
      <span className="sc-dg-say" style={{ left: 240, top: 124, "--at": t(1950) } as V}>yes</span>
      <span className="sc-dg-say" style={{ left: 104, top: 124, "--at": t(2550) } as V}>no</span>
      {DG_NODES.map((n) => (
        <span
          key={n.label}
          className="sc-dg-node sc-pop sc-flash"
          style={{ left: n.x, top: n.y, width: n.w, "--fill": n.fill, "--line": n.line, "--at": t(n.at) } as V}
        >
          {n.label}
        </span>
      ))}
      <span className="sc-dg-diamond sc-pop sc-flash" style={{ "--at": t(1500) } as V} />
      <span className="sc-dg-ask sc-pop" style={{ "--at": t(1500) } as V}>Paid?</span>
      <Agent path={path} />
    </>
  );
}

/* ---- Design --------------------------------------------------------------------
   The way a design tool works: the agent drags out a frame, readout counting,
   places an image, writes the title and price, then draws the button — and
   each layer lands in the layers panel as it's made. */
const DZ_LAYERS = [
  { name: "Pricing / Pro", glyph: "#", at: 400, nest: 0 },
  { name: "Image", glyph: "▣", at: 1700, nest: 1 },
  { name: "Title", glyph: "T", at: 2200, nest: 1 },
  { name: "Price", glyph: "T", at: 2700, nest: 1 },
  { name: "Button", glyph: "▭", at: 3100, nest: 1 },
];
const DZ_D = 4400;
function Design() {
  const D = DZ_D;
  const path = track("sc-cur-dz", D, [
    [0, 334, 330], [400, 122, 30], [1300, 318, 300], [1500, 318, 300], [1700, 210, 84], [2000, 210, 84],
    [2200, 160, 170], [2550, 160, 170], [2700, 176, 214], [2950, 176, 214], [3100, 134, 250],
    [3600, 306, 286], [4000, 306, 286], [D, 326, 314],
  ]);
  return (
    <>
      <div className="sc-dz-layers">
        <span className="sc-dz-lh">Layers</span>
        {DZ_LAYERS.map((l, i) => (
          <span
            key={l.name}
            className={`sc-dz-row${l.nest ? " is-nested" : ""}`}
            style={{ "--a": t(l.at), "--b": t(DZ_LAYERS[i + 1]?.at ?? 99999) } as V}
          >
            <i>{l.glyph}</i>
            {l.name}
          </span>
        ))}
      </div>
      <span className="sc-dz-name" style={{ "--at": t(1300) } as V}>
        # Pricing / Pro
      </span>
      <div className="sc-dz-frame sc-flash" style={{ "--at": t(400), "--fl": "1200ms" } as V}>
        <span className="sc-dz-dim" style={{ "--off": t(1500) } as V} />
        <span className="sc-dz-img sc-pop sc-flash" style={{ "--at": t(1700) } as V}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/cast/designer.webp" width={118} height={96} alt="" />
        </span>
        <span className="sc-dz-title">
          <Typed text="Pro" at={2200} step={90} hold={200} />
        </span>
        <span className="sc-dz-sub sc-pop" style={{ "--at": t(2450) } as V}>
          For teams who build together
        </span>
        <span className="sc-dz-price sc-pop sc-flash" style={{ "--at": t(2700) } as V}>
          <b>$12</b> per seat a month
        </span>
        <span className="sc-dz-btn" style={{ "--at": t(3100), "--fill": t(3600) } as V}>
          <span className="sc-dz-btn-label" style={{ "--at": t(3900) } as V}>
            Upgrade
          </span>
        </span>
      </div>
      <Agent path={path} />
    </>
  );
}

/* ---- Code ----------------------------------------------------------------------
   A real function, written line by line with the head riding the last key. */
type Tok = [string, "kw" | "fn" | "ty" | "pl"];
const CODE: Tok[][] = [
  [["export async function ", "kw"], ["share", "fn"], ["(id: ", "pl"], ["string", "ty"], [") {", "pl"]],
  [["  const ", "kw"], ["board = ", "pl"], ["await ", "kw"], ["boards.", "pl"], ["get", "fn"], ["(id);", "pl"]],
  [["  const ", "kw"], ["link = ", "pl"], ["await ", "kw"], ["invite", "fn"], ["(board);", "pl"]],
  [["  return ", "kw"], ["link.url;", "pl"]],
  [["}", "pl"]],
];
const KEY = 22;
/* Each token's start, worked out once: a key every 22ms, a beat per line. */
const CODE_AT: number[][] = [];
let codeClock = 300;
for (const toks of CODE) {
  CODE_AT.push(
    toks.map(([s]) => {
      const at = codeClock;
      codeClock += s.length * KEY;
      return at;
    }),
  );
  codeClock += 140;
}
const CODE_END = codeClock;
function Code() {
  const lines = CODE.map((toks, i) =>
    toks.map(([s, k], j) => <Typed key={j} text={s} at={CODE_AT[i][j]} step={KEY} cls={`is-${k}`} />),
  );
  const D = CODE_END;
  const path = track("sc-cur-code", D, [[0, 334, 176], [400, 312, 128], [D, 312, 128]]);
  return (
    <>
      <div className="sc-code">
        <div className="sc-code-tab">share.ts</div>
        <div className="sc-code-body">
          {lines.map((l, i) => (
            <div key={i} className="sc-code-line">
              <span className="ln">{i + 1}</span>
              {l}
            </div>
          ))}
        </div>
      </div>
      <Agent path={path} />
    </>
  );
}

/* ---- Notes ---------------------------------------------------------------------
   The agent types /h2, picks Heading 2 from the slash menu, and writes. */
const NOTE_P = "We ship the invite flow on the 14th, once the beta list is in and design has signed off.";
const NOTE_LIST = ["Design review, Tuesday", "Docs and changelog, Wednesday", "Invites go out, Thursday"];
const H2_AT = 1450;
const P_AT = typedEnd("Launch plan", H2_AT, 60) + 200;
const P_STEP = 65;
const NOTE_AT: number[] = [];
let noteClock = typedEnd(NOTE_P, P_AT, P_STEP, "word") + 160;
for (const s of NOTE_LIST) {
  NOTE_AT.push(noteClock);
  noteClock = typedEnd(s, noteClock, 75, "word") + 140;
}
const NOTES_END = noteClock;
function Notes() {
  const list = NOTE_LIST.map((s, i) => ({ s, at: NOTE_AT[i] }));
  const D = NOTES_END;
  const path = track("sc-cur-notes", D, [
    [0, 330, 196], [850, 150, 46], [1250, 150, 46], [1650, 312, 176], [D, 312, 176],
  ]);
  return (
    <>
      <div className="sc-nt-slash" style={{ "--off": t(1350) } as V}>
        <Typed text="/h2" at={300} step={110} hold={800} />
      </div>
      <div className="sc-nt-menu" style={{ "--at": t(700), "--off": t(1350) } as V}>
        <span className="is-hl">
          <i>H2</i>Heading 2
        </span>
        <span>
          <i>H1</i>Heading 1
        </span>
        <span>
          <i>H3</i>Heading 3
        </span>
      </div>
      <h4 className="sc-nt-h2">
        <Typed text="Launch plan" at={H2_AT} step={60} />
      </h4>
      <div className="sc-nt-body">
        <p>
          <Typed text={NOTE_P} at={P_AT} step={P_STEP} by="word" />
        </p>
        <ul>
          {list.map(({ s, at }) => (
            <li key={s} style={{ "--at": t(at) } as V}>
              <Typed text={s} at={at} step={75} by="word" />
            </li>
          ))}
        </ul>
      </div>
      <Agent path={path} />
    </>
  );
}

/* ---- Tables --------------------------------------------------------------------
   The agent fills a table cell by cell, its selection stepping across. */
const TB_COLS = [
  { name: "Task", x: 0, w: 140 },
  { name: "Owner", x: 140, w: 92 },
  { name: "Status", x: 232, w: 108 },
];
const TB_ROWS: { task: string; who: keyof typeof cast; role: string; status: string; tone: string }[] = [
  { task: "Invite flow", who: "peri", role: "PM", status: "Done", tone: "done" },
  { task: "Pricing page", who: "yellow", role: "Design", status: "In review", tone: "review" },
  { task: "Share API", who: "blue", role: "Eng", status: "In progress", tone: "doing" },
  { task: "Launch post", who: "purple", role: "Mktg", status: "To do", tone: "todo" },
];
const TB_TOP = 22;
const TB_HEAD = 28;
const TB_ROW = 36;
const TB_AT = 400;
const TB_STEP = 170;
const TB_D = TB_AT + (TB_ROWS.length * 3 - 1) * TB_STEP + 700;
function Table() {
  const cellAt = (r: number, c: number) => TB_AT + (r * 3 + c) * TB_STEP;
  const stops: Stop[] = [[0, 334, 200]];
  TB_ROWS.forEach((_, r) =>
    TB_COLS.forEach((c, k) => {
      stops.push([cellAt(r, k), c.x + c.w - 18, TB_TOP + TB_HEAD + r * TB_ROW + 24]);
    }),
  );
  const D = TB_D;
  stops.push([D, 326, 196]);
  const path = track("sc-cur-tb", D, stops);
  return (
    <>
      <span className="sc-label">Launch tasks</span>
      <div className="sc-tb" style={{ top: TB_TOP }}>
        <div className="sc-tb-row is-head">
          {TB_COLS.map((c) => (
            <span key={c.name}>{c.name}</span>
          ))}
        </div>
        {TB_ROWS.map((row, r) => (
          <div key={row.task} className="sc-tb-row">
            <span className="sc-cell" style={{ "--at": t(cellAt(r, 0)), "--b": t(cellAt(r, 1)) } as V}>
              <span className="sc-cell-in">{row.task}</span>
            </span>
            <span className="sc-cell" style={{ "--at": t(cellAt(r, 1)), "--b": t(cellAt(r, 2)) } as V}>
              <span className="sc-cell-in sc-tb-who">
                <i style={{ background: cast[row.who].body, color: cast[row.who].ink }}>{row.role[0]}</i>
                {row.role}
              </span>
            </span>
            <span
              className="sc-cell"
              style={{ "--at": t(cellAt(r, 2)), "--b": t(r === TB_ROWS.length - 1 ? D : cellAt(r + 1, 0)) } as V}
            >
              <span className={`sc-cell-in sc-tb-pill is-${row.tone}`}>{row.status}</span>
            </span>
          </div>
        ))}
      </div>
      <Agent path={path} />
    </>
  );
}

/* ---- Math ----------------------------------------------------------------------
   LaTeX typed into a math block, then typeset in place. */
const TEX = String.raw`E[X] = \sum_{i=1}^{n} p_i`;
/* The typeset result, as MathML, which the browser draws natively. */
const TEX_ML =
  '<math display="block"><mi>E</mi><mo stretchy="false">[</mo><mi>X</mi><mo stretchy="false">]</mo><mo>=</mo>' +
  "<munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover>" +
  "<msub><mi>p</mi><mi>i</mi></msub></math>";
const MT_DONE = typedEnd(TEX, 300, 38);
const MT_D = MT_DONE + 700;
function MathBlock() {
  const done = MT_DONE;
  const D = MT_D;
  const path = track("sc-cur-math", D, [[0, 334, 150], [300, 300, 30], [D, 300, 30]]);
  return (
    <>
      <div className="sc-mt-src">
        <span className="sc-mt-tag">LaTeX</span>
        <Typed text={TEX} at={300} step={38} hold={300} />
      </div>
      <div className="sc-mt-out sc-pop" style={{ "--at": t(done + 350) } as V}>
        <span dangerouslySetInnerHTML={{ __html: TEX_ML }} />
      </div>
      <Agent path={path} />
    </>
  );
}

/* ---- Charts (coming soon) ------------------------------------------------------
   Drawn as a placeholder, not a promise: dashed bars that rise once. */
const CH_BARS = 7;
const CH_D = 300 + (CH_BARS - 1) * 90 + 700;
function Charts() {
  const bars = [34, 52, 46, 70, 62, 86, 100];
  return (
    <div className="sc-ch">
      {bars.map((h, i) => (
        <span key={i} style={{ height: h, "--at": t(300 + i * 90) } as V} />
      ))}
    </div>
  );
}

/* ---- Storyboards ---------------------------------------------------------------
   A board of four 16:9 shots, each a drawing and a note, the way the app's
   storyboard block holds them: the agent drags each frame out, puts the
   scene in, and writes the note. The cast plays the launch. */
const SHOTS = [
  { src: "/hero/cast/pm.webp", w: 49, h: 66, note: "The team meets the brief." },
  { src: "/hero/cast/designer.webp", w: 71, h: 58, note: "The flow gets drawn." },
  { src: "/hero/cast/engineer.webp", w: 48, h: 66, note: "The agent builds it." },
  { src: "/hero/cast/marketing.webp", w: 62, h: 60, note: "Invites go out." },
];
const SH_W = 162;
const SH_H = 91;
const SH_GAP = 16;
const SH_TOP = 24;
const SH_ROW = 140;
const SH_EVERY = 900;
const SB_D = 350 + (SHOTS.length - 1) * SH_EVERY + 1300;
function Storyboard() {
  const shotAt = (i: number) => 350 + i * SH_EVERY;
  const pos = (i: number) => ({ x: (i % 2) * (SH_W + SH_GAP), y: SH_TOP + Math.floor(i / 2) * SH_ROW });
  const stops: Stop[] = [[0, 334, 290]];
  SHOTS.forEach((_, i) => {
    const { x, y } = pos(i);
    stops.push([shotAt(i) - 60, x, y], [shotAt(i) + 380, x + SH_W, y + SH_H], [shotAt(i) + 600, x + SH_W, y + SH_H]);
  });
  const D = SB_D;
  stops.push([D, 326, 286]);
  const path = track("sc-cur-sb", D, stops);
  return (
    <>
      <span className="sc-label">Launch film · 16:9</span>
      {SHOTS.map((s, i) => {
        const { x, y } = pos(i);
        const at = shotAt(i);
        return (
          <div key={s.note} className="sc-shot" style={{ left: x, top: y, width: SH_W } as V}>
            <div className="sc-shot-frame" style={{ height: SH_H, "--at": t(at) } as V}>
              <span className="sc-shot-n">{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="sc-pop"
                src={s.src}
                width={s.w}
                height={s.h}
                alt=""
                style={{ "--at": t(at + 420), left: (SH_W - s.w) / 2, width: s.w, height: s.h } as V}
              />
            </div>
            <p className="sc-shot-note">
              <Typed text={s.note} at={at + 560} step={70} by="word" />
            </p>
          </div>
        );
      })}
      <Agent path={path} />
    </>
  );
}

export function Showcase() {
  const tiles = {
    diagram: (
      <Tile kind="diagram" total={DG_D} title="Diagrams" hint="/diagram" h={290} line="Flows, maps and systems, drawn box by box and wired up.">
        <Diagram />
      </Tile>
    ),
    math: (
      <Tile kind="math" total={MT_D} title="Math" hint="/math" h={128} d0={250} line="Write LaTeX and see it typeset in place.">
        <MathBlock />
      </Tile>
    ),
    charts: (
      <Tile kind="charts" total={CH_D} title="Charts" soon h={120} line="Turn any table on the board into a chart.">
        <Charts />
      </Tile>
    ),
    design: (
      <Tile kind="design" total={DZ_D} title="Design" hint="/diagram" h={340} d0={200} line="Frames, layers and components, laid out the way a design tool does it.">
        <Design />
      </Tile>
    ),
    storyboard: (
      <Tile kind="storyboard" total={SB_D} title="Storyboards" hint="/storyboard" h={282} d0={150} line="Board a flow shot by shot, a drawing and a note each, before anyone builds it.">
        <Storyboard />
      </Tile>
    ),
    notes: (
      <Tile kind="notes" total={NOTES_END} title="Notes" hint="/h2" h={180} d0={400} line="Headings, lists and prose. Type a slash and keep writing.">
        <Notes />
      </Tile>
    ),
    code: (
      <Tile kind="code" total={CODE_END} title="Code" hint="/code" h={160} d0={150} line="Real code with real syntax, written right next to the plan.">
        <Code />
      </Tile>
    ),
    table: (
      <Tile kind="table" total={TB_D} title="Tables" hint="/table" h={190} d0={300} line="Tables that fill in as the work moves.">
        <Table />
      </Tile>
    ),
  };
  return (
    <section className="sc" aria-labelledby="sc-h">
      <h2 className="sc-h" id="sc-h">
        Everything you can do, <br />
        our agent can too.
      </h2>
      <AppProject />
      <div className="sc-grid">
        <div className="sc-stack">
          {tiles.diagram}
          {tiles.math}
          {tiles.charts}
        </div>
        <div className="sc-stack">
          {tiles.design}
          {tiles.storyboard}
        </div>
        <div className="sc-stack">
          {tiles.notes}
          {tiles.code}
          {tiles.table}
        </div>
      </div>
    </section>
  );
}
