# Product

## Register

brand

## Platform

web

## Users

Anyone who has to think something through before doing it, which is the baseline the
home page speaks to. Seven named benches get their own page — engineering, product,
business, design, making, film, study — because the objection is never "what is this"
but "is it for my kind of work". The visitor is not necessarily the buyer or an
existing user; most arrive cold, having heard the name once.

## Product Purpose

Nootles is a planning surface where prose and diagrams are one document, edited by a
model that works in front of you and waits to be told yes. The site exists to get a
cold visitor to open the app. Success is the press on **Go to app**, not time on page.

## Positioning

One page holds the writing and the drawing, so the plan and the picture of the plan
cannot drift apart — and the AI edits that page through the same operations a person
does, with every change held for approval.

## Conversion & proof

- Primary CTA: **Go to app** → `app.nootles.com`, top right and sticky, repeated once
  at the close. Secondary: the audience index, for visitors who need to see their own
  work before they'll believe it.
- The line a visitor remembers after 10 seconds: *somewhere to think it all the way
  through*.
- Belief ladder: this is one surface, not a doc with a whiteboard bolted on → it does
  my kind of work, specifically → the AI is useful without being in charge → opening it
  costs nothing.
- Proof on hand: none. No testimonials, logos, press or metrics exist yet, so the site
  makes no social-proof claim at all. The demonstration **is** the proof: eight real
  documents, rendered by the real document model. Do not invent proof to fill the gap.

## Brand Personality

Measured, exact, unhurried. It states things and declines to sell them; the voice in
the product's own source comments is the voice — *a name is not an argument*, *shapes,
not sentences*. Never exclamatory, never a feature list, never the word "effortlessly".
The feeling to leave behind is calm competence: the sense of a tool made by someone who
cared about the millimetre.

## Anti-references

Not the AI-SaaS landing page: no dark hero with a purple gradient, no glassmorphism, no
big-number metric band, no grid of identical icon cards, no "supercharge your workflow".
Equally not the editorial-magazine escape hatch that every restrained brand now runs to
— no display serif, no italic drop caps, no small-caps kickers over each section, no
broadsheet rules. And not beige: the warm near-white paper aesthetic is its own cliché.

## Design Principles

- **Show the page, don't describe it.** The hero imagery is a real document from the
  real model. A claim the picture already makes gets cut from the copy.
- **Practise the product's restraint.** Sage is identity and spends itself on the desk;
  amber means the model is working and appears nowhere else. No colour marks a state.
- **The document is the argument.** Segment pages differ by the work shown on them, not
  by a swapped noun in the headline.
- **Decidable things get measured.** Contrast and diagram geometry are checked by
  script, never by eye.
- **Minimal copy, whole sentences.** Few words, but real ones — no fragments used as
  design texture.

## Accessibility & Inclusion

WCAG 2.1 AA. Every text pair is verified by `scripts/contrast.mjs`; body copy clears
4.5:1 and marks clear 3:1. The sheets are `aria-hidden` pictures with a written caption
carrying their meaning, so nothing depends on reading 11px type inside a scaled page.
Every animation has a `prefers-reduced-motion` alternative, and the page-assembly
stagger stops rather than accelerating. Meaning is never carried by colour alone — the
diff strip reads as struck-through and inserted text, not as red and green.
