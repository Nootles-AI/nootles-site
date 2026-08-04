/* One CSS invariant, checked because getting it wrong is silent.

   A custom property that gets multiplied by a length (`calc(600px * var(--x))`)
   or handed to `transform: scale(var(--x))` MUST be unitless. If it resolves to
   a length, the multiplication produces px² — not a value — so the browser
   drops the whole declaration and the element collapses to nothing.

   Nothing else catches this. It is valid syntax, Lightning CSS compiles it
   happily, `next build` passes, TypeScript has no opinion, and the page ships
   broken. It shipped once already:

       --fit: calc((100vw - 2 * var(--gutter)) / 600);   <- a LENGTH, not a ratio
       --page-scale: min(0.78, var(--fit));              <- now a length
       width: calc(600px * var(--page-scale));           <- px², dropped

   Dividing a length by a number gives a length. It reads like a ratio and is
   not one, which is exactly why it got past review.

   The rule enforced here: a scalar property, and every property it reaches
   through var(), must contain no length unit anywhere.

   Run: node scripts/css.mjs */

import { readFileSync } from "node:fs";

const FILE = "app/globals.css";
const css = readFileSync(FILE, "utf8");
const problems = [];

/* Read the scalars off the stylesheet rather than keeping a list by hand, so a
   new one is covered the moment someone writes it. */
const scalars = new Set();
for (const m of css.matchAll(/calc\([^)]*?[\d.]+px\s*\*\s*var\(\s*(--[\w-]+)/g)) {
  scalars.add(m[1]);
}
for (const m of css.matchAll(/\bscale\(\s*var\(\s*(--[\w-]+)/g)) {
  scalars.add(m[1]);
}

const declarationsOf = (prop) =>
  [...css.matchAll(new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, "g"))].map(
    (m) => m[1].trim(),
  );

// Any number immediately followed by a CSS unit. `600` is fine; `600px` is not.
const LENGTH = /[\d.]\s*(px|r?em|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc|%)\b/i;

function check(prop, chain, seen) {
  if (seen.has(prop)) return; // a cycle is someone else's bug
  seen.add(prop);

  const declarations = declarationsOf(prop);
  if (!declarations.length) {
    problems.push(`${chain} — ${prop} is used as a scalar but never declared`);
    return;
  }

  for (const value of declarations) {
    const unit = value.match(LENGTH);
    if (unit) {
      problems.push(
        `${chain}\n      ${prop}: ${value}\n` +
          `      -> contains the length unit "${unit[1]}"\n` +
          `      -> this property is multiplied by a length, so it must be unitless`,
      );
    }
    for (const ref of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      check(ref[1], `${chain} -> ${ref[1]}`, seen);
    }
  }
}

for (const prop of scalars) check(prop, prop, new Set());

if (!scalars.size) {
  console.log("no scalar custom properties in use — nothing to check");
  process.exit(0);
}

if (problems.length) {
  console.log(`${FILE}: ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(`  ${p}\n`);
  process.exit(1);
}

console.log(`${[...scalars].join(", ")} — unitless through every reference.`);
