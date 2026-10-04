/* Step 3 of the second section: build. The developer at work beside his
   coding agent, which reads the plan from Nootles over MCP, writes the code,
   and ticks the task off back on the page — each line hammered home on a
   blow. Rigged and animated in Heron (`scripts/build-art/build.scene.ts`)
   from the app's own vector art for the developer, compiled to a
   self-contained animated SVG on an 8s loop. */
export const STEP3 = {
  title: "Build",
  line: "Your coding agent reads the plan through the Nootles MCP, builds it, and checks it off as it goes.",
};

export function BuildMcp() {
  return (
    <div className="st-v st3-build">
      {/* An animated SVG, which next/image would rasterise. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="st3-art" src="/hero/build-mcp.svg" width={656} height={480} alt="" draggable={false} />
    </div>
  );
}
