"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

/* How long a finished take holds before a hovered tile plays it again. */
const REST = 900;

/** An article whose CSS animations wait, paused, until it is first scrolled
    into view, then play once. After that, hovering plays it again from the
    top, and keeps replaying while the pointer stays; leaving lets the current
    take finish. Without JS it stays on its first frame. */
export function InView({
  className,
  d0,
  total,
  children,
}: {
  className: string;
  /** The tile's first-play offset, in ms. Replays start at once. */
  d0: number;
  /** One take's length, in ms. */
  total: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [take, setTake] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let hovered = false;
    let busyUntil = Infinity;
    let timer: number | undefined;

    /* When the current take ends, play another if the pointer is still here. */
    const queue = (wait: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        if (hovered) replay();
      }, wait);
    };
    const replay = () => {
      setTake((n) => n + 1);
      busyUntil = performance.now() + total;
      queue(total + REST);
    };
    const enter = () => {
      hovered = true;
      if (!started) return;
      const left = busyUntil - performance.now();
      if (left <= 0) replay();
      else if (timer === undefined) queue(left + REST);
    };
    const leave = () => {
      hovered = false;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        started = true;
        setOn(true);
        busyUntil = performance.now() + d0 + total;
        queue(d0 + total + REST);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [d0, total]);

  return (
    <article
      ref={ref}
      className={`${className}${on ? " is-on" : ""}`}
      style={{ ["--d0" as string]: `${take ? 0 : d0}ms` }}
    >
      <Fragment key={take}>{children}</Fragment>
    </article>
  );
}
