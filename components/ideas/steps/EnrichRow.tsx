"use client";

/* The three enrichment options side by side, each in a full Step 1 box.
   They play once, as they would on the page; Replay remounts the row. */
import { useState } from "react";
import { EnrichGraph, EnrichRings, EnrichTokens } from "@/components/ideas/steps/Enrich";
import { STEP1, StepBox } from "@/components/ideas/steps/Step1";

export function EnrichRow() {
  const [run, setRun] = useState(0);
  return (
    <>
      <div className="st-row" key={run}>
        <StepBox n={1} title={STEP1.title} line={STEP1.line}>
          <EnrichTokens />
        </StepBox>
        <StepBox n={1} title={STEP1.title} line={STEP1.line}>
          <EnrichRings />
        </StepBox>
        <StepBox n={1} title={STEP1.title} line={STEP1.line}>
          <EnrichGraph />
        </StepBox>
      </div>
      <div className="en-under">
        <span>A · Tokens, deck and answer</span>
        <span>B · Rings</span>
        <span>C · Memory graph</span>
      </div>
      <button type="button" className="en-replay" onClick={() => setRun((n) => n + 1)}>
        Replay
      </button>
    </>
  );
}
