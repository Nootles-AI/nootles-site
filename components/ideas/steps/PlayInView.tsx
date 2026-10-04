"use client";

/* Holds a step's picture back until the step is scrolled into view, so its
   animation starts where someone can watch it rather than on page load. The
   picture isn't mounted until then — an animated SVG image starts its clock
   when it loads — and a box of the same height stands in for it, so nothing
   moves when it arrives. */
import { useEffect, useRef, useState, type ReactNode } from "react";

export function PlayInView({ height, children }: { height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ minHeight: height }}>
      {on ? children : null}
    </div>
  );
}
