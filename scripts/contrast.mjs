/* Contrast check for the site palette.
   Every text/background pair the design actually produces, measured rather than
   eyeballed. Run: node scripts/contrast.mjs */

const oklchToLinearSrgb = (L, C, Hdeg) => {
  const h = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

// WCAG relative luminance is defined on linearised sRGB, which is what we have.
const luminance = ([r, g, b]) => {
  const c = (v) => Math.min(1, Math.max(0, v));
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};

const hex = (lin) => {
  const enc = (v) => {
    const c = Math.min(1, Math.max(0, v));
    const s = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(s * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${lin.map(enc).join("")}`;
};

const clipping = ([r, g, b]) =>
  [r, g, b].some((v) => v < -0.0005 || v > 1.0005);

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const T = {
  // The ground: drafting stock with a grid printed on it, and the white sheets
  // that lie on top of it.
  paper: [0.981, 0.004, 140],
  sheet: [1, 0, 0],
  sunken: [0.968, 0.004, 140],

  // The printed grid. Non-text: it needs only to be felt.
  grid: [0.962, 0.012, 140],
  gridMajor: [0.934, 0.017, 140],

  // Ink. One ramp, because everything now sits on paper or on a sheet.
  ink: [0.22, 0.004, 140],
  ink2: [0.47, 0.006, 140], // secondary text
  ink3: [0.65, 0.008, 140], // non-text only: ticks, markers, arrowheads

  // Drawn lines.
  rule: [0.855, 0.009, 140],
  ruleStrong: [0.72, 0.011, 140],
  frame: [0.42, 0.006, 140],

  // Identity: the app's mark, verbatim.
  brand: [0.592, 0.049, 136],

  // Meaning: the model at work, and nothing else.
  accent: [0.542, 0.145, 75],
  accentSoft: [0.716, 0.116, 75],

  // Changes waiting to be answered.
  diffAdd: [0.5, 0.098, 148],
  diffAddBg: [0.958, 0.026, 148],
  diffDel: [0.52, 0.118, 25],
  diffDelBg: [0.955, 0.021, 25],

  // Canvas.
  shapeLine: [0.79, 0.006, 140],
  edgeLine: [0.66, 0.007, 140],
};

const rgb = Object.fromEntries(
  Object.entries(T).map(([k, v]) => [k, oklchToLinearSrgb(...v)]),
);

console.log("── tokens ─────────────────────────────────");
for (const [k, v] of Object.entries(T)) {
  const g = clipping(rgb[k]) ? " ~" : "  ";
  console.log(`${g} ${k.padEnd(13)} oklch(${v.join(" ")})`.padEnd(46), hex(rgb[k]));
}

/* [foreground, background, minimum required, what it is, optional maximum]

   Almost everything here only has a floor: text cannot be too legible. The
   printed grid is the exception and has both. It failed once by being too
   strong — a 20px lattice at 1.14:1 with a 100px lattice at 1.31:1 over it read
   as a graphic competing with the page rather than as the ground under it, and
   nothing in this file objected because contrast checkers only ever look down.
   The ceiling is the other half of that judgement, written down. */
const pairs = [
  // Text on the gridded ground. The claim and the legend are written straight
  // onto the paper, so this is the pair the hero lives or dies on.
  ["ink", "paper", 4.5, "the claim + body on the paper"],
  ["ink2", "paper", 4.5, "secondary copy on the paper"],
  // Worst case for anything written on the paper: it lands on a major grid
  // line rather than between two. Measured because it is where the type
  // actually sits, not where it would be convenient to measure it.
  ["ink", "gridMajor", 4.5, "the claim where it crosses a printed grid line"],
  ["ink2", "gridMajor", 4.5, "secondary copy crossing a grid line"],

  // Text on a sheet.
  ["ink", "sheet", 4.5, "document text on a sheet"],
  ["ink2", "sheet", 4.5, "document secondary on a sheet"],
  ["ink2", "sunken", 4.5, "code and wells on a sheet"],
  ["sheet", "ink", 4.5, "the CTA: white on graphite"],
  ["sheet", "frame", 4.5, "reversed out of a frame line"],

  // Identity. A mark, so 3:1 — and it is never allowed to carry a sentence.
  ["brand", "paper", 3, "the mark on the paper (mark, not text)"],
  ["brand", "sheet", 3, "the mark on a sheet (mark, not text)"],

  // Meaning.
  ["accent", "sheet", 4.5, "the model at work, on a sheet"],
  // The graphical object here is the caret bar, drawn in --accent and measured
  // on the line above. --accent-soft is only ever the halo bled around it via
  // box-shadow, so 1.4.11 does not reach it. Listed to keep it in view.
  ["accentSoft", "sheet", 1, "the streaming glow (decoration around the bar)"],

  // Changes under review. Both are real text on their own tint.
  ["diffAdd", "diffAddBg", 4.5, "an inserted line"],
  ["diffDel", "diffDelBg", 4.5, "a struck-through line"],

  // Lines and marks. These carry no text, so they need only to be visible —
  // except the grid, which has type sitting directly on top of it and is
  // therefore held to being faint rather than merely seen.
  ["grid", "paper", 1.03, "the fine printed grid", 1.09],
  ["gridMajor", "paper", 1.1, "the heavier fifth grid line", 1.2],
  ["rule", "paper", 1.15, "a construction line on the paper"],
  ["rule", "sheet", 1.2, "a frame line on a sheet"],
  ["ruleStrong", "sheet", 1.8, "a heavier rule on a sheet"],
  ["frame", "paper", 3, "the sheet's trim line"],
  ["ink3", "paper", 3, "dimension ticks and figures (graphical)"],
  ["shapeLine", "sheet", 1.5, "a shape outline on the canvas"],
  ["edgeLine", "sheet", 2.5, "a connector on the canvas"],
];

console.log("\n── pairs ──────────────────────────────────");
let failed = 0;
for (const [fg, bg, min, what, max] of pairs) {
  const r = ratio(rgb[fg], rgb[bg]);
  const under = r < min;
  const over = max !== undefined && r > max;
  if (under || over) failed++;
  const bound = max !== undefined ? `${min}–${max}` : `min ${min}`;
  const verdict = under ? "FAINT" : over ? "LOUD" : "PASS";
  console.log(
    `${verdict.padEnd(5)} ${r.toFixed(2).padStart(6)}:1  (${bound.padEnd(8)})  ${what}`,
  );
}

// Reported, not failed. These sit a hair past the sRGB boundary and the browser
// gamut-maps them; the ratios above are measured on the clamped result, which is
// what actually paints. --accent is the app's own token and stays as shipped.
const clipped = Object.entries(T).filter(([k]) => clipping(rgb[k]));
if (clipped.length) {
  console.log(
    `\nnote: gamut-mapped by the browser — ${clipped.map(([k]) => k).join(", ")}`,
  );
}

console.log(failed ? `\n${failed} problem(s).` : "\nAll pairs clear.");
process.exit(failed ? 1 : 0);
