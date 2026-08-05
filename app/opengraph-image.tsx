import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/* The picture that lands in an iMessage bubble or a Slack unfurl. It is the
   same drawing sheet the site is built on, because the one thing a link preview
   has to do is look like the place it goes.

   Two things are deliberately not the site's own values:

   - The grid is printed stronger here (#dde9da rather than the page's #eef5ed)
     and ruled every 60px rather than every 100. A preview is looked at small,
     and only the margin around the sheet is left to carry the graph paper; at
     the page's own weight and spacing that margin reads as blank.
   - The 20px fine grid is left out. A 1px line every 20px in a 1200px image
     shown at a third of that size is not a texture, it is moiré.

   Satori renders this, so: flexbox only, no grid, hex colours rather than
   oklch, and every element with children needs an explicit display. */

export const alt =
  "A Nootles drawing sheet on gridded paper, reading “Think on the page.”";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f7f9f7";
const SHEET = "#ffffff";
const INK = "#1a1b19";
const INK_2 = "#595c58";
const RULE = "#ccd1cb";
const FRAME = "#4b4e4b";
const GRID = "#dde9da";
const BRAND = "#718568";

/* Drawn as elements rather than as a repeating background: Satori's support for
   multiple backgrounds with their own sizes is not something to find out about
   from a broken unfurl. Thirty-odd divs is a cheaper certainty. */
function grid() {
  const lines = [];
  for (let x = 60; x < size.width; x += 60) {
    lines.push(
      <div
        key={`v${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 1,
          height: size.height,
          background: GRID,
        }}
      />,
    );
  }
  for (let y = 60; y < size.height; y += 60) {
    lines.push(
      <div
        key={`h${y}`}
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: size.width,
          height: 1,
          background: GRID,
        }}
      />,
    );
  }
  return lines;
}

const blocks = [
  { label: "Surface", value: "nootles.com", grow: true },
  { label: "Blocks", value: "Text · Canvas · Code · Maths", grow: false },
  { label: "Sheet", value: "01 / 08", grow: false },
];

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/overpass-regular.ttf")),
    readFile(join(process.cwd(), "app/fonts/overpass-bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: PAPER,
          fontFamily: "Overpass",
        }}
      >
        {grid()}

        {/* The sheet: a heavy trim line with a lighter frame line inside it,
            exactly as on the page. */}
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 84,
            width: 1008,
            height: 462,
            display: "flex",
            flexDirection: "column",
            background: SHEET,
            border: `1px solid ${FRAME}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              margin: "9px 9px 0",
              padding: "56px 60px",
              border: `1px solid ${RULE}`,
              borderBottom: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: BRAND,
              }}
            >
              {site.name}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 34,
                fontSize: 92,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: INK,
              }}
            >
              {site.tagline}.
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 26,
                maxWidth: 780,
                fontSize: 27,
                lineHeight: 1.45,
                color: INK_2,
              }}
            >
              Prose, diagrams, code, maths and tables in one document — and an AI
              that reads and edits all of it.
            </div>
          </div>

          {/* The title block, stamped across the foot like every other sheet. */}
          <div
            style={{
              display: "flex",
              margin: "0 9px 9px",
              border: `1px solid ${RULE}`,
            }}
          >
            {blocks.map((b, i) => (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flexGrow: b.grow ? 1 : 0,
                  padding: "14px 22px",
                  borderLeft: i === 0 ? "none" : `1px solid ${RULE}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 15,
                    letterSpacing: "0.09em",
                    color: INK_2,
                  }}
                >
                  {b.label.toUpperCase()}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 6,
                    fontSize: 19,
                    color: INK,
                  }}
                >
                  {b.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Overpass", data: regular, weight: 400, style: "normal" },
        { name: "Overpass", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
