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
  // The environment: a sage desk. Hue 140, a touch cooler and greener than the
  // mark so the mark still reads as the saturated thing on it.
  field: [0.935, 0.028, 140],
  fieldDeep: [0.885, 0.04, 140],
  fieldEdge: [0.845, 0.045, 140],

  // Paper. The sheets are the product's own surface, so these are the app's
  // values verbatim.
  paper: [1, 0, 90],
  paperSunken: [0.975, 0.002, 90],

  // Ink.
  ink: [0.25, 0.005, 90],
  inkSoft: [0.43, 0.032, 140], // secondary text ON SAGE: the field's own hue
  inkFaint: [0.55, 0.03, 140], // non-text only
  paperMuted: [0.535, 0.004, 90], // the app's muted, only ever on paper

  // Identity.
  brand: [0.592, 0.049, 136],
  brandInk: [0.44, 0.058, 138],

  // Meaning: AI activity, and nothing else.
  accent: [0.542, 0.145, 75],
  accentSoft: [0.716, 0.116, 75],

  // Lines.
  paperBorder: [0.93, 0.003, 90],
  fieldRule: [0.855, 0.036, 140],
};

const rgb = Object.fromEntries(
  Object.entries(T).map(([k, v]) => [k, oklchToLinearSrgb(...v)]),
);

console.log("── tokens ─────────────────────────────────");
for (const [k, v] of Object.entries(T)) {
  const g = clipping(rgb[k]) ? " ~" : "  ";
  console.log(`${g} ${k.padEnd(13)} oklch(${v.join(" ")})`.padEnd(46), hex(rgb[k]));
}

// [foreground, background, minimum required, what it is]
const pairs = [
  ["ink", "field", 4.5, "headline + body on the sage field"],
  ["inkSoft", "field", 4.5, "secondary copy on the sage field"],
  ["ink", "fieldDeep", 4.5, "text on the deeper sage band"],
  ["inkSoft", "fieldDeep", 4.5, "secondary on the deeper sage band"],
  ["ink", "paper", 4.5, "document text on paper"],
  ["paperMuted", "paper", 4.5, "document secondary on paper"],
  ["paperMuted", "paperSunken", 4.5, "document secondary in a well"],
  ["paper", "ink", 4.5, "the CTA: paper on graphite"],
  ["brand", "field", 3, "the mark on the field (mark, not text)"],
  ["brand", "paper", 3, "the mark on paper (mark, not text)"],
  ["brandInk", "field", 4.5, "brand-toned text on the field"],
  ["accent", "paper", 4.5, "AI activity on paper"],
  // The graphical object here is the caret bar, drawn in --accent and measured
  // on the line above. --accent-soft is only ever the halo bled around it via
  // box-shadow, so 1.4.11 does not reach it. Listed to keep it in view.
  ["accentSoft", "paper", 1, "the streaming glow (decoration around the bar)"],
  ["fieldRule", "field", 1.2, "hairline on the field (needs only to be seen)"],
  ["paperBorder", "paper", 1.05, "hairline on paper"],
];

console.log("\n── pairs ──────────────────────────────────");
let failed = 0;
for (const [fg, bg, min, what] of pairs) {
  const r = ratio(rgb[fg], rgb[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(6)}:1  (min ${String(min).padEnd(4)})  ${what}`,
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
