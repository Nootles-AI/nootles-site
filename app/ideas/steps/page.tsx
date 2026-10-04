import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import {
  DragDock,
  PasteUnfurl,
  PullIn,
  SlashImport,
  STEP1,
  StepBox,
  WiredIn,
} from "@/components/ideas/steps/Step1";
import { EnrichRow } from "@/components/ideas/steps/EnrichRow";
import { LoopingGraph } from "@/components/ideas/steps/LoopingGraph";
import { STEP2, TeamDoc } from "@/components/ideas/steps/Step2";
import { BuildMcp, STEP3 } from "@/components/ideas/steps/Step3";
import "./steps.css";

const face = Bricolage_Grotesque({ subsets: ["latin"], variable: "--st-face" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--st-mono" });

const ideas: { name: string; note: string; visual: ReactNode }[] = [
  {
    name: "Pull-in",
    note: "The six sources ring a small canvas; each sends a piece of work in, and it lands as a card.",
    visual: <PullIn />,
  },
  {
    name: "Drag from the dock",
    note: "The PM drags an issue out of Linear, a frame out of Figma and a PR out of GitHub onto the board — the hero's own mechanics.",
    visual: <DragDock />,
  },
  {
    name: "Paste & unfurl",
    note: "A link is pasted onto the canvas and opens into what it points at, cycling through every source.",
    visual: <PasteUnfurl />,
  },
  {
    name: "Slash import",
    note: "Someone types /import, the six sources come up, they pick Figma, and the frame lands in place.",
    visual: <SlashImport />,
  },
  {
    name: "Wired in — chosen",
    note: "The calmest: a diagram in the canvas's own language, six sources wired into the project's context with light along the wires.",
    visual: <WiredIn />,
  },
];

export default function Page() {
  return (
    <main className={`ic-root st ${face.variable} ${mono.variable}`}>
      <div className="st-page">
        <h1 className="st-h">Step 1 — five ideas</h1>
        <p className="st-sub">
          Each idea is shown as the first of the three boxes, at real size. Steps 2 and 3 are placeholders.
        </p>
        <section className="st-idea is-first">
          <h2 className="st-idea-name">
            <span>2</span>
            Section 2 so far
          </h2>
          <p className="st-idea-note">
            Step 1 is the chosen graph; Step 2 is the team planning one document, from the app&rsquo;s own
            &ldquo;Upgrade to Pro&rdquo; picture; Step 3 is the developer and his agent building it over MCP,
            animated in Heron.
          </p>
          <div className="st-row">
            <StepBox n={1} title={STEP1.title} line={STEP1.line}>
              <LoopingGraph />
            </StepBox>
            <StepBox n={2} title={STEP2.title} line={STEP2.line}>
              <TeamDoc />
            </StepBox>
            <StepBox n={3} title={STEP3.title} line={STEP3.line}>
              <BuildMcp />
            </StepBox>
          </div>
        </section>
        <section className="st-idea">
          <h2 className="st-idea-name">
            <span>5</span>
            Wired in — three ways to show the agent getting richer
          </h2>
          <p className="st-idea-note">
            The chosen diagram, with context shown as content rather than colour. Each plays once; use Replay.
          </p>
          <EnrichRow />
        </section>
        {ideas.map((idea, i) => (
          <section key={idea.name} className="st-idea">
            <h2 className="st-idea-name">
              <span>{i + 1}</span>
              {idea.name}
            </h2>
            <p className="st-idea-note">{idea.note}</p>
            <div className="st-row">
              <StepBox n={1} title={STEP1.title} line={STEP1.line}>
                {idea.visual}
              </StepBox>
              <StepBox n={2} title="Step two" line="To come." muted />
              <StepBox n={3} title="Step three" line="To come." muted />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
