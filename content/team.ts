import { legal } from "@/lib/site";
import data from "./team.json";

/* Who's behind it. The roster and the company facts that aren't already
   tracked elsewhere live in content/team.json — plain data, no TypeScript,
   so it's editable without touching this file. This file just types that
   JSON and folds in the two facts (`entity`, `hq`) that already have a
   single source of truth in lib/site.ts's `legal` — duplicating them into
   the JSON would give the entity name two places to go stale independently.

   This page exists for one reason: a reviewer — human or automated — needs
   to find, on the domain itself, who is actually running the company, and
   confirm it against a public record they don't have to take our word for.
   A LinkedIn profile is the usual proof; the BC registry record is the
   stronger one, because it isn't self-reported.

   TODO before this ships: replace every placeholder in team.json with the
   real thing. Do not invent a name, a bio detail, or a link that isn't true
   — an unfilled placeholder is honest in a way a plausible-looking fake
   isn't, and this page is read by the same people who flagged the site for
   exactly that kind of gap. */

export type TeamMember = {
  name: string;
  role: string;
  /** One or two sentences, factual, checkable — not marketing copy. */
  bio: string;
  /** A working profile URL on a third-party site (LinkedIn, GitHub, etc.). */
  linkedin: string;
  /** Path under /public once a real headshot exists. Omitted shows the
      placeholder frame. JSON has no comments, so the shape is documented
      here: add entries to team.json's "team" array in this same shape —
      name, role, bio, linkedin, and an optional photo. */
  photo?: string;
};

export const team: TeamMember[] = data.team;

/* Facts about the company itself that a reviewer can check independently of
   anything we say on this page. `founded`, `registryLabel` and `registryUrl`
   live in team.json; `entity` and `hq` come from lib/site.ts's `legal`,
   which is already the one place those two facts are written. */
export const company = {
  entity: legal.entity,
  /** e.g. "Incorporated 2026 in British Columbia, Canada" */
  founded: data.founded,
  hq: legal.venue,
  /** Public record at the BC Registry Services / OrgBook BC — the
      third-party proof that this entity exists and who filed it. */
  registryLabel: data.registryLabel,
  registryUrl: data.registryUrl,
};
