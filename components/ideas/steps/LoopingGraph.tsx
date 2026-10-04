"use client";

/* The context graph on a loop, like the section's other two pictures. The
   graph is authored as a one-way build (every part has its own delay), so
   rather than re-time it into a cycle it is simply replayed: it builds, holds
   the finished graph, fades, and builds again. Under reduced motion it shows
   the finished graph and stays. */
import { useEffect, useState } from "react";
import { EnrichGraph } from "@/components/ideas/steps/Enrich";

const CYCLE = 11000;
const FADE = 600;

export function LoopingGraph() {
  const [run, setRun] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fade = setTimeout(() => setLeaving(true), CYCLE - FADE);
    const next = setTimeout(() => {
      setLeaving(false);
      setRun((n) => n + 1);
    }, CYCLE);
    return () => {
      clearTimeout(fade);
      clearTimeout(next);
    };
  }, [run]);

  return (
    <div className={`st-loop${leaving ? " is-leaving" : ""}`} key={run}>
      <EnrichGraph />
    </div>
  );
}
