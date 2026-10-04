/* Section 3's lead — "the project". A project open in the Nootles app, drawn
   as the app draws it: the pages rail, the sheet, the chat rail, the bar at
   the foot of the page, all at the app's own pixel size and in its own tokens
   (app-project.css), then scaled to fit. Nothing here is invented chrome; the
   source for each part is the app's own component of the same name.

   On the sheet, the one thing that moves is the diagram Tab autocomplete,
   as the editor plays it: the writer finishes a sentence, pauses, and the
   model offers a prose tail and a diagram below it — here, the mobile
   screens the sentence describes — which Tab takes as it stands. Then, in
   the same take, the writer turns to the chat and asks for the screens in
   dark mode, and the agent restyles them on the page while the chat says
   what it is doing; the change waits under its wash for an answer, and Keep
   takes it. Then the writer's hand proves the screens are still shapes: it
   picks up a button and moves it down its screen. A pointer plays the hand —
   the clicks are its, the typing and Tab are the keyboard's. Every visual is
   decorative (aria-hidden); the caption carries
   the meaning. Content is synthetic and continues the hero's story: the team
   launching the invite flow.

   Time is written in milliseconds from the start of a loop, as custom
   properties on the loop (`--t-*`) and on each piece that lands on a beat. */
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/ideas/steps/Step1";
import type { SourceKey } from "@/content/sources";
import { AppLoop, AppScale } from "./AppScale";
import { SHEET, WIDE } from "./appWindow";

type V = CSSProperties & Record<`--${string}`, string | number>;
const ms = (n: number) => `${Math.round(n)}ms`;

/* ---- The loop ------------------------------------------------------------------
   The beats of one take. The paragraph's first words are already written;
   the rest is typed a key every 45ms, then the editor waits out its debounce,
   and the model draws straight away (the planning beat is cut for pace) and
   waits for an answer. */
const PRE = "Guests open the link,";
const TYPED = "sign in, and land on the board.";
const TAIL = " The screens";
const KEY = 45;
const T_TYPE = 450;
const TYPED_CHARS = [...TYPED];
const T_LAST = T_TYPE + (TYPED_CHARS.length - 1) * KEY;
const T_DRAW = T_LAST + 525;
/* The suggestion appears with its first shape: the tail, the head, the status
   word, the grid and the band all start on the same beat. */
const T_THINK = T_DRAW;
const T_FIRST = T_DRAW;
const GROW = 420;
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

/* ---- The diagram ---------------------------------------------------------------
   Three mobile screens — the invite, sign-in, and the board it lands on —
   drawn the way the canvas draws them: plain shapes and text in the AI's
   default greys, with the onboarding slate and sage for fills, never amber.
   Each screen is a frame, then its contents one element at a time; the two
   connectors that walk from screen to screen come last. Coordinates are the
   720px band's; screens are 140 × 280 with 24px above and below. */
type El = {
  k: "frame" | "box" | "text" | "btn" | "input" | "dot" | "island" | "rule";
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  tone?: "slate" | "sage" | "grey" | "white";
  size?: number;
  bold?: boolean;
  muted?: boolean;
  /** The one shape the hand picks up and moves, after Keep. */
  moves?: boolean;
  /** What the layers list calls a shape the model named. */
  name?: string;
};
const PHONE_W = 140;
const PHONE_H = 280;
const PHONE_Y = 24;
const PHONE_X = [75, 290, 505];
const chrome = (x: number, name: string): El[] => [
  { k: "frame", x, y: PHONE_Y, w: PHONE_W, h: PHONE_H, name },
  { k: "text", x: x + 14, y: PHONE_Y + 9, label: "9:41", size: 9, bold: true },
  { k: "island", x: x + 52, y: PHONE_Y + 9, w: 36, h: 10 },
];
const at = (x: number, els: El[]): El[] => els.map((e) => ({ ...e, x: x + e.x, y: PHONE_Y + e.y }));
const SCREENS: El[][] = [
  [
    ...chrome(PHONE_X[0], "Invite"),
    ...at(PHONE_X[0], [
      { k: "dot", x: 14, y: 38, w: 22, h: 22, tone: "slate" },
      { k: "dot", x: 30, y: 38, w: 22, h: 22, tone: "sage" },
      { k: "dot", x: 46, y: 38, w: 22, h: 22, tone: "grey" },
      { k: "text", x: 14, y: 72, label: "You’re invited", size: 15, bold: true },
      { k: "text", x: 14, y: 94, w: 112, label: "Join Invite launch on Nootles.", size: 10, muted: true },
      { k: "box", x: 14, y: 124, w: 112, h: 84, tone: "slate" },
      { k: "box", x: 24, y: 134, w: 42, h: 36, tone: "sage" },
      { k: "box", x: 72, y: 134, w: 44, h: 36, tone: "white" },
      { k: "text", x: 24, y: 182, label: "Invite launch", size: 9.5, bold: true },
      { k: "btn", x: 14, y: 226, w: 112, h: 32, label: "Join board" },
    ]),
  ],
  [
    ...chrome(PHONE_X[1], "Sign in"),
    ...at(PHONE_X[1], [
      { k: "text", x: 14, y: 40, label: "Sign in", size: 15, bold: true },
      { k: "text", x: 14, y: 62, w: 112, label: "Use your work email.", size: 10, muted: true },
      { k: "input", x: 14, y: 88, w: 112, h: 30, label: "you@team.com" },
      { k: "input", x: 14, y: 126, w: 112, h: 30, label: "••••••••" },
      { k: "btn", x: 14, y: 172, w: 112, h: 32, label: "Continue", moves: true },
      { k: "text", x: 14, y: 216, w: 112, label: "Use Google instead", size: 10, muted: true },
    ]),
  ],
  [
    ...chrome(PHONE_X[2], "Board"),
    ...at(PHONE_X[2], [
      { k: "text", x: 14, y: 40, label: "Invite launch", size: 13, bold: true },
      { k: "box", x: 14, y: 66, w: 53, h: 53, tone: "sage" },
      { k: "box", x: 73, y: 66, w: 53, h: 53, tone: "slate" },
      { k: "box", x: 14, y: 125, w: 53, h: 53, tone: "slate" },
      { k: "box", x: 73, y: 125, w: 53, h: 53, tone: "grey" },
      { k: "box", x: 14, y: 190, w: 112, h: 28, tone: "sage", label: "You joined the board", size: 9.5 },
      { k: "rule", x: 0, y: 240, w: PHONE_W, h: 1 },
      { k: "dot", x: 30, y: 254, w: 12, h: 12, tone: "grey" },
      { k: "dot", x: 64, y: 254, w: 12, h: 12, tone: "grey" },
      { k: "dot", x: 98, y: 254, w: 12, h: 12, tone: "grey" },
    ]),
  ],
];
const MID = PHONE_Y + PHONE_H / 2;
const EDGES: { d: string; say?: { text: string; x: number; y: number } }[] = [
  { d: `M${PHONE_X[0] + PHONE_W} ${MID}H${PHONE_X[1]}`, say: { text: "Join", x: (PHONE_X[0] + PHONE_W + PHONE_X[1]) / 2, y: MID } },
  { d: `M${PHONE_X[1] + PHONE_W} ${MID}H${PHONE_X[2]}`, say: { text: "Continue", x: (PHONE_X[1] + PHONE_W + PHONE_X[2]) / 2, y: MID } },
];
/* The order things land in: a screen's frame, a short beat, then each of its
   elements; then the connectors. */
const FRAME_BEAT = 260;
const EVERY = 110;
const ARRIVALS: number[] = [];
const SCREEN_OF: number[] = [];
let clock = T_FIRST;
SCREENS.forEach((screen, s) => {
  screen.forEach((e, i) => {
    ARRIVALS.push(clock);
    SCREEN_OF.push(s);
    clock += i === 0 ? FRAME_BEAT : EVERY;
  });
  clock += 120;
});
const EDGE_AT = EDGES.map((_, i) => clock + i * 230);
const T_WAIT = EDGE_AT[EDGE_AT.length - 1] + 520 + 260;
const T_ACCEPT = T_WAIT + 1400;
const SCENE_H = PHONE_Y + PHONE_H + 24;
/* The one honest cue that Tab was pressed: its key darkens for a frame or
   seven before the suggestion is taken. */
const T_PRESS = T_ACCEPT - 120;

/* ---- The ask -------------------------------------------------------------------
   The take goes on past the accept. The writer turns to the chat: the
   composer takes the caret and the ask is typed a key every 40ms, Send inks
   with the first key and goes down, and the box clears a beat later. The
   agent thinks, reads the diagram's styles, then restyles the screens — one
   call a screen, each landing dark on the page as it returns. When it is done
   the change waits for an answer, under its wash on the page and in the bar
   above the composer, and Keep takes it. The dark screens stay; everything
   else goes back to the empty chat while the band folds away. */
const ASK = "Turn the mockups into dark mode";
const ASK_CHARS = [...ASK];
const ANSWER =
  "Done. All three screens are dark now: near-black frames, light text, and the buttons inverted so they still lead.";
const QKEY = 40;
const T_ASK = T_ACCEPT + 1200;
const T_QTYPE = T_ASK + 400;
const T_QLAST = T_QTYPE + (ASK_CHARS.length - 1) * QKEY;
const T_SEND = T_QLAST + 450;
const T_CLEAR = T_SEND + 180;
const T_PENDING = T_CLEAR + 100;
const T_STEP1 = T_PENDING + 900;
const T_STEP1_DONE = T_STEP1 + 800;
/* The next model step follows at once: any longer and the app would show its
   Thinking line again between the two (nothing running, session busy). */
const T_STEP2 = T_STEP1_DONE + 40;
/* Each screen goes dark as its restyle returns, 350ms apart; the bar above
   the composer arrives with the first. */
const T_DARK = SCREENS.map((_, i) => T_STEP2 + 300 + i * 350);
const T_DONE = T_DARK[T_DARK.length - 1] + 400;
const T_KEEP_DOWN = T_DONE + 1600;
/* Released, the click lands: the bar reads "Keeping…", both buttons busy,
   until the settle returns and it goes. */
const T_KEEPING = T_KEEP_DOWN + 90;
const T_KEEP = T_KEEP_DOWN + 340;

/* ---- The hand ------------------------------------------------------------------
   The pointer, in the window's own px (1440 × 900, or the 880 sheet-only
   view). It goes where the take needs a click — the composer, Send, Keep —
   in eased legs, never a jump, and the clicks land on the beats above: the
   composer takes the caret because it is clicked. Then, with the change kept,
   it picks up the second screen's Continue button and drags it to the foot of
   the phone, past "Use Google instead", with the canvas's own selection on
   it; a beat, a click on empty canvas, and it rests where the take began.

   Every target is worked out from the layout's own numbers: the rails' widths
   (handed to the stylesheet as --side and --chat, so there is one copy), the
   sheet's insets and the column, and the shapes' scene coordinates. Only the
   band's top is read off the page, since it sits under everything above it. */
type Pt = readonly [number, number];
const SIDE_W = 256;
const CHAT_W = 320;
const WIN_H = 900;
/* The column: an 832px measure at most, 56px gutters, centred in the sheet.
   Wide, the sheet is the well between the rails (a 1px handle each side);
   sheet only, it is the window less the well's 8px and the sheet's 40px. */
const COL_MAX = 832;
const GUTTER = 56;
const textOf = (left: number, room: number) => {
  const col = Math.min(COL_MAX, room);
  return { left: left + (room - col) / 2 + GUTTER, w: col - 2 * GUTTER };
};
const TEXT_W = textOf(SIDE_W + 1, WIDE - SIDE_W - CHAT_W - 2);
const TEXT_N = textOf(8 + 40, SHEET - 16 - 80);
/* The scene is the 720px band's, centred on the column. Its top is where the
   band opens under the paragraph. */
const SCENE_TOP = 438.5;
const sceneX = (t: { left: number; w: number }) => t.left + (t.w - 720) / 2;
const onW = ([x, y]: Pt): Pt => [sceneX(TEXT_W) + x, SCENE_TOP + y];
const onN = ([x, y]: Pt): Pt => [sceneX(TEXT_N) + x, SCENE_TOP + y];

/* The chat rail's targets. The composer sits 8px in from the rail and the
   window's foot and is 66px tall; Send and Keep end at its right inset (8 +
   1 + 5), the review bar 6px above it. */
const CHAT_X = WIDE - CHAT_W;
const COMPOSER_TOP = WIN_H - 8 - 66;
const RIGHT = WIDE - 8 - 1 - 5;
const COMPOSER: Pt = [CHAT_X + 210, COMPOSER_TOP + 1 + 9 + 10];
const SEND: Pt = [RIGHT - 47 / 2, WIN_H - 8 - 1 - 5 - 13];
const KEEP: Pt = [RIGHT - 48 / 2, COMPOSER_TOP - 6 - 1 - 5 - 13];
/* Out of the ask's way while it is typed, and then watching the transcript
   below the answer. */
const ASIDE: Pt = [SEND[0] - 30, COMPOSER_TOP - 20];
const WATCH: Pt = [CHAT_X + 180, 330];
/* Sheet only, the gutter's ✓: the band's right edge, 10px out, the pair's 2px
   padding, the ✗ and the gap before it; a row 3px above the band. */
const TICK: Pt = [TEXT_N.left + TEXT_N.w + 10 + 2 + 24 + 2 + 12, SCENE_TOP - 3 - 1 + 2 + 12];
/* Where the hand rests, in the sheet's margin beside the paragraph: right of
   the column, and above the gutter's pair. The take starts and ends with it
   here, and the click that lets the button go lands here — off the diagram,
   so the diagram is left and the rails turn back. */
const PARK_W: Pt = [TEXT_W.left + TEXT_W.w + 24, SCENE_TOP - 40];
const PARK_N: Pt = [TEXT_N.left + TEXT_N.w + 24, SCENE_TOP - 40];

/* In the scene: where the hand takes hold of the button — right of its label
   — and where it lets go. Getting there and back, it keeps to empty canvas:
   past the third screen's corner and along under the screens to just short
   of the third, so it crosses no shape but the screen it is working in. */
const MOVED = SCREENS.flat().find((e) => e.moves)!;
const DY = 64;
const GRIP: Pt = [MOVED.x + 88, MOVED.y + 9];
const DROPPED: Pt = [GRIP[0], GRIP[1] + DY];
const UNDER = PHONE_Y + PHONE_H + 14;
const BELOW: Pt = [PHONE_X[2] - 20, UNDER];
const CORNER: Pt = [PHONE_X[2] + PHONE_W + 30, UNDER];

/* A leg takes 350–700ms by its length, on an ease that starts and lands
   softly, as a hand does. */
const HAND = "cubic-bezier(0.45, 0, 0.25, 1)";
const legFor = (a: Pt, b: Pt) => Math.min(700, Math.max(350, 350 + Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));

/* After Keep, the hand lets go of it and sets off for the button at once —
   the bar is busy, and nothing is left to point at there; the ring comes up
   as it finds the button, the press selects it, and the drag runs 700ms with
   the hand on it. A beat after the drop it goes back to the margin, and the
   click there lets it go; the hold, and the reset. */
const REACH = 700;
const T_LEAVE = T_KEEPING + 60;
const T_HOVER = T_LEAVE + REACH;
const T_GRAB = T_HOVER + 220;
const T_DRAG = T_GRAB + 180;
const DRAG = 700;
const T_DROP = T_DRAG + DRAG;
const BACK = 700;
const CLICK = 80;
const T_DESEL = T_DROP + 600 + BACK + CLICK;
const T_RESET = T_DESEL + 2000;
const FADE = 300;
const LOOP = T_RESET + FADE + 350;

/* What each act of the trace says, and when: the app's own lines
   (chat/steps.ts), the repeated restyle grouped with its count. The three
   restyles are one parallel step, so their calls stream in (the count climbs
   to 3) before any returns; once the first has, groupLine reads its done line.
   Two items stay open in the app too: it folds a trace at three (FOLD_AT). */
type Line = { text: string; on: number; off?: number; many?: boolean };
const READ: Line[] = [
  { text: "Reading the styles…", on: T_STEP1, off: T_STEP1_DONE },
  { text: "Read the diagram's styles", on: T_STEP1_DONE },
];
const RESTYLE: Line[] = [
  { text: "Restyling…", on: T_STEP2, off: T_STEP2 + 120 },
  { text: "Restyling · 2…", on: T_STEP2 + 120, off: T_STEP2 + 240, many: true },
  { text: "Restyling · 3…", on: T_STEP2 + 240, off: T_DARK[0], many: true },
  { text: "Restyled shapes · 3…", on: T_DARK[0], off: T_DONE, many: true },
  { text: "Restyled shapes · 3", on: T_DONE, many: true },
];

/* The band opens straight to the screens' height as the first frame lands,
   420ms on the ease. Its block's 6px above and 3px below come with it. */
const BAND_END = SCENE_H;
const TIMES: V = {
  "--loop": ms(LOOP),
  "--t-type": ms(T_TYPE),
  "--t-think": ms(T_THINK),
  "--t-draw": ms(T_DRAW),
  "--t-first": ms(T_FIRST),
  "--t-wait": ms(T_WAIT),
  "--t-press": ms(T_PRESS),
  "--t-accept": ms(T_ACCEPT),
  "--t-ask": ms(T_ASK),
  "--t-qtype": ms(T_QTYPE),
  "--t-send": ms(T_SEND),
  "--t-clear": ms(T_CLEAR),
  "--t-pending": ms(T_PENDING),
  "--t-step1": ms(T_STEP1),
  "--t-step2": ms(T_STEP2),
  "--t-review": ms(T_DARK[0]),
  "--t-done": ms(T_DONE),
  "--t-keep-down": ms(T_KEEP_DOWN),
  "--t-keeping": ms(T_KEEPING),
  "--t-keep": ms(T_KEEP),
  "--t-hover": ms(T_HOVER),
  "--t-grab": ms(T_GRAB),
  "--t-drag": ms(T_DRAG),
  "--t-drop": ms(T_DROP),
  "--t-desel": ms(T_DESEL),
  "--t-reset": ms(T_RESET),
  "--drag": ms(DRAG),
  "--drag-y": `${DY}px`,
  "--hand": HAND,
  "--rest-w": `${PARK_W[0]}px ${PARK_W[1]}px`,
  "--rest-n": `${PARK_N[0]}px ${PARK_N[1]}px`,
  "--side": `${SIDE_W}px`,
  "--chat": `${CHAT_W}px`,
  "--band": `${BAND_END}px`,
};
const pct = (t: number) => `${((t / LOOP) * 100).toFixed(3)}%`;
const SHUT = "height:0;margin-top:0;padding-bottom:0";
const OPEN = "margin-top:6px;padding-bottom:3px";
const BAND_CSS = `@keyframes ap-band{0%{${SHUT}}${pct(T_DRAW)}{${SHUT};animation-timing-function:${EASE}}${pct(T_DRAW + GROW)}{height:${BAND_END}px;${OPEN}}${pct(T_RESET)}{height:${BAND_END}px;${OPEN};animation-timing-function:${EASE}}${pct(T_RESET + FADE)}{${SHUT}}100%{${SHUT}}}`;

/* The hand's two tracks, one per view, as keyframes: each leg is a hold where
   the hand is and a move to where it is going, timed to arrive on its beat.
   Wide, it works the chat; sheet only, there is no chat, so it waits on the
   sheet and answers from the gutter. From the button on, both are the same
   moves in the scene. */
type Leg = { to: Pt; at: number; dur?: number; ease?: string };
/* A move with corners in it is one reach, timed as a whole and shared out by
   distance: it eases out of its start and into its end, and runs straight
   through the corners at the same speed, so the hand never stops on the way. */
const SET_OFF = "cubic-bezier(0.45, 0, 0.75, 0.75)";
const SETTLE = "cubic-bezier(0.25, 0.25, 0.25, 1)";
function route(from: Pt, via: Pt[], to: Pt, at: number, dur: number): Leg[] {
  const pts = [from, ...via, to];
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let t = at - dur;
  return lens.map((len, i) => {
    const d = (dur * len) / total;
    t += d;
    return { to: pts[i + 1], at: t, dur: d, ease: i === 0 ? SET_OFF : i === lens.length - 1 ? SETTLE : "linear" };
  });
}
/* With the button: the drag, then the way back round the third screen to the
   margin, where the click lets the diagram go. */
const tail = (on: (p: Pt) => Pt, park: Pt): Leg[] => [
  { to: on(DROPPED), at: T_DROP, dur: DRAG },
  ...route(on(DROPPED), [on(BELOW), on(CORNER)], park, T_DESEL - CLICK, BACK),
];
const WIDE_LEGS: Leg[] = [
  { to: COMPOSER, at: T_ASK - CLICK },
  { to: ASIDE, at: T_QTYPE + 700 },
  { to: SEND, at: T_SEND - CLICK },
  { to: WATCH, at: T_SEND + 250 + legFor(SEND, WATCH) },
  { to: KEEP, at: T_KEEP_DOWN - CLICK },
  ...route(KEEP, [onW(CORNER), onW(BELOW)], onW(GRIP), T_HOVER, REACH),
  ...tail(onW, PARK_W),
];
const NARROW_LEGS: Leg[] = [
  { to: TICK, at: T_KEEP_DOWN - CLICK },
  ...route(TICK, [onN(CORNER), onN(BELOW)], onN(GRIP), T_HOVER, REACH),
  ...tail(onN, PARK_N),
];
const px = (n: number) => `${Math.round(n * 10) / 10}px`;
function track(name: string, from: Pt, legs: Leg[]) {
  const key = (t: number, [x, y]: Pt, ease = HAND) => `${pct(t)}{translate:${px(x)} ${px(y)};animation-timing-function:${ease}}`;
  let here = from;
  let out = key(0, from);
  for (const leg of legs) {
    out += key(leg.at - (leg.dur ?? legFor(here, leg.to)), here, leg.ease) + key(leg.at, leg.to);
    here = leg.to;
  }
  return `@keyframes ${name}{${out}100%{translate:${px(here[0])} ${px(here[1])}}}`;
}
/* A click is the arrow pressing for 90ms; the drag holds it down from the
   grab to the drop. */
function presses(name: string, downs: [number, number][]) {
  const at = (t: number, k: number) => `${pct(t)}{scale:${k}}`;
  return `@keyframes ${name}{0%{scale:1}${downs.map(([d, u]) => at(d, 1) + at(d + 30, 0.9) + at(u, 0.9) + at(u + 60, 1)).join("")}100%{scale:1}}`;
}
const tap = (t: number): [number, number] => [t, t + 90];
const HELD: [number, number][] = [[T_GRAB, T_DROP], tap(T_DESEL)];
/* Over the composer's text box the system draws the I-beam, not the arrow:
   from the moment the hand crosses into it on the way to the click, until it
   leaves for the side. Played step by step, so the two glyphs swap outright. */
const T_BEAM = T_ASK - CLICK - 60;
const T_UNBEAM = T_QTYPE + 700 - legFor(COMPOSER, ASIDE) + 60;
const swap = (name: string, from: number, to: number) =>
  `@keyframes ${name}{0%{opacity:${from}}${pct(T_BEAM)}{opacity:${to}}${pct(T_UNBEAM)}{opacity:${from}}100%{opacity:${from}}}`;
const HAND_CSS =
  track("ap-hand-w", PARK_W, WIDE_LEGS) +
  track("ap-hand-n", PARK_N, NARROW_LEGS) +
  presses("ap-press-w", [tap(T_ASK), tap(T_SEND), tap(T_KEEP_DOWN), ...HELD]) +
  presses("ap-press-n", [tap(T_KEEP_DOWN), ...HELD]) +
  swap("ap-arrow-w", 1, 0) +
  swap("ap-beam-w", 0, 1);

/* What the move's readout says as the button travels: where it is landing,
   in scene px (Overlay.tsx), a frame at a time on the drag's own ease. */
function eased(p: number) {
  // HAND's curve, solved for its x by halving.
  const bez = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bez(0.45, 0.25, mid) < p) lo = mid;
    else hi = mid;
  }
  return bez(0, 1, (lo + hi) / 2);
}
const READOUT: Line[] = [];
for (let t = T_DRAG; t < T_DROP; t += 33) {
  const text = `${MOVED.x}, ${Math.round(MOVED.y + DY * eased((t - T_DRAG) / DRAG))}`;
  const last = READOUT[READOUT.length - 1];
  if (last?.text === text) continue;
  if (last) last.off = t;
  READOUT.push({ text, on: t });
}
const LANDED = `${MOVED.x}, ${MOVED.y + DY}`;
if (READOUT[READOUT.length - 1].text !== LANDED) {
  READOUT[READOUT.length - 1].off = T_DROP - 16;
  READOUT.push({ text: LANDED, on: T_DROP - 16 });
}

/* ---- Icons ---------------------------------------------------------------------
   The app's own: Lucide copies at 24 × 24, stroked in the current colour. */
function Ic({ size = 16, sw = 2, fill, className, children }: { size?: number; sw?: number; fill?: boolean; className?: string; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}
const FILE = (
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </>
);
const FOLDER = "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z";
const FileDoc = () => (
  <Ic size={14} className="ap-row-icon">
    {FILE}
  </Ic>
);
const Folder = () => (
  <Ic size={14} className="ap-row-icon">
    <path d={FOLDER} />
  </Ic>
);
const Chevron = ({ open }: { open?: boolean }) => (
  <Ic size={12} className={open ? "is-open" : undefined}>
    <path d="m9 18 6-6-6-6" />
  </Ic>
);
const Plus = ({ size = 16 }: { size?: number }) => (
  <Ic size={size}>
    <path d="M12 5v14M5 12h14" />
  </Ic>
);
const PANEL = <rect width="18" height="18" x="3" y="3" rx="2" />;

/* The page bar's glyphs: 17px, a 1.7 stroke (Toolbar.tsx). */
const Tb = ({ children, size = 17, fill }: { children: ReactNode; size?: number; fill?: boolean }) => (
  <Ic size={size} sw={1.7} fill={fill}>
    {children}
  </Ic>
);
const NIB =
  "M14 .1 23.9 9.8 20.6 11.5 17.1 18.9 2.6 23.3 .2 20.9 5.4 6.9 13.6 4.3 12.6 3.3Z" +
  "M9.9 11a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 1 0 0-6.2Z" +
  "M7.15 14.9 8.95 16.5 3.15 23.3 1.65 22.3Z";
/* The system's I-beam: a stem and its two curled serifs, 9 × 18. */
const BEAM = "M1 1.5H3C3.9 1.5 4.5 2 4.5 3 4.5 2 5.1 1.5 6 1.5H8M4.5 3V15M1 16.5H3C3.9 16.5 4.5 16 4.5 15 4.5 16 5.1 16.5 6 16.5H8";
const SPARK ="M12 3.5c.5 4.4 4.1 8 8.5 8.5-4.4.5-8 4.1-8.5 8.5-.5-4.4-4.1-8-8.5-8.5 4.4-.5 8-4.1 8.5-8.5Z";
const GEAR =
  "M18.1 10.1h2.7v3.6h-2.7a6.4 6.4 0 0 1-1.4 2.5l1.2 2.4-3 1.7-1.5-2.3a6.4 6.4 0 0 1-2.8 0l-1.5 2.3-3-1.7 1.2-2.4a6.4 6.4 0 0 1-1.4-2.5H3.2v-3.6h2.7a6.4 6.4 0 0 1 1.4-2.5L6.1 5.2l3-1.7 1.5 2.3a6.4 6.4 0 0 1 2.8 0l1.5-2.3 3 1.7-1.2 2.4a6.4 6.4 0 0 1 1.4 2.5Z";

/* ---- The pages rail ------------------------------------------------------------ */
type Row = {
  title: string;
  depth: number;
  folder?: boolean;
  open?: boolean;
  emoji?: string;
  current?: boolean;
  add?: number;
  del?: number;
  /** The page the agent is editing: its badge comes and goes with the take. */
  live?: boolean;
};
const ROWS: Row[] = [
  { title: "Planning", depth: 0, folder: true, open: true },
  { title: "Brief", depth: 1 },
  { title: "Launch plan", depth: 1, emoji: "\u{1F680}", current: true, live: true },
  { title: "Research", depth: 1, folder: true },
  { title: "Design", depth: 0, folder: true, open: true },
  { title: "Invite flow", depth: 1, emoji: "✉️" },
  { title: "Mobile screens", depth: 1 },
  { title: "Pricing / Pro", depth: 1 },
  { title: "Engineering", depth: 0, folder: true, open: true },
  { title: "Share API", depth: 1, add: 3 },
  { title: "Invite service", depth: 1 },
  { title: "Specs", depth: 1, folder: true, open: true },
  { title: "Tokens", depth: 2, del: 1 },
  { title: "Rate limits", depth: 2, emoji: "⏱️" },
  { title: "Marketing", depth: 0, folder: true },
  { title: "Retro notes", depth: 0 },
];
/* Only sources the app connects (ContextSources MARKS: file, GitHub, Notion,
   note), drawn as it draws them: muted glyphs in the current colour, 13px. */
const CONTEXT: { src: SourceKey | "file"; title: string }[] = [
  { src: "github", title: "nootles/app" },
  { src: "notion", title: "Invite flow spec" },
  { src: "file", title: "launch-brief.pdf" },
];

function Sidebar() {
  return (
    <aside className="ap-panel ap-side">
      <div className="ap-rail-face is-pages">
        <div className="ap-head">
          <span className="ap-row ap-back">
            <Ic size={14}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </Ic>
            <span className="ap-label">Projects</span>
          </span>
          <span className="ap-btn">
            <Ic>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </Ic>
          </span>
          <span className="ap-btn">
            <span className="ap-monogram">A</span>
          </span>
          <span className="ap-btn">
            <Ic>
              {PANEL}
              <path d="M9 3v18" />
            </Ic>
          </span>
        </div>
        <div className="ap-pad">
          <span className="ap-row ap-project">
            <span className="ap-label">Invite launch</span>
          </span>
        </div>
        <div className="ap-pad">
          <span className="ap-find">
            <Ic size={14}>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.6-3.6" />
            </Ic>
            <span>Find a page</span>
            <kbd className="ap-kbd">⌘K</kbd>
          </span>
        </div>
        <nav className="ap-nav">
          <div className="ap-section ap-section-pages">
            <span>Pages</span>
            <span className="ap-section-btns">
              <span className="ap-btn">
                <Ic size={14}>
                  <path d={FOLDER} />
                  <path d="M12 10v6M9 13h6" />
                </Ic>
              </span>
              <span className="ap-btn">
                <Plus />
              </span>
            </span>
          </div>
          <ul className="ap-pages">
            {ROWS.map((r) => (
              <li
                key={r.title}
                className={`ap-row${r.current ? " is-current" : ""}`}
                style={{ paddingLeft: 8 + r.depth * 12 }}
              >
                <span className="ap-twist">{r.folder ? <Chevron open={r.open} /> : null}</span>
                {r.emoji ? <span className="ap-row-icon ap-emoji">{r.emoji}</span> : r.folder ? <Folder /> : <FileDoc />}
                <span className="ap-label">{r.title}</span>
                {r.add || r.del ? (
                  <span className="ap-diff">
                    {r.add ? <span className="is-add">+{r.add}</span> : null}
                    {r.del ? <span className="is-del">−{r.del}</span> : null}
                  </span>
                ) : null}
                {r.live ? (
                  <span className="ap-diff is-live">
                    <span className="is-add">+1</span>
                    <span className="is-del">−1</span>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <section className="ap-ctx">
          <div className="ap-section">
            <span>Context</span>
            <span className="ap-btn">
              <Plus />
            </span>
          </div>
          <ul className="ap-ctx-list">
            {CONTEXT.map((c) => (
              <li key={c.src} className="ap-row">
                <span className="ap-twist" />
                <span className="ap-row-icon ap-mark">
                  {c.src === "file" ? <Ic size={13}>{FILE}</Ic> : <Logo name={c.src} size={13} mono />}
                </span>
                <span className="ap-label">{c.title}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Layers />
    </aside>
  );
}

/* ---- The chat rail --------------------------------------------------------------
   Its states are stacked in place and shown on their beats: the title and
   the empty state give way to the transcript, the thinking line to the
   assistant's turn, each trace line to the next. */
const when = (on: number, off?: number) => ({ "--on": ms(on), ...(off === undefined ? {} : { "--off": ms(off) }) }) as V;
const Chev = () => (
  <Ic size={11} className="ap-tr-chev">
    <path d="m9 18 6-6-6-6" />
  </Ic>
);

/** One act of the trace: a bead on the rail, and its line. */
function Step({ on, done, lines, rail }: { on: number; done: number; lines: Line[]; rail: "first" | "last" }) {
  return (
    <li className={`ap-tr-item is-${rail}`} style={{ "--s-on": ms(on), "--s-done": ms(done) } as V}>
      <span className="ap-bead">
        <Ic size={11} sw={2.4}>
          <rect x="3" y="3" width="9" height="9" rx="2" />
          <circle cx="16.5" cy="16.5" r="4.5" />
        </Ic>
      </span>
      <div className="ap-tr-step">
        <p className="ap-tr-label">
          <span className="ap-stack">
            {lines.map((l, i) => (
              <span key={l.text} className={`ap-at ap-tr-line${i === lines.length - 1 ? " is-end" : ""}`} style={when(l.on, l.off)}>
                {l.text}
                {l.many ? <Chev /> : null}
              </span>
            ))}
          </span>
        </p>
      </div>
    </li>
  );
}

function Chat() {
  const last = ASK_CHARS.length - 1;
  return (
    <aside className="ap-panel ap-chat">
      <div className="ap-rail-face is-chat">
        <div className="ap-head">
          <span className="ap-row ap-thread">
            <span className="ap-label ap-thread-title">
              <span className="ap-title-new">New chat</span>
              <span className="ap-title-ask">{ASK}</span>
            </span>
            <Ic size={13} className="ap-muted">
              <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
            </Ic>
          </span>
          <span className="ap-btn">
            <Plus />
          </span>
          <span className="ap-btn">
            <Ic>
              {PANEL}
              <path d="M15 3v18" />
            </Ic>
          </span>
        </div>
        <div className="ap-chat-body">
          <div className="ap-empty">
            <p className="ap-empty-h">Ask about this project</p>
            <p className="ap-empty-p">Questions are answered from what the pages actually say.</p>
          </div>
          <div className="ap-transcript">
            <div className="ap-turn is-user">
              <p className="ap-turn-text">{ASK}</p>
            </div>
            <div className="ap-stack ap-reply">
              <div className="ap-pending">
                <span className="ap-pending-bead">
                  <span className="ap-thinking" />
                </span>
                Thinking…
              </div>
              <div className="ap-turn is-assistant">
                <ol className="ap-trace">
                  <Step on={T_STEP1} done={T_STEP1_DONE} lines={READ} rail="first" />
                  <Step on={T_STEP2} done={T_DONE} lines={RESTYLE} rail="last" />
                </ol>
                <div className="ap-answer">
                  <p className="ap-turn-text">{ANSWER}</p>
                </div>
              </div>
            </div>
          </div>
          {/* The thread's own answer, on the composer's shoulders. */}
          <div className="ap-review">
            <div className="ap-review-row">
              <span className="ap-review-count">1 change</span>
              <span className="ap-review-count is-writing">
                <span className="ap-thinking" />
                still writing…
              </span>
              <span className="ap-review-acts">
                <span className="ap-review-btn">Discard</span>
                <span className="ap-review-btn is-keep">
                  <span className="ap-keep-now">Keep</span>
                  <span className="ap-keep-ing">Keeping…</span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="ap-composer">
          <span className="ap-composer-input">
            <span className="ap-q-ph">Ask, or describe a change…</span>
            <span className="ap-q">
              {ASK_CHARS.map((c, i) => (
                <span
                  key={i}
                  className={`ap-qc${i === last ? " is-last" : ""}`}
                  style={{ "--ws": ms(T_QTYPE + i * QKEY), "--we": ms(i === last ? T_CLEAR : T_QTYPE + (i + 1) * QKEY) } as V}
                >
                  {c}
                </span>
              ))}
            </span>
          </span>
          <span className="ap-composer-actions">
            <span className="ap-attach">
              <Ic size={14}>
                <path d="M21.4 11.1 12.2 20.3a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.9-2.9l8.5-8.5" />
              </Ic>
            </span>
            <span className="ap-composer-go">
              <span className="ap-stop">Stop</span>
              <span className="ap-send">Send</span>
            </span>
          </span>
        </div>
      </div>
      <Design />
    </aside>
  );
}

/* ---- The diagram's panels -------------------------------------------------------
   Pressing a shape makes its diagram the active one, and the rails turn over
   to it (Workspace.tsx): the pages to its layers, the chat to its design
   panel, each at its rail's width so the sheet never moves. A press off the
   diagram leaves it, and they turn back. Both are drawn for the button in
   hand, in the panels' own order (LayersPanel.tsx, StylePanel.tsx). */
const ROUNDED_BOX = "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z";
const ELLIPSE = "M3 12a9 7 0 1 0 18 0 9 7 0 1 0-18 0";
const TEXT_GLYPH = "M5 6h14M12 6v12M9 18h6";
const CONNECTOR = "M4 7h9a4 4 0 0 1 4 4v6";
const Glyph = ({ d }: { d: string }) => (
  <Ic size={12} className="ap-lyr-icon">
    <path d={d} />
  </Ic>
);
/* Front-most first, the reverse of the order they were drawn in. A shape is
   called by its name, else its text, else its kind (displayName). */
const LAYERS = SCREENS.flat()
  .map((e) => ({
    name: e.name ?? e.label ?? (e.k === "dot" ? "Ellipse" : "Rectangle"),
    glyph: e.k === "text" ? TEXT_GLYPH : e.k === "dot" ? ELLIPSE : ROUNDED_BOX,
    moves: e.moves,
  }))
  .reverse();
const FRAMES = SCREENS.map((s) => s[0].name);
/* Rows past the twelfth arrive together. */
const STAGGER = 12;

function Layers() {
  return (
    <div className="ap-rail-face is-layers">
      <div className="ap-lyr">
        <div className="ap-section ap-lyr-head">
          <span>Layers</span>
          <span className="ap-meta">{LAYERS.length}</span>
        </div>
        <div className="ap-lyr-list">
          {LAYERS.map((l, i) => (
            <div key={i} className={`ap-lyr-row${l.moves ? " is-selected" : ""}`} style={{ "--i": Math.min(i, STAGGER) } as V}>
              <Glyph d={l.glyph} />
              <span className="ap-label">{l.name}</span>
            </div>
          ))}
        </div>
        <div className="ap-section ap-lyr-head">
          <span>Connectors</span>
          <span className="ap-meta">{EDGES.length}</span>
        </div>
        <div className="ap-lyr-edges">
          {EDGES.map((e, i) => (
            <div key={e.d} className="ap-lyr-row" style={{ "--i": i } as V}>
              <Glyph d={CONNECTOR} />
              <span className="ap-label">{`${FRAMES[i]} → ${FRAMES[i + 1]}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* The design panel's fields: a name in the well's mono voice, then the value.
   Y follows the button down as it is dragged, a frame at a time. */
function Field({ mark, unit, children, wide }: { mark?: ReactNode; unit?: string; children: ReactNode; wide?: boolean }) {
  return (
    <span className={`ap-fld${wide ? " is-wide" : ""}${mark ? " has-mark" : ""}${unit ? " is-narrow" : ""}`}>
      {mark ? <span className="ap-fld-mark">{mark}</span> : null}
      <span className="ap-fld-val">{children}</span>
      {unit ? <span className="ap-fld-unit">{unit}</span> : null}
    </span>
  );
}
const Swatch = ({ hex }: { hex: string }) => (
  <>
    <span className="ap-chip" style={{ background: `#${hex}` }} />
    {hex}
  </>
);
function Sec({ title, add, children }: { title: string; add?: boolean; children?: ReactNode }) {
  return (
    <section className="ap-sec">
      <div className="ap-sec-head">
        <span className="ap-sec-title">{title}</span>
        {add ? (
          <span className="ap-btn is-sm">
            <Plus size={14} />
          </span>
        ) : null}
        <span className="ap-btn is-sm">
          <Chevron open={!add} />
        </span>
      </div>
      {children ? <div className="ap-sec-body">{children}</div> : null}
    </section>
  );
}
const Y_AT: Line[] = [
  { text: String(MOVED.y), on: 0, off: READOUT[0].on },
  ...READOUT.map((l) => ({ ...l, text: l.text.split(", ")[1] })),
];
/* The panel's glyphs (controls/glyphs.tsx): 14px on a 16 grid, a 1.25 line;
   the align strip's are solid bars against a rule. Align left, centre,
   right, top, middle, bottom; then the two distributes, which want three
   shapes and stand down for one. */
const G16 = ({ children, sw = 1.25 }: { children: ReactNode; sw?: number }) => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const ALIGN: [string | null, string][] = [
  ["2.5,2,2.5,14", "3.5,4,9,3 3.5,9,6,3"],
  ["8,2,8,14", "3.5,4,9,3 5,9,6,3"],
  ["13.5,2,13.5,14", "3.5,4,9,3 6.5,9,6,3"],
  ["2,2.5,14,2.5", "4,3.5,3,9 9,3.5,3,6"],
  ["2,8,14,8", "4,3.5,3,9 9,5,3,6"],
  ["2,13.5,14,13.5", "4,3.5,3,9 9,6.5,3,6"],
];
const SPREAD: [string | null, string][] = [
  [null, "2,4,3,8 6.5,4,3,8 11,4,3,8"],
  [null, "4,2,8,3 4,6.5,8,3 4,11,8,3"],
];
function Align({ rule, bars }: { rule: string | null; bars: string }) {
  const [x1, y1, x2, y2] = rule?.split(",") ?? [];
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
      {rule ? <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" fill="none" /> : null}
      {bars.split(" ").map((bar) => {
        const [x, y, w, h] = bar.split(",");
        return <rect key={bar} x={x} y={y} width={w} height={h} rx={1} />;
      })}
    </svg>
  );
}

function Design() {
  const { w = 0, h = 0 } = MOVED;
  return (
    <div className="ap-rail-face is-design">
      <div className="ap-style">
        <div className="ap-section ap-style-head">
          <span>Design</span>
        </div>
        <div className="ap-style-body">
          <div className="ap-align">
            {[ALIGN, SPREAD].map((group, g) => (
              <span key={g} className="ap-align-group">
                {group.map(([rule, bars]) => (
                  <span key={bars} className={`ap-btn is-sm${g ? " is-off" : ""}`}>
                    <Align rule={rule} bars={bars} />
                  </span>
                ))}
              </span>
            ))}
          </div>
          <Sec title="Transform">
            <div className="ap-grid-row">
              <Field mark="X">{MOVED.x}</Field>
              <Field mark="Y">
                <span className="ap-stack">
                  {Y_AT.map((l, i) => (
                    <span key={i} className="ap-at" style={when(l.on, l.off)}>
                      {l.text}
                    </span>
                  ))}
                </span>
              </Field>
            </div>
            <div className="ap-grid-row">
              <Field mark="W">{w}</Field>
              <Field mark="H">{h}</Field>
              <span className="ap-btn is-sm">
                <G16>
                  <path d="M6.1 4.6h-.7a3.4 3.4 0 0 0 0 6.8h.7M9.9 4.6h.7a3.4 3.4 0 0 1 0 6.8h-.7" />
                </G16>
              </span>
            </div>
            <div className="ap-grid-row is-apart">
              <Field
                mark={
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.875} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5" />
                  </svg>
                }
              >
                0°
              </Field>
              <Field
                mark={
                  <G16>
                    <path d="M3.2 13V7.2A4 4 0 0 1 7.2 3.2H13" />
                  </G16>
                }
              >
                10
              </Field>
            </div>
          </Sec>
          <Sec title="Text">
            <div className="ap-grid-row">
              <Field wide>Geist</Field>
            </div>
            <div className="ap-grid-row">
              <Field>Semibold</Field>
              <Field
                mark={
                  <G16>
                    <path d="M1.9 12.6 4.9 3.6l3 9M2.9 10.1h4M9.8 12.6 11.6 7.4l1.8 5.2M10.4 11.1h2.4" />
                  </G16>
                }
              >
                11.5
              </Field>
            </div>
          </Sec>
          <Sec title="Appearance">
            <div className="ap-flex-row">
              <span className="ap-slider" />
              <Field unit="%">100</Field>
            </div>
            <div className="ap-flex-row">
              <Field wide>Normal</Field>
            </div>
          </Sec>
          <Sec title="Fill">
            <div className="ap-grid-row">
              <Field>
                <Swatch hex="ECEBE7" />
              </Field>
              <Field unit="%">100</Field>
            </div>
          </Sec>
          <Sec title="Stroke">
            <div className="ap-grid-row">
              <Field>
                <Swatch hex="ECEBE7" />
              </Field>
              <Field
                mark={
                  <G16>
                    <path d="M2.6 5.2h10.8" strokeWidth={2.6} />
                    <path d="M2.6 10.6h10.8" strokeWidth={1} />
                  </G16>
                }
              >
                1
              </Field>
            </div>
          </Sec>
          <Sec title="Effects" add />
          <Sec title="Diagram">
            <div className="ap-grid-row">
              <span className="ap-seg">
                <span className="is-on">Column</span>
                <span>Wide</span>
              </span>
            </div>
            <div className="ap-grid-row">
              <Field mark="H">{BAND_END}</Field>
            </div>
          </Sec>
        </div>
      </div>
    </div>
  );
}

/* ---- The page bar ---------------------------------------------------------------
   PageToolbar, in its order: the tools (move in hand; text waits for a
   diagram), undo and redo, the zoom, settings, the autocomplete switch (on),
   and the palette. */
function Toolbar() {
  const sep = <span className="ap-tb-sep" />;
  return (
    <div className="ap-dock">
      <div className="ap-tb">
        <span className="ap-tb-btn is-on">
          <Tb>
            <path d="M5 3.5 18 12l-5.6 1.2L9.8 19z" />
          </Tb>
        </span>
        <span className="ap-tb-btn">
          <Tb>
            <path d="M4 3.2 14.5 10l-4.5 1-2.1 4.6z" />
            <path d="M14 20h6v-6M20 20l-5.5-5.5" />
          </Tb>
        </span>
        <span className="ap-tb-shapes">
          <span className="ap-tb-btn">
            <Tb>
              <rect x="3.5" y="6" width="17" height="12" rx="2" />
            </Tb>
          </span>
          <span className="ap-tb-caret">
            <svg width={8} height={8} viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.25 4 5.25l2-2" />
            </svg>
          </span>
        </span>
        <span className="ap-tb-btn is-off">
          <Tb>
            <path d="M5 6h14M12 6v12M9 18h6" />
          </Tb>
        </span>
        <span className="ap-tb-btn">
          <Tb size={15} fill>
            <path d={NIB} fillRule="evenodd" />
          </Tb>
        </span>
        <span className="ap-tb-btn">
          <Tb>
            <path d="M7 6h6a3 3 0 0 1 3 3v6" />
            <circle cx="4.5" cy="6" r="2" />
            <circle cx="16" cy="18.5" r="2" />
          </Tb>
        </span>
        {sep}
        <span className="ap-tb-btn">
          <Tb>
            <path d="M4 8h9a5 5 0 0 1 0 10H8M4 8l4-4M4 8l4 4" />
          </Tb>
        </span>
        <span className="ap-tb-btn is-off">
          <Tb>
            <path d="M20 8h-9a5 5 0 0 0 0 10h5M20 8l-4-4M20 8l-4 4" />
          </Tb>
        </span>
        {sep}
        <span className="ap-tb-zoom">100%</span>
        {sep}
        <span className="ap-tb-btn">
          <Tb>
            <path d={GEAR} />
            <circle cx="12" cy="12" r="2.6" />
          </Tb>
        </span>
        {sep}
        <span className="ap-tb-btn is-toggle">
          <Tb>
            <path d={SPARK} />
          </Tb>
        </span>
        {sep}
        <span className="ap-tb-btn">
          <Tb>
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </Tb>
        </span>
      </div>
    </div>
  );
}

/* ---- The page ------------------------------------------------------------------- */
type Tok = [string, "kw" | "fn" | "st" | "nu" | "ty" | "pu" | "cm" | "pl"];
const CODE: Tok[][] = [
  [["export async function ", "kw"], ["createInvite", "fn"], ["(", "pu"], ["boardId", "pl"], [": ", "pu"], ["string", "ty"], [", ", "pu"], ["email", "pl"], [": ", "pu"], ["string", "ty"], [") {", "pu"]],
  [["  const ", "kw"], ["token ", "pl"], ["= ", "pu"], ["await ", "kw"], ["tokens", "pl"], [".", "pu"], ["issue", "fn"], ["({ ", "pu"], ["boardId", "pl"], [", ", "pu"], ["ttl", "pl"], [": ", "pu"], ['"7d"', "st"], [" });", "pu"]],
  [["  const ", "kw"], ["url ", "pl"], ["= ", "pu"], ["`", "st"], ["${", "pu"], ["BASE_URL", "pl"], ["}", "pu"], ["/join/", "st"], ["${", "pu"], ["token", "pl"], ["}", "pu"], ["`", "st"], [";", "pu"]],
  [["  await ", "kw"], ["mail", "pl"], [".", "pu"], ["send", "fn"], ["(", "pu"], ["email", "pl"], [", { ", "pu"], ["template", "pl"], [": ", "pu"], ['"invite"', "st"], [", ", "pu"], ["url", "pl"], [" });", "pu"]],
  [["  // One link per guest; they expire after a week.", "cm"]],
  [["  await ", "kw"], ["limits", "pl"], [".", "pu"], ["hit", "fn"], ["(", "pu"], ["`invite:", "st"], ["${", "pu"], ["boardId", "pl"], ["}", "pu"], ["`", "st"], [", ", "pu"], ["50", "nu"], [");", "pu"]],
  [["  return ", "kw"], ["{ ", "pu"], ["url", "pl"], [", ", "pu"], ["expiresIn", "pl"], [": ", "pu"], ["7", "nu"], [" * ", "pu"], ["DAY", "pl"], [" };", "pu"]],
  [["}", "pu"]],
];
const ROLLOUT = [
  ["Internal", "Nootles team", "Oct 7", "PM"],
  ["Beta", "200 waitlist teams", "Oct 10", "Engineering"],
  ["General", "Everyone", "Oct 14", "Marketing"],
];

/* What the canvas draws over the shapes as the hand works the button
   (render/Overlay.tsx, overlay.css): the hover ring as the pointer finds it;
   pressed, the selection — a 1px frame in the canvas's blue and four square
   grips; dragged, the frame and grips riding with it, the snap guide that
   holds (its centre on the column's, from top to foot of the band) and the
   readout chip under it saying where it lands. All in scene px. */
const GRIP_PX = 8;
const CHIP_W = LANDED.length * 6.7 + 14;
function Selection() {
  const { x, y, w = 0, h = 0 } = MOVED;
  const box = { x, y, width: w, height: h };
  const mid = 720 / 2;
  return (
    <svg className="ap-ov" width="720" height={BAND_END} viewBox={`0 0 720 ${BAND_END}`}>
      <rect className="ap-ov-hover" {...box} />
      <path className="ap-ov-guides" d={`M${mid} 0V${BAND_END}M${mid - 3} 0h6M${mid - 3} ${BAND_END}h6`} />
      <g className="ap-ov-frame">
        <rect className="ap-ov-outline" {...box} />
        <g className="ap-ov-grips">
          {[
            [x, y],
            [x + w, y],
            [x + w, y + h],
            [x, y + h],
          ].map(([gx, gy], i) => (
            <rect key={i} x={gx - GRIP_PX / 2} y={gy - GRIP_PX / 2} width={GRIP_PX} height={GRIP_PX} rx={2} style={{ animationDelay: `calc(var(--t-grab) + ${i * 20}ms)` }} />
          ))}
        </g>
      </g>
      <g className="ap-ov-chip">
        <g transform={`translate(${x + w / 2} ${y + h + 9})`}>
          <rect x={-CHIP_W / 2} y="0" width={CHIP_W} height="18" rx="3" />
          {READOUT.map((l) => (
            <text key={l.text} className="ap-at" y="12.5" textAnchor="middle" style={when(l.on, l.off)}>
              {l.text}
            </text>
          ))}
        </g>
      </g>
    </svg>
  );
}

/** The paragraph being finished, the suggestion that follows it, and the band
    the diagram is drawn in: one take of the loop. */
function Autocomplete() {
  const last = TYPED_CHARS.length - 1;
  return (
    <>
      <div className="ap-bc">
        <p className="ap-p">
          {PRE}
          <span className="ap-c is-pre"> </span>
          <span className="ap-fresh">
            {TYPED_CHARS.map((c, i) => (
              <span
                key={i}
                className={`ap-c${i === last ? " is-last" : ""}`}
                style={{ "--ws": ms(T_TYPE + i * KEY), "--we": ms(T_TYPE + (i + 1) * KEY) } as V}
              >
                {c}
              </span>
            ))}
            <span className="ap-ghost">
              <span className="ap-tail">
                {TAIL}
                <span className="ap-c is-end">:</span>
              </span>
              <span className="ap-status">
                <span className="ap-st-draw">Drawing diagram</span>
                <span className="ap-st-wait">
                  <span className="ap-key is-tab">Tab</span> to insert <span className="ap-key is-quiet">Esc</span> to dismiss
                </span>
              </span>
            </span>
          </span>
        </p>
      </div>
      <div className="ap-band">
        {/* The agent's change, waiting for an answer: the wash under the
            block, its rule in the margin, the pair in the gutter. */}
        <div className="ap-wash" />
        <div className="ap-band-in">
          <div className="ap-grid" />
          <div className="ap-hold" />
          <div className="ap-scene">
            {EDGES.map((e, i) => (
              <svg
                key={e.d}
                className="ap-edge ap-arrive"
                width="720"
                height={BAND_END}
                viewBox={`0 0 720 ${BAND_END}`}
                style={{ "--at": ms(EDGE_AT[i]) } as V}
              >
                <defs>
                  <marker id={`ap-arrow-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
                    <path d="M0 0.5 10 5 0 9.5Z" />
                  </marker>
                </defs>
                <path d={e.d} markerEnd={`url(#ap-arrow-${i})`} />
              </svg>
            ))}
            {SCREENS.flat().map((e, i) => (
              <div
                key={i}
                className={`ap-ui is-${e.k}${e.tone ? ` tone-${e.tone}` : ""}${e.bold ? " is-bold" : ""}${e.muted ? " is-muted" : ""}${e.moves ? " is-moved" : ""} ap-arrive`}
                style={{ left: e.x, top: e.y, width: e.w, height: e.h, fontSize: e.size, "--at": ms(ARRIVALS[i]), "--dk": ms(T_DARK[SCREEN_OF[i]]) } as V}
              >
                {e.label}
              </div>
            ))}
            {EDGES.map((e, i) =>
              e.say ? (
                <span
                  key={e.say.text}
                  className="ap-say ap-arrive"
                  style={{ left: e.say.x, top: e.say.y, "--at": ms(EDGE_AT[i]) } as V}
                >
                  {e.say.text}
                </span>
              ) : null,
            )}
            <Selection />
          </div>
        </div>
        <div className="ap-acts">
          <span className="ap-acts-in">
            <span className="ap-act">
              <Ic size={13} sw={2.2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </Ic>
            </span>
            <span className="ap-act is-keep">
              <Ic size={13} sw={2.2}>
                <path d="M20 6 9 17l-5-5" />
              </Ic>
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

function Sheet() {
  return (
    <div className="ap-sheet">
      <div className="ap-col">
        <div className="ap-toprow" />
        <h1 className="ap-title">Launch plan</h1>
        <div className="ap-editor">
          <div className="ap-block">
            <div className="ap-bc">
              <p className="ap-p">
                Invites ship on the 14th, behind the <code>invite_v2</code> flag until the beta signs off.
              </p>
            </div>
          </div>
          <div className="ap-block">
            <h2 className="ap-bc ap-h2">Rollout</h2>
          </div>
          <div className="ap-block">
            <div className="ap-bc">
              <div className="ap-tablewrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Audience</th>
                      <th>Date</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLLOUT.map((r) => (
                      <tr key={r[0]}>
                        {r.map((c) => (
                          <td key={c}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="ap-block">
            <h2 className="ap-bc ap-h2">Invite flow</h2>
          </div>
          <div className="ap-block">
            <Autocomplete />
          </div>
          <div className="ap-block">
            <h2 className="ap-bc ap-h2">Share API</h2>
          </div>
          <div className="ap-block">
            <div className="ap-bc is-code">
              <div className="ap-code">
                <div className="ap-code-top">
                  <span className="ap-code-lang">
                    TypeScript
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                  <span className="ap-code-x">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                </div>
                <div className="ap-code-body">
                  {CODE.map((line, i) => (
                    <div key={i} className="ap-code-line">
                      {line.map(([s, k], j) => (
                        <span key={j} className={`is-${k}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* The ways back to the rails, shown only once both are put away. */}
      <div className="ap-corner is-left ap-narrow-only">
        <span className="ap-btn">
          <Ic>
            {PANEL}
            <path d="M9 3v18" />
          </Ic>
        </span>
      </div>
      <div className="ap-corner">
        <span className="ap-faces">
          <span className="ap-face is-pm" />
          <span className="ap-face is-design" />
        </span>
        <span className="ap-btn">
          <Ic>
            <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12Z" />
          </Ic>
        </span>
        <span className="ap-btn ap-narrow-only">
          <Ic>
            {PANEL}
            <path d="M15 3v18" />
          </Ic>
        </span>
      </div>
      <Toolbar />
    </div>
  );
}

export function AppProject() {
  return (
    <article className="sc-proj">
      <div className="ap-stage" aria-hidden="true">
        <style>{BAND_CSS + HAND_CSS}</style>
        <AppScale>
          {/* The whole window is one take: the chat and the pages rail move on
              the same beats as the sheet. */}
          <AppLoop className="ap-shell ap-loop" total={LOOP} style={TIMES}>
            <Sidebar />
            <span className="ap-resize" />
            <div className="ap-well">
              <Sheet />
            </div>
            <span className="ap-resize" />
            <Chat />
            {/* Fixed to the window, so it stays when the rails are put away. */}
            <span className="ap-feedback">
              <Ic>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8h.01M12 12v4" />
              </Ic>
            </span>
            {/* The hand: the system's arrow, at its real size, over all of it,
                and the I-beam it turns into over a text box. */}
            <span className="ap-cursor">
              <svg className="ap-arrow" width="17" height="25" viewBox="0 0 17 25">
                <path d="M3 2V18L6.8 14.5 9.2 20.2 11.4 19.3 9.1 13.7H14.2Z" />
              </svg>
              <svg className="ap-beam" width="9" height="18" viewBox="0 0 9 18">
                <path d={BEAM} />
                <path d={BEAM} />
              </svg>
            </span>
          </AppLoop>
        </AppScale>
      </div>
      <div className="sc-cap">
        <h3>Context-aware autocomplete and agent</h3>
        <code className="sc-hint">Tab</code>
        <p>Pause mid-thought and it suggests what comes next, screens included. Then ask the agent to change them.</p>
      </div>
    </article>
  );
}
