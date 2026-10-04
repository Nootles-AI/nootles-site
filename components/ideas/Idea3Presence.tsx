"use client";

/* IDEA 3 — Written by the room.
   THESIS: the headline is co-written in front of you, a phrase per person,
   each with their own caret and name flag; the people writing it are the cast
   standing below, and the visitor is in the room too. Refuses the static
   centred hero with a product screenshot under it.
   OWN-WORLD: plain white, one quiet ink, generous centre axis; every
   collaborator owns one body colour from the cast, used for their caret, flag
   and pointer, and for nothing else.
   STORY: four people write the line together in four seconds; a fifth tag,
   "You", rides your own pointer — joining is the obvious next move.
   FIRST VIEWPORT: centred two-line headline, subtitle, one CTA; the cast on
   the floor with a named pointer hovering over each head.
   FORM: grounded #2. */
import { useEffect, useRef } from "react";
import { Arrow, Characters, IdeaNav, cast, copy, people } from "@/components/ideas/shared";
import { Cursor } from "@/components/ideas/shared";
import { site } from "@/lib/site";

type Seg = { text: string; who: "analyst" | "design" | "eng" | "marketing" };
const lines: Seg[][] = [
  [
    { text: "Stop Passing", who: "analyst" },
    { text: "Docs Around.", who: "design" },
  ],
  [
    { text: "Start Building", who: "eng" },
    { text: "Together.", who: "marketing" },
  ],
];

const STEP = 52; // ms per character
const GAP = 260; // a breath between people

/* Where each person stands, as a fraction of the cast image. */
const heads = [
  { who: "analyst", x: 3.5, y: 6 },
  { who: "you", x: 27.5, y: 2 },
  { who: "design", x: 46, y: 33 },
  { who: "eng", x: 61.5, y: 5 },
  { who: "marketing", x: 79.5, y: 27 },
  { who: "ai", x: 95, y: 10 },
] as const;

/* Timeline: each segment starts when the one before has finished. Fixed
   content, so it is worked out once, outside render. */
const { timed, t } = (() => {
  let at = 500;
  const timed = lines.map((line) =>
    line.map((seg) => {
      const start = at;
      const dur = seg.text.length * STEP;
      at += dur + GAP;
      return { ...seg, start, dur };
    }),
  );
  return { timed, t: at };
})();
const startOf = (who: string) => timed.flat().find((s) => s.who === who)?.start ?? 0;

export function Idea3Presence() {

  const hero = useRef<HTMLElement>(null);
  const you = useRef<HTMLSpanElement>(null);

  /* "You" follows the visitor's own pointer while it's over the hero, with a
     little lag so it reads as a remote cursor, and goes home when it leaves. */
  useEffect(() => {
    const el = hero.current;
    const tag = you.current;
    if (!el || !tag || !matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, inside = false;
    const home = () => {
      const r = tag.parentElement!.getBoundingClientRect();
      return { x: 0, y: 0, r };
    };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      tag.style.transform = `translate(${x}px, ${y}px)`;
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      const { r } = home();
      tx = e.clientX - r.left + 14;
      ty = e.clientY - r.top + 16;
      if (!inside) { inside = true; tag.classList.add("is-live"); }
      kick();
    };
    const leave = () => {
      inside = false;
      tag.classList.remove("is-live");
      tx = 0; ty = 0;
      kick();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ic-root i3">
      <IdeaNav />
      <section className="i3-hero" ref={hero}>
        <h1 className="i3-title">
          <span className="sr-only">
            {copy.titleA} {copy.titleB}
          </span>
          {timed.map((line, li) => (
            <span className="i3-line" key={li} aria-hidden="true">
              {line.map((s, si) => {
                const p = people[s.who];
                const hue = cast[p.hue as keyof typeof cast];
                return (
                  <span key={si}>
                    {si > 0 ? " " : null}
                    <span
                      className={`i3-seg${li === 1 && si === 1 ? " is-last" : ""}`}
                      style={{
                        ["--n" as string]: s.text.length,
                        ["--s" as string]: `${s.start}ms`,
                        ["--t" as string]: `${s.dur}ms`,
                        ["--c" as string]: hue.body,
                        ["--ct" as string]: hue.ink,
                      }}
                    >
                      <span className="i3-txt">{s.text}</span>
                      <span className="i3-caret">
                        <b>{p.name}</b>
                      </span>
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <p className="i3-sub" style={{ ["--s" as string]: `${t}ms` }}>
          {copy.sub}
        </p>
        <a className="i3-cta" href={site.appUrl} style={{ ["--s" as string]: `${t + 120}ms` }}>
          Join your team
          <Arrow />
        </a>

        <div className="i3-floor">
          <Characters />
          <div className="i3-heads" aria-hidden="true">
            {heads.map((h) => (
              <span
                key={h.who}
                className={`i3-head i3-head-${h.who}`}
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  ["--d" as string]: `${h.who === "you" ? t + 400 : h.who === "ai" ? t + 700 : startOf(h.who)}ms`,
                }}
              >
                {h.who === "you" ? (
                  <span className="i3-you" ref={you}>
                    <span className="ic-cursor-tag" style={{ ["--c" as string]: cast.peri.body, ["--ct" as string]: cast.peri.ink }}>
                      You
                    </span>
                  </span>
                ) : (
                  <Cursor who={h.who} className="i3-ptr" />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
