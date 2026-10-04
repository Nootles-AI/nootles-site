"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SHEET, WIDE } from "./appWindow";

/* The app is drawn at its real size, a 1440 × 900 window, and shrunk to fit:
   one uniform scale, so it reads as a screenshot rather than a reflowed page.
   Narrower than this, the rails would be too small to read, so the window
   drops them and shows the sheet alone (880 wide: the same sheet, its margin
   all round). */
const BELOW = 760;

/** Scales its children, authored at the app's own pixel size, to its width.
    The scale is written straight to the element as `--k`, so a resize is a
    style change, never a render. */
export function AppScale({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const narrow = w < BELOW;
      el.toggleAttribute("data-narrow", narrow);
      el.style.setProperty("--k", String(w / (narrow ? SHEET : WIDE)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="ap-fit">
      <div className="ap-win">{children}</div>
    </div>
  );
}

/** One take of the window — the autocomplete, then the ask and the agent's
    edit — played on a loop while it is on screen. Its CSS animations wait,
    paused, until it is scrolled into view; each loop remounts the take so
    every animation starts again from its first frame. Scrolled away, it
    pauses, and coming back starts a fresh take. With reduced motion it never
    loops: the stylesheet shows the kept end. */
export function AppLoop({
  total,
  className,
  style,
  children,
}: {
  /** One loop's length, in ms. */
  total: number;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [take, setTake] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let played = false;

    const next = () => {
      timer = window.setTimeout(() => {
        setTake((n) => n + 1);
        next();
      }, total);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        timer = undefined;
        if (!entry.isIntersecting || still.matches) {
          setOn(false);
          return;
        }
        // Back on screen after a take was cut short: start a clean one.
        if (played) setTake((n) => n + 1);
        played = true;
        setOn(true);
        next();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [total]);

  return (
    <div ref={ref} className={`${className}${on ? " is-on" : ""}`} style={style}>
      <Fragment key={take}>{children}</Fragment>
    </div>
  );
}
