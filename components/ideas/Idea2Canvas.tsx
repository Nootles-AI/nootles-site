/* IDEA 2 — The hero is a board.
   THESIS: the first viewport is already the product: a dotted canvas where the
   headline is being written as you arrive — Marketing types the first
   sentence, the AI offers the second as ghost text, Tab accepts it — and then
   the rest of the team starts working around it, each object made by the
   person who needs it: notes, code, a diagram and a phone screen. Refuses the
   screenshot-in-a-browser-frame hero.
   OWN-WORLD: white canvas, grey dot field; objects sit on the canvas rather
   than in cards — text on the dots, shapes on the dots, one dark editor, one
   hairline frame. Canvas chrome is the only furniture: edit boxes, selection
   frames, size readouts, carets, click ripples, a zoom readout. Colour comes
   only from the cast — each role's cursor, caret and selection in its
   character's body colour.
   STORY: you watch the line get written with AI help, then a whole team
   builds on the page around it, and the CTA opens one.
   FIRST VIEWPORT: app-style top bar with presence; headline, subtitle and
   CTA alone at the top; below them one scene — the cast on the floor, and
   over each character the object they're making (diagram, notes, phone,
   code, a comment); zoom pill bottom right.
   FORM: grounded #1 — chosen by the user from the five-idea round. */
import type { CSSProperties } from "react";
import { Arrow, CAST, Cursor, cast, copy, people } from "@/components/ideas/shared";
import { SiteFooter, SiteNav } from "@/components/ideas/SiteChrome";
import { site } from "@/lib/site";
import { LoopingGraph } from "@/components/ideas/steps/LoopingGraph";
import { PlayInView } from "@/components/ideas/steps/PlayInView";
import { STEP1, StepBox } from "@/components/ideas/steps/Step1";
import { STEP2, TeamDoc } from "@/components/ideas/steps/Step2";
import { BuildMcp, STEP3 } from "@/components/ideas/steps/Step3";
import { Showcase } from "@/components/ideas/showcase/Showcase";

type Role = keyof typeof people;
type Tone = { body: string; ink: string };

const toneOf = (role: Role): Tone => {
  const hue = people[role].hue;
  return hue === "ink" ? { body: "#16181a", ink: "#ffffff" } : cast[hue];
};


/* ---- One timeline, in ms from load ------------------------------------------
   The opening belongs to the headline alone: nothing else is on the board
   while Marketing types and the AI's suggestion is taken with Tab. Quick,
   because a suggestion you wait for isn't a suggestion. Once the line is ink,
   the PM types the subtitle under it, and the rest of the team starts
   making things around it — every object arrives because someone made it. */
const TITLE_START = 250;
const TITLE_STEP = 24;
const TITLE_TYPED = TITLE_START + copy.titleA.length * TITLE_STEP;
const GHOST_WORDS = copy.titleB.split(" ");
const GHOST_AT = TITLE_TYPED + 160;
const WORD_MS = 60;
const STREAMED = GHOST_AT + GHOST_WORDS.length * WORD_MS;
const KEY_AT = STREAMED + 80;
const PRESS_AT = KEY_AT + 320;
const INK_AT = PRESS_AT + 70;
const ENTER = INK_AT + 150;
const SUB_STEP = 12;

/* Once the second line is in, its verb belongs to whoever is working: the PM
   holds "Planning", then the designer selects it and types "Designing", then
   the engineer "Building", round and round — each in their own colour, with their
   caret and name on it, the way a teammate's selection shows on a shared
   page. One segment per verb; the loop never ends. */
const VERBS = [
  { word: "Planning", role: "pm" },
  { word: "Designing", role: "design" },
  { word: "Building", role: "eng" },
] as const;
const VERB_SEG = 2800;
const VERB_AT = ENTER + 700;
const SUB_DONE = ENTER + copy.sub.length * SUB_STEP;

/* Below the headline everyone works at once, each at their own pace. TEMPO
   scales every move on the board — clicks, drags, placements, typing — so
   the whole scene can be made quicker or slower from one number; the CSS
   reads it as --tempo. Marketing draws the CTA, which frees the designer to
   go straight to the phone; the PM starts the flow once the subtitle's in. */
const TEMPO = 1;
const T = (n: number) => n * TEMPO;
const CHART_AT = ENTER;
const CTA_AT = ENTER + 100;
const PHONE_AT = ENTER + 150;
const CODE_AT = ENTER + 250;
const COMMENT_AT = ENTER + 400;
const FLOW_AT = SUB_DONE + 100;
const NOTES_AT = CTA_AT + T(1300);
const AI_TYPE = CODE_AT + T(1350);
const NOTES_TYPE = NOTES_AT + T(1100);
const COMMENT_TYPE = COMMENT_AT + T(1050);

const CAST_SCALE = 0.46;

function Person({ role }: { role: (typeof CAST)[number]["role"] }) {
  const c = CAST.find((p) => p.role === role)!;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`i2-person is-${role}`}
      src={c.src}
      width={Math.round(c.w * CAST_SCALE)}
      height={Math.round(c.h * CAST_SCALE)}
      alt=""
    />
  );
}

const ms = (n: number) => `${Math.round(n)}ms`;

/** A caret with its owner's flag, riding the leading edge of text as it is
    typed, a character at a time. */
function Typed({
  text,
  role,
  start,
  step = 48,
  tone,
  className,
}: {
  text: string;
  role: Role;
  start: number;
  step?: number;
  tone?: Tone;
  className?: string;
}) {
  const c = tone ?? toneOf(role);
  return (
    <span
      className={`i2-typed ${className ?? ""}`}
      style={
        {
          "--n": text.length,
          "--s": ms(start),
          "--t": ms(text.length * step),
          "--c": c.body,
          "--ct": c.ink,
        } as CSSProperties
      }
    >
      <span className="i2-typed-txt">{text}</span>
      <span className="i2-caret" aria-hidden="true">
        <b>{people[role].name}</b>
      </span>
    </span>
  );
}

/** The ring a click leaves on the canvas, in the clicker's colour. */
function Click({ role, x, y, at }: { role: Role; x: number; y: number; at: string }) {
  return (
    <span
      className="i2-click"
      style={{ left: x, top: y, "--c": toneOf(role).body, "--at": at } as CSSProperties}
    />
  );
}

function Check({ done }: { done?: boolean }) {
  return (
    <svg className="i2-check" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="3" fill={done ? "#16181a" : "#fff"} stroke={done ? "#16181a" : "#b9bfc6"} strokeWidth="1.5" />
      {done ? <path d="m3.6 7.2 2.2 2.2 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
}

function Handles() {
  return (
    <>
      <i />
      <i />
      <i />
      <i />
    </>
  );
}

/** The second line's verb: one slot as wide as its widest word, where each
    owner's turn shows as their selection, caret and name while their word is
    typed in over the last. */
function Verb() {
  return (
    <span className="i2-verb">
      <span className="i2-verb-hl" />
      <span className="i2-verb-w is-first">{VERBS[0].word}</span>
      {VERBS.map((v, k) => (
        <span
          key={v.word}
          className="i2-verb-w is-cycle"
          style={{ "--d": ms(VERB_AT + (k === 0 ? VERBS.length : k) * VERB_SEG) } as CSSProperties}
        >
          {v.word}
        </span>
      ))}
      {VERBS.map((v, k) => {
        const c = toneOf(v.role);
        return (
          <span
            key={v.role}
            className="i2-verb-own"
            style={{ "--d": ms(VERB_AT + k * VERB_SEG), "--c": c.body, "--ct": c.ink } as CSSProperties}
          >
            <b>{people[v.role].name}</b>
          </span>
        );
      })}
    </span>
  );
}

export function Idea2Canvas() {
  const mkt = toneOf("marketing");
  const timeline = {
    "--title-s": ms(TITLE_START),
    "--title-t": ms(copy.titleA.length * TITLE_STEP),
    "--title-n": copy.titleA.length,
    "--streamed": ms(STREAMED),
    "--key": ms(KEY_AT),
    "--press": ms(PRESS_AT),
    "--ink": ms(INK_AT),
    "--enter": ms(ENTER),
    "--verb-at": ms(VERB_AT),
    "--verb-seg": ms(VERB_SEG),
    "--verb-cyc": ms(VERB_SEG * VERBS.length),
    "--tempo": TEMPO,
    "--sub-done": ms(SUB_DONE),
    "--cta": ms(CTA_AT),
    "--an": ms(CHART_AT),
    "--dg": ms(FLOW_AT),
    "--ph": ms(PHONE_AT),
    "--c0": ms(CODE_AT),
    "--n0": ms(NOTES_AT),
    "--cm": ms(COMMENT_AT),
  } as CSSProperties;

  return (
    <div className="ic-root i2" style={timeline}>
      {/* The bar stays with you down the page; the hero's canvas runs up
          behind it, so at the top it still sits on the dot grid. */}
      <SiteNav />

      {/* The hero: the only place the dot grid is drawn. */}
      <div className="i2-hero">

      <section className="i2-board">
        {/* The headline, written in front of you. Marketing types the first
            sentence; the AI offers the second as ghost text; Tab takes it. */}
        <div className="i2-text" style={{ "--c": mkt.body, "--ct": mkt.ink } as CSSProperties}>
          <span className="i2-edit" aria-hidden="true">
            <span className="i2-size">Text · H1</span>
          </span>
          <h1 className="i2-title">
            <span className="sr-only">
              {copy.titleA} Start Planning, Designing and Building Together.
            </span>
            <span className="i2-t1" aria-hidden="true">
              <span className="i2-t1-txt">{copy.titleA}</span>
              <span className="i2-tcaret i2-tcaret-1">
                <b>{people.marketing.name}</b>
              </span>
            </span>
            <span className="i2-t2" aria-hidden="true">
              {GHOST_WORDS.map((w, i) => (
                <span
                  key={w}
                  className={`i2-w${i === GHOST_WORDS.length - 1 ? " is-head" : ""}`}
                  style={
                    {
                      "--ws": ms(GHOST_AT + i * WORD_MS),
                      "--we": ms(GHOST_AT + (i + 1) * WORD_MS),
                    } as CSSProperties
                  }
                >
                  {i > 0 ? " " : null}
                  {w === VERBS[0].word ? <Verb /> : w}
                </span>
              ))}
              <span className="i2-tcaret i2-tcaret-2">
                <b>{people.marketing.name}</b>
              </span>
              <kbd className="i2-key">Tab</kbd>
            </span>
          </h1>
        </div>

        {/* The PM takes the line under it, then goes off to draw the flow. */}
        <p className="i2-sub">
          <Typed text={copy.sub} role="pm" start={ENTER} step={SUB_STEP} />
        </p>
        {/* The CTA, drawn by marketing like the button on the phone. It is
            a working link the whole time; only its paint is being drawn. */}
        <div className="i2-go-wrap">
          <a className="i2-go" href={site.appUrl}>
            Get Nootles Free
            <Arrow />
          </a>
          <span className="i2-go-sel" aria-hidden="true">
            <Handles />
          </span>
          <span className="i2-go-dim i2-live" aria-hidden="true" />
          <Cursor who="marketing" className="i2-c-cta" />
        </div>

        {/* Under the headline, the cast — on the page from the start, spread
            out one to a column — and over each of them their one piece of
            work, made in front of you: the analyst's chart, the PM's flow, the
            designer's screen, the engineer's code, marketing's notes,
            support's comment. One 1440px scene, sized as a whole. */}
        <div className="i2-scene" aria-hidden="true">
          <div className="i2-col6 is-analyst">
            {/* Chart — the analyst drops one in, then drags this week's bar
                up to where it actually landed. */}
            <div className="i2-o i2-chart">
              <div className="i2-ch-name">Invites accepted</div>
              <div className="i2-ch-plot">
                {[34, 48, 44, 62].map((h, k) => (
                  <span key={k} className="i2-ch-bar" style={{ height: h, "--k": k } as CSSProperties} />
                ))}
                <span className="i2-ch-bar is-live" style={{ "--k": 4 } as CSSProperties}>
                  <span className="i2-ch-sel">
                    <Handles />
                  </span>
                </span>
              </div>
              <div className="i2-ch-axis">
                {["W1", "W2", "W3", "W4", "W5"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <Click role="analyst" x={0} y={22} at="calc(var(--an) + 600ms)" />
              <Cursor who="analyst" className="i2-c-analyst" />
            </div>
            <Person role="analyst" />
          </div>
          <div className="i2-col6 is-pm">
            {/* Flow — the PM draws it from nothing. */}
            <div className="i2-o i2-diagram">
              <div className="i2-dg-name">Onboarding flow</div>
              <div className="i2-dg">
                <svg className="i2-dg-lines" width="228" height="134" viewBox="0 0 228 134">
                  <path className="i2-wire i2-wire-1" d="M110 22H137" pathLength={100} />
                  <path className="i2-head i2-head-1" d="m132 17.5 6 4.5-6 4.5" />
                  <path className="i2-wire i2-wire-2" d="M55 38V101" pathLength={100} />
                  <path className="i2-head i2-head-2" d="m50.5 96 4.5 6 4.5-6" />
                  <path className="i2-wire i2-wire-3" d="M183 38V101" pathLength={100} />
                  <path className="i2-head i2-head-3" d="m178.5 96 4.5 6 4.5-6" />
                </svg>
                <span className="i2-node n-a" style={{ "--fill": "#eef3fe", "--line": "#9fb6ea" } as CSSProperties}>Sign up</span>
                <span className="i2-node n-b" style={{ "--fill": "#fff5dc", "--line": "#e6bd5c" } as CSSProperties}>Invite team</span>
                <span className="i2-node n-c" style={{ "--fill": "#f6f0fd", "--line": "#b896e6" } as CSSProperties}>Pick a template</span>
                <span className="i2-node n-d" style={{ "--fill": "#e8f7ef", "--line": "#7cc9a0" } as CSSProperties}>
                  First canvas
                  <span className="i2-node-sel">
                    <Handles />
                  </span>
                </span>
                <Cursor who="pm" className="i2-c-flow" />
              </div>
            </div>
            <Person role="pm" />
          </div>
          <div className="i2-col6 is-design">
            {/* Phone — the designer draws the frame, corner to corner, then
                builds it layer by layer. Its list points back at the board. */}
            <div className="i2-o i2-frame-wrap">
              <div className="i2-frame-name">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M3 0.5v9M7 0.5v9M0.5 3h9M0.5 7h9" />
                </svg>
                Mobile / Invite
              </div>
              <div className="i2-screen">
                <div className="i2-sc-status">
                  <span>9:41</span>
                  <svg width="24" height="9" viewBox="0 0 24 9" fill="currentColor">
                    <rect x="0" y="5" width="2.2" height="4" rx="0.6" />
                    <rect x="3.4" y="3.5" width="2.2" height="5.5" rx="0.6" />
                    <rect x="6.8" y="1.5" width="2.2" height="7.5" rx="0.6" />
                    <rect x="12" y="1" width="11" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <rect x="13.5" y="2.5" width="7" height="4" rx="1" />
                  </svg>
                </div>
                <div className="i2-sc-top i2-layer" style={{ "--a": ms(T(1600)), "--b": ms(T(1900)) } as CSSProperties}>
                  <b>Launch board</b>
                  <span className="i2-sc-faces">
                    {[cast.peri, cast.yellow, cast.purple].map((c, k) => (
                      <i key={k} style={{ background: c.body }} />
                    ))}
                  </span>
                </div>
                <div className="i2-sc-card i2-layer" style={{ "--a": ms(T(1900)), "--b": ms(T(2150)) } as CSSProperties}>
                  <b>You&rsquo;re invited</b>
                  <span>Your team is already here.</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="i2-layer" style={{ "--a": ms(T(2150)), "--b": ms(T(2500)) } as CSSProperties} src="/hero/char-builder.webp" width={232} height={320} alt="" />
                </div>
                <div className="i2-sc-btn">
                  <span className="i2-sc-btn-fill">
                    <span className="i2-sc-btn-label">Join</span>
                  </span>
                  <span className="i2-ph-btn-sel">
                    <Handles />
                  </span>
                  <span className="i2-ph-dim i2-live" />
                </div>
                <span className="i2-ph-home" />
              </div>
              <span className="i2-frame-sel">
                <Handles />
              </span>
              <span className="i2-frame-dim i2-live" />
              <Cursor who="design" className="i2-c-design" />
            </div>
            <Person role="design" />
          </div>
          <div className="i2-col6 is-eng">
            {/* Code — the engineer clicks, the editor opens from the click, the
                AI writes the missing line. */}
            <div className="i2-o i2-code">
              <div className="i2-code-body">
                <div className="i2-code-tab">
                  invite.ts
                </div>
                <pre>
                  <code>
                    <span className="ln">1</span><span className="k">async function</span> <span className="f">invite</span>(ws) {"{"}
                    {"\n"}
                    <span className="ln">2</span>{"  "}<span className="k">for</span> (<span className="k">const</span> e <span className="k">of</span> ws.pending)
                    {"\n"}
                    <span className="ln">3</span>{"    "}<Typed text="await ws.invite(e);" role="ai" start={AI_TYPE} step={T(42)} tone={{ body: "#ffffff", ink: "#16181a" }} className="i2-typed-code" />
                    {"\n"}
                    <span className="ln">4</span>{"}"}
                  </code>
                </pre>
              </div>
              <Click role="eng" x={0} y={0} at="calc(var(--c0) + 600ms)" />
              <Cursor who="eng" className="i2-c-eng" />
            </div>
            <Person role="eng" />
          </div>
          <div className="i2-col6 is-marketing">
            {/* Notes — marketing clicks the canvas and writes. */}
            <div className="i2-o i2-notes">
              <b className="i2-notes-h">Launch notes</b>
              <ul>
                <li className="is-done" style={{ "--k": 0 } as CSSProperties}>
                  <Check done />
                  <span>Write the headline</span>
                </li>
                <li style={{ "--k": 1 } as CSSProperties}>
                  <Check />
                  <span>Pick a launch day</span>
                </li>
                <li style={{ "--k": 2 } as CSSProperties}>
                  <Check />
                  <Typed text="Post the demo" role="marketing" start={NOTES_TYPE} step={T(45)} />
                </li>
              </ul>
              <Click role="marketing" x={0} y={4} at="calc(var(--n0) + 600ms)" />
              <Cursor who="marketing" className="i2-c-mkt" />
            </div>
            <Person role="marketing" />
          </div>
          <div className="i2-col6 is-support">
            {/* Comment — support drops a pin and says what customers say. */}
            <div className="i2-o i2-comment">
              <span className="i2-cm-pin">S</span>
              <div className="i2-cm-body">
                <div className="i2-cm-head">
                  <b>Support</b>
                  <span>just now</span>
                </div>
                <p>
                  <Typed text="Customers ask for this." role="support" start={COMMENT_TYPE} step={T(26)} />
                </p>
              </div>
              <Click role="support" x={12} y={12} at="calc(var(--cm) + 600ms)" />
              <Cursor who="support" className="i2-c-support" />
            </div>
            <Person role="support" />
          </div>
        </div>
        <p className="sr-only">
          Six Nootles characters — an analyst, a PM, a designer, an engineer, someone from marketing and
          someone from support — each working on one part of the same canvas.
        </p>

        <div className="i2-zoom" aria-hidden="true">
          <span>−</span>
          <b>80%</b>
          <span>+</span>
        </div>
      </section>
      </div>

      {/* Section 2 — how it works, in three steps. The hero's canvas ends in a
          ground line at the cast's feet, and this section is the floor they
          stand on: a plain surface, no dot grid. */}
      <section className="i2-ground" aria-labelledby="i2-steps-h">
        <div className="i2-steps st">
        <h2 className="sr-only" id="i2-steps-h">
          How it works
        </h2>
        <div className="st-row">
          <StepBox n={1} title={STEP1.title} line={STEP1.line}>
            <PlayInView height={240}><LoopingGraph /></PlayInView>
          </StepBox>
          <StepBox n={2} title={STEP2.title} line={STEP2.line}>
            <PlayInView height={276}><TeamDoc /></PlayInView>
          </StepBox>
          <StepBox n={3} title={STEP3.title} line={STEP3.line}>
            <PlayInView height={240}><BuildMcp /></PlayInView>
          </StepBox>
        </div>
        </div>
      </section>

      <Showcase />
      <SiteFooter />
    </div>
  );
}
