/* Step 2 of the second section: plan and design, together (Step 3 builds). The visual
   is the app's own "Pro" picture — the team building one Nootles document,
   rigged and animated in Heron (see the app's `components/ProLift.tsx` and
   `scripts/pro-art/team.scene.ts`). It is a self-contained animated SVG on a
   7.9s loop, copied from the app's `public/pro/team-doc.svg` on origin/main.
   Fitted, never cropped: the characters work at its edges, and a cut-off one
   reads as a mistake. */
export const STEP2 = {
  title: "Plan and design",
  line: "Together with your team and the Nootles agent, all on one canvas.",
};

export function TeamDoc() {
  return (
    <div className="st-v st2-team">
      {/* An animated SVG, which next/image would rasterise. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="st2-art" src="/hero/team-doc.svg" alt="" draggable={false} />
    </div>
  );
}
