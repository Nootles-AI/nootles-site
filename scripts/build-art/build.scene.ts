import { readFileSync } from 'node:fs';
import {
  character, part, svgShape, mask, rect, line, circle, keys, sampled, loadOutlineFont, path,
  easeIn, easeOut, easeInOut, cubicBezier,
} from './heron/src/index.ts';
import type { Channel, MaskRef, OutlineFont } from './heron/src/index.ts';

/**
 * Step 3, "Build": the developer at work beside his coding agent. The agent
 * reads the plan from Nootles over MCP, writes the code, and ticks the task
 * off back on the page; the developer hammers each line home, a line a blow,
 * exactly as he does in the app's Pro picture.
 *
 * The developer is the app's own vector art (the Blue Alien in
 * `scripts/pro-art/art.json` on the app's main), drawn path for path and rigged
 * with the same parts and pivots as the app's `team.scene.ts`, mirrored so his
 * hammer faces the terminal. The terminal's text is JetBrains Mono, converted
 * to paths, so the delivered SVG needs no font.
 *
 *   node scripts/build-art/heron/src/cli.ts check "$PWD/scripts/build-art/build.scene.ts" --fps 30
 *   node scripts/build-art/heron/src/cli.ts build "$PWD/scripts/build-art/build.scene.ts" \
 *     -o public/hero/build-mcp.svg --fps 30
 *
 * `heron` is a symlink to the installed Heron skill, not committed.
 */

// ---- The art ------------------------------------------------------------------

type Attrs = Record<string, string>;
type Shape = { t: 's'; tag: string; a: Attrs };
type Group = { t: 'g'; id?: string; mask?: string; clip?: string; c: Node[] };
type Node = Shape | Group;
interface Art {
  masks: { id: string; region: [number, number, number, number]; shapes: { tag: string; a: Attrs }[] }[];
  alien: Group;
}
const ART: Art = JSON.parse(readFileSync(new URL('./art.alien.json', import.meta.url), 'utf8'));
const AL = ART.alien.c;

let MASKS = new Map<string, MaskRef>();
function definitions(): void {
  MASKS = new Map();
  for (const m of ART.masks) {
    const [x, y, width, height] = m.region;
    MASKS.set(m.id, mask(m.id, () => m.shapes.forEach((s) => svgShape(s.tag, s.a)),
      { units: 'userSpaceOnUse', region: { x, y, width, height } }));
  }
}
let unnamed = 0;
/** Draws a node exactly as drawn: groups become parts, keeping their masks. */
function draw(n: Node): void {
  if (n.t === 's') {
    svgShape(n.tag, n.a);
    return;
  }
  part((n.id ?? `g${++unnamed}`).replace(/[^A-Za-z0-9_-]/g, '_'), {
    ...(n.mask ? { mask: MASKS.get(n.mask)! } : {}),
  }, () => n.c.forEach(draw));
}

// ---- Type ---------------------------------------------------------------------

const MONO = loadOutlineFont(new URL('./fonts/JetBrainsMono-Regular.ttf', import.meta.url).pathname);
const MONO_BOLD = loadOutlineFont(new URL('./fonts/JetBrainsMono-Bold.ttf', import.meta.url).pathname);
const SANS = loadOutlineFont(new URL('./fonts/Geist-Regular.ttf', import.meta.url).pathname);
const SANS_BOLD = loadOutlineFont(new URL('./fonts/Geist-SemiBold.ttf', import.meta.url).pathname);
type Run = [text: string, color: string, bold?: boolean];
/** Sans text for the Nootles page: one path, `y` at the top of the metrics. */
function sans(text: string, color: string, x: number, y: number, size: number, bold = false): number {
  const r = textPath(text, bold ? SANS_BOLD : SANS, x, y, size);
  path({ d: r.d, fill: color });
  return r.width;
}
/**
 * Text as one path, `y` at the top of the font's metrics. Heron's fontPath()
 * would do this, but with opentype.js 2.x its output is unusable two ways:
 * toPathData() flips y by default on coordinates that are already y-down, so
 * the glyphs come out upside down; and it writes NaN for some points of text
 * set away from x = 0, which stops the browser drawing the rest of the path.
 * So the outline's own commands are written out here instead.
 */
type Cmd = { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number };
function textPath(text: string, font: OutlineFont, x: number, y: number, size: number): { d: string; width: number } {
  const f = font.font as unknown as {
    unitsPerEm: number;
    ascender: number;
    getAdvanceWidth(t: string, s: number, o?: unknown): number;
    getPath(t: string, x: number, y: number, s: number, o?: unknown): { commands: Cmd[] };
  };
  const options = { kerning: true };
  const baseline = y + f.ascender * (size / f.unitsPerEm);
  const n = (v: number | undefined) => {
    if (v === undefined || !Number.isFinite(v)) throw new Error(`build scene: bad outline point in "${text}"`);
    return Number(v.toFixed(2));
  };
  const d = f.getPath(text, x, baseline, size, options).commands.map((c) => {
    switch (c.type) {
      case 'M': return `M${n(c.x)} ${n(c.y)}`;
      case 'L': return `L${n(c.x)} ${n(c.y)}`;
      case 'Q': return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      case 'C': return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      case 'Z': return 'Z';
      default: throw new Error(`build scene: unknown outline command ${c.type}`);
    }
  }).join('');
  return { d, width: f.getAdvanceWidth(text, size, options) };
}
/** One line of mixed-colour runs, set left to right from (x, y). */
function setLine(runs: Run[], x: number, y: number, size: number): void {
  let at = x;
  for (const [text, color, bold] of runs) {
    const r = textPath(text, bold ? MONO_BOLD : MONO, at, y, size);
    if (r.d) path({ d: r.d, fill: color });
    at += r.width;
  }
}

// ---- Stage --------------------------------------------------------------------

const W = 656;
const H = 480;
const D = 8;

const INK = '#e4e7ea';
const DIM = '#8f969d';
const CYAN = '#8ec5ff';
const GREEN = '#7bd5a3';
const VIOLET = '#c9a7ff';
const PAGE_INK = '#16181a';
const PAGE_DIM = '#5b6066';
const LINE_GREY = '#e3e6ea';

/* The Nootles page the plan lives on: its three sections and the to-do the
   agent will tick. */
const C = { x: 8, y: 14, w: 206, h: 222, r: 16 };
const ROW0 = C.y + 58;
const ROW_STEP = 36;
const SECTIONS = ['Requirements', 'User flow', 'Mockups'];
const CHIPS = ['plan', 'flow', 'UI'];
const TODO_Y = C.y + 182;

/* The terminal: where the agent works. */
const T = { x: 346, y: 14, w: 300, h: 316, r: 18 };
const SIZE = 19;
const LINE0 = T.y + 62;
const STEP = 33;
/* The agent reads the plan over MCP, writes the code, and ticks the task off
   back on the page — at most 22 characters a line, to fit. */
const LINES: Run[][] = [
  [['› ', CYAN], ['nootles.read_doc', CYAN]],
  [['  ✓ ', GREEN], ['plan · flow · UI', DIM]],
  [['+ ', GREEN], ['async function', INK]],
  [['+ ', GREEN], ['  checkout(cart) {', INK]],
  [['+ ', GREEN], ['    return pay(cart)', INK]],
  [['+ ', GREEN], ['}', INK]],
  [['› ', VIOLET], ['nootles.edit_doc ', VIOLET], ['✓', GREEN]],
];

/* The MCP pipe between them. */
const WIRE_Y = 108;
const WIRE: [number, number] = [C.x + C.w, T.x];
const CHIP_W = 44;
const CHIP_TRAVEL = WIRE[1] - WIRE[0] - CHIP_W - 8;

/* The developer: art coordinates, mirrored, at four-fifths size, standing
   under the page and reaching the terminal's lower left. */
const DEV_C: [number, number] = [612, 1900];
const DEV_AT = { x: -380, y: -1536, scale: 0.8 };

/* The Claude mark, for the terminal's title — Simple Icons (CC0), the same
   file the site's source logos use. A 24 × 24 path in Claude's brand colour. */
const CLAUDE = {
  d: readFileSync(new URL('../../public/logos/sources/claude.svg', import.meta.url), 'utf8').match(/ d="([^"]+)"/)![1],
  hex: '#D97757',
};

/* The Nootles mark, from the site's own Brand. */
const MARK = [
  "M41.9521 22.0449C41.952 17.6934 36.9445 8.0475 24.3408 7.83301C18.0937 7.9403 14.0472 10.485 11.5059 13.4551C8.82714 16.5857 7.83206 20.1749 7.83203 22.0459V67.8887C7.83203 70.0514 6.07875 71.8047 3.91602 71.8047C1.75328 71.8047 2.0616e-06 70.0514 0 67.8887V22.0459C2.64743e-05 18.1724 1.75305 12.8064 5.55469 8.36328C9.48603 3.7687 15.6354 0.127431 24.2832 0H24.3994C41.6097 0.253683 49.7841 13.697 49.7842 22.0449V60.5225C49.7748 65.0499 46.3231 71.5582 38.5068 71.8154C34.1545 71.9585 30.8618 70.3816 28.6621 68.0205C26.5837 65.7894 25.6644 63.064 25.4756 60.9814C25.2711 58.7259 25.7618 55.5899 27.5596 52.8867C29.4996 49.9696 32.8155 47.8035 37.5547 47.7266H37.627C39.1932 47.73 40.6466 48.0521 41.9521 48.5576V22.0449ZM37.6377 55.5586C35.5397 55.6038 34.6082 56.4295 34.0801 57.2236C33.4061 58.2373 33.2096 59.5381 33.2764 60.2744C33.3308 60.8745 33.6589 61.8931 34.3936 62.6816C35.0072 63.3402 36.0943 64.0591 38.249 63.9883C39.695 63.9407 40.5373 63.3749 41.0723 62.7373C41.6896 62.0014 41.9485 61.0942 41.9521 60.5146V58.1338C41.9275 58.0929 41.8987 58.0426 41.8604 57.9863C41.6416 57.6657 41.288 57.26 40.8125 56.8652C39.8395 56.0575 38.7033 55.5693 37.6377 55.5586Z",
  "M39.9622 50.7151C41.4653 49.1602 43.9443 49.1182 45.4993 50.6214C48.5401 53.5608 50.3204 56.5553 51.7717 58.6868C53.228 60.8255 54.5118 62.3961 56.8118 63.7317C58.682 64.8176 59.3183 67.214 58.2327 69.0842C57.1467 70.9546 54.7495 71.5911 52.8792 70.5051C49.0962 68.3086 47.0188 65.6211 45.2981 63.094C43.5724 60.5596 42.3598 58.4793 40.0559 56.2522C38.501 54.7491 38.459 52.2701 39.9622 50.7151Z",
];

// ---- Time ---------------------------------------------------------------------

type Key = [seconds: number, value: number, ease?: Parameters<typeof keys>[0][number][2]];
/** Keys in seconds, held before the first; returns to the first value by the end. */
function at(list: Key[]): Channel {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  const rows: Parameters<typeof keys>[0] = [];
  if (sorted[0][0] > 0) rows.push([0, sorted[0][1]]);
  for (const [s, v, e] of sorted) rows.push(e ? [s / D, v, e] : [s / D, v]);
  if (sorted[sorted.length - 1][0] < D) rows.push([1, sorted[0][1]]);
  return keys(rows);
}
/** Loop-safe wobble: a whole number of cycles in the film. */
const wobble = (amp: number, cycles: number, phase = 0) =>
  sampled((u) => amp * Math.sin(2 * Math.PI * (u * cycles + phase)), Math.max(48, cycles * 12));

/* The plan goes over first, a section at a time; then the code is hammered
   in; then the tick comes back. */
const SEND = [0.3, 0.72, 1.14];
const SEND_DUR = 0.5;
const FIRST = 1.75;
const GAP = 0.58;
const HITS = LINES.map((_, i) => FIRST + i * GAP);
const LAST = HITS[HITS.length - 1];
/* The lines clear together near the end, and the next take starts clean. */
const CLEAR: [number, number] = [6.9, 7.3];
const BACK = LAST + 0.08;
const TICK = BACK + SEND_DUR;

// ---- The scene ------------------------------------------------------------------

export const build = character('build', { viewBox: [0, 0, W, H], duration: D, ground: H - 4 }, () => {
  definitions();

  // The Nootles page.
  part('page', { pivot: [C.x + C.w / 2, C.y + C.h / 2] }, () => {
    rect({ x: C.x, y: C.y, w: C.w, h: C.h, radius: C.r, fill: '#ffffff', stroke: LINE_GREY, width: 1.5 });
    part('mark', { pivot: [0, 0], transform: { x: C.x + 16, y: C.y + 15, scaleX: 0.3, scaleY: 0.3 } }, () => {
      MARK.forEach((d) => path({ d, fill: PAGE_INK }));
    });
    sans('Checkout Flow', PAGE_INK, C.x + 40, C.y + 15, 19, true);
    SECTIONS.forEach((label, i) => {
      const y = ROW0 + i * ROW_STEP;
      part(`glow${i}`, { pivot: [C.x + C.w / 2, y + 10] }, () => {
        rect({ x: C.x + 8, y: y - 6, w: C.w - 16, h: 32, radius: 8, fill: '#eaf1ff' });
      });
      part(`icon${i}`, { pivot: [C.x + 24, y + 10] }, () => {
        if (i === 0) [0, 6, 12].forEach((dy) => line({ from: [C.x + 18, y + 4 + dy], to: [C.x + (dy === 12 ? 26 : 32), y + 4 + dy], stroke: PAGE_DIM, width: 2 }));
        if (i === 1) {
          rect({ x: C.x + 17, y: y + 3, w: 7, h: 7, radius: 1.5, stroke: PAGE_DIM, width: 1.8 });
          rect({ x: C.x + 26, y: y + 11, w: 7, h: 7, radius: 1.5, stroke: PAGE_DIM, width: 1.8 });
          line({ from: [C.x + 20.5, y + 10], to: [C.x + 20.5, y + 14.5], stroke: PAGE_DIM, width: 1.8 });
          line({ from: [C.x + 20.5, y + 14.5], to: [C.x + 26, y + 14.5], stroke: PAGE_DIM, width: 1.8 });
        }
        if (i === 2) rect({ x: C.x + 19, y: y + 1, w: 11, h: 19, radius: 2.5, stroke: PAGE_DIM, width: 1.8 });
      });
      sans(label, PAGE_INK, C.x + 44, y + 1, 16);
    });
    line({ from: [C.x + 14, TODO_Y - 14], to: [C.x + C.w - 14, TODO_Y - 14], stroke: LINE_GREY, width: 1.5, cap: 'butt' });
    rect({ x: C.x + 18, y: TODO_Y + 2, w: 16, h: 16, radius: 4, fill: '#ffffff', stroke: '#b9bfc6', width: 1.6 });
    part('tick', { pivot: [C.x + 26, TODO_Y + 10] }, () => {
      rect({ x: C.x + 18, y: TODO_Y + 2, w: 16, h: 16, radius: 4, fill: PAGE_INK });
      path({ d: `M${C.x + 21.5} ${TODO_Y + 10.5} L${C.x + 24.8} ${TODO_Y + 13.6} L${C.x + 30.5} ${TODO_Y + 6.8}`, stroke: '#ffffff', width: 2 });
    });
    part('todo', { pivot: [C.x + 44, TODO_Y + 10] }, () => sans('Build checkout', PAGE_INK, C.x + 44, TODO_Y + 1, 16));
  });

  // The MCP pipe, and what travels along it.
  line({ from: [WIRE[0], WIRE_Y], to: [WIRE[1], WIRE_Y], stroke: '#c3c9cf', width: 2, cap: 'butt' });
  circle({ cx: WIRE[0], cy: WIRE_Y, r: 4, fill: '#9aa1a8' });
  circle({ cx: WIRE[1], cy: WIRE_Y, r: 4, fill: '#9aa1a8' });
  {
    const label = 'MCP';
    const r = textPath(label, SANS_BOLD, 0, 0, 13);
    sans(label, '#6b7178', (WIRE[0] + WIRE[1]) / 2 - r.width / 2, WIRE_Y - 30, 13, true);
  }
  CHIPS.forEach((label, i) => {
    part(`chip${i}`, { pivot: [WIRE[0] + 4 + CHIP_W / 2, WIRE_Y] }, () => {
      rect({ x: WIRE[0] + 4, y: WIRE_Y - 11, w: CHIP_W, h: 22, radius: 11, fill: '#ffffff', stroke: '#c9d5ee', width: 1.5 });
      const r = textPath(label, SANS_BOLD, 0, 0, 12);
      sans(label, '#3d5a9e', WIRE[0] + 4 + CHIP_W / 2 - r.width / 2, WIRE_Y - 8, 12, true);
    });
  });
  part('back', { pivot: [WIRE[1] - 4 - 13, WIRE_Y] }, () => {
    circle({ cx: WIRE[1] - 4 - 13, cy: WIRE_Y, r: 13, fill: '#16181a' });
    path({ d: `M${WIRE[1] - 23} ${WIRE_Y} L${WIRE[1] - 19} ${WIRE_Y + 4} L${WIRE[1] - 11.5} ${WIRE_Y - 4.5}`, stroke: GREEN, width: 2.4 });
  });

  // The terminal.
  part('terminal', { pivot: [T.x + T.w / 2, T.y + T.h / 2] }, () => {
    rect({ x: T.x, y: T.y, w: T.w, h: T.h, radius: T.r, fill: '#17191c' });
    line({ from: [T.x, T.y + 44], to: [T.x + T.w, T.y + 44], stroke: '#2b2f34', width: 2, cap: 'butt' });
    part('claudeMark', { pivot: [0, 0], transform: { x: T.x + 17, y: T.y + 13, scaleX: 0.75, scaleY: 0.75 } }, () => {
      path({ d: CLAUDE.d, fill: CLAUDE.hex });
    });
    setLine([['Claude Code', '#aeb4ba', true]], T.x + 43, T.y + 13, 17);
    LINES.forEach((runs, i) => {
      part(`line${i}`, { pivot: [T.x + 18, LINE0 + i * STEP] }, () => setLine(runs, T.x + 18, LINE0 + i * STEP, SIZE));
    });
  });

  // The developer.
  part('dev', { pivot: DEV_C, transform: { x: DEV_AT.x, y: DEV_AT.y, scaleX: DEV_AT.scale, scaleY: DEV_AT.scale } }, () => {
    part('flip', { pivot: DEV_C, transform: { scaleX: -1 } }, () => {
      part('armUpBack', { pivot: [601, 1917] }, () => draw(AL[0]));
      part('legs', { pivot: [620, 2039] }, () => [1, 2, 3, 4].forEach((i) => draw(AL[i])));
      part('armUp', { pivot: [601, 1917] }, () => [5, 6].forEach((i) => draw(AL[i])));
      part('armDown', { pivot: [656, 1893] }, () => draw(AL[7]));
      part('antL', { pivot: [624, 1840] }, () => [8, 9, 10].forEach((i) => draw(AL[i])));
      part('body', { pivot: [620, 2000] }, () => draw(AL[11]));
      part('eyes', { pivot: [599, 1863] }, () => [12, 13].forEach((i) => draw(AL[i])));
      part('antR', { pivot: [645, 1846] }, () => [14, 15, 16].forEach((i) => draw(AL[i])));
      draw(AL[17]);
      part('hammer', { pivot: [601, 1917] }, () => [18, 19, 20, 21].forEach((i) => draw(AL[i])));
      [22, 23, 24].forEach((i) => draw(AL[i]));
    });
  });
});

// ---- Choreography ---------------------------------------------------------------

const P = (p: string) => build.part(p);

// Each line lands on its blow: drops in from just above with a little give,
// and they all clear together before the next take.
HITS.forEach((h, i) => {
  P(`terminal.line${i}`).animate({
    opacity: at([[0, 0], [h - 0.05, 0], [h - 0.03, 1], [CLEAR[0], 1, easeIn], [CLEAR[1], 0]]),
    y: at([[0, -10], [h - 0.05, -10, easeIn], [h, 0, easeOut], [h + 0.05, 2, easeInOut], [h + 0.14, 0], [D - 0.01, 0]]),
  });
});
// The plan goes over the pipe a section at a time: each section lights on the
// page as it leaves, and its chip travels into the terminal.
SEND.forEach((t, i) => {
  P(`chip${i}`).animate({
    opacity: at([[0, 0], [t, 0, easeOut], [t + 0.08, 1], [t + SEND_DUR - 0.1, 1, easeIn], [t + SEND_DUR, 0]]),
    x: at([[0, 0], [t, 0, cubicBezier(0.45, 0, 0.25, 1)], [t + SEND_DUR, CHIP_TRAVEL], [D - 0.01, CHIP_TRAVEL]]),
  });
  P(`page.glow${i}`).animate({
    opacity: at([[0, 0], [t - 0.05, 0, easeOut], [t + 0.08, 1], [t + 0.5, 1, easeInOut], [t + 0.9, 0]]),
  });
});
// The tick comes back from the agent and lands on the page's to-do.
P('back').animate({
  opacity: at([[0, 0], [BACK, 0, easeOut], [BACK + 0.08, 1], [TICK - 0.08, 1, easeIn], [TICK, 0]]),
  x: at([[0, 0], [BACK, 0, cubicBezier(0.45, 0, 0.25, 1)], [TICK, -CHIP_TRAVEL], [D - 0.01, -CHIP_TRAVEL]]),
});
P('page.tick').animate({
  opacity: at([[0, 0], [TICK, 0, easeOut], [TICK + 0.12, 1], [CLEAR[0], 1, easeIn], [CLEAR[1], 0]]),
  scaleX: at([[0, 0.6], [TICK, 0.6, cubicBezier(0.3, 1.5, 0.5, 1)], [TICK + 0.3, 1], [D - 0.01, 1]]),
  scaleY: at([[0, 0.6], [TICK, 0.6, cubicBezier(0.3, 1.5, 0.5, 1)], [TICK + 0.3, 1], [D - 0.01, 1]]),
});
P('page.todo').animate({
  opacity: at([[0, 1], [TICK + 0.1, 1, easeOut], [TICK + 0.3, 0.45], [CLEAR[0], 0.45, easeIn], [CLEAR[1], 1]]),
});
// The terminal takes each blow.
{
  const jolt: Key[] = [[0, 0]];
  for (const h of HITS) jolt.push([h - 0.01, 0, easeOut], [h + 0.04, 2.5, easeInOut], [h + 0.12, -0.6, easeInOut], [h + 0.2, 0]);
  P('terminal').animate({ y: at(jolt) });
}
// Wind up, strike, recoil — once per blow — then rest the hammer and lower it
// before the next take.
{
  const blows: Key[] = [[0, 0], [FIRST - 0.55, 0, easeOut]];
  for (const h of HITS) blows.push([h - 0.22, -30, cubicBezier(0.6, 0, 1, 0.5)], [h, 8, easeOut], [h + 0.08, 3, easeInOut]);
  blows.push([LAST + 0.4, -36, easeInOut], [LAST + 0.8, -30, easeInOut], [D - 0.6, -30, easeInOut], [D - 0.05, 0]);
  const swing = at(blows);
  for (const p of ['dev.flip.armUp', 'dev.flip.armUpBack', 'dev.flip.hammer']) P(p).animate({ rotate: swing });
}
// A wince on every blow, and blinks while he waits.
{
  const wince: Key[] = [[0, 1]];
  for (const h of HITS) wince.push([h - 0.02, 1, easeOut], [h + 0.05, 0.45, easeIn], [h + 0.2, 1]);
  for (const b of [5.9, 7.4]) wince.push([b, 1, easeIn], [b + 0.07, 0.08, easeOut], [b + 0.16, 1]);
  P('dev.flip.eyes').animate({ scaleY: at(wince) });
}
P('dev.flip.armDown').animate({
  rotate: at([[0, 0], [FIRST - 0.5, 0, easeInOut], [FIRST - 0.2, 6, easeInOut], [LAST + 0.5, 6, easeInOut], [LAST + 0.9, 0]]),
});
P('dev.flip.antL').animate({ rotate: wobble(7, 9) });
P('dev.flip.antR').animate({ rotate: wobble(7, 8, 0.5) });
// Breathing: a slow, small rise and fall, two to the take.
P('dev.flip.body').animate({ scaleY: sampled((u) => 1 + 0.012 * Math.sin(2 * Math.PI * 2 * u), 64) });

export default build;
