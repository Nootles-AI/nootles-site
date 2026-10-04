/* The team page, in the home page's world: the same bar, a short header on
   the hero's dot grid that ends in the ground line, the people in one ruled
   band the way the three steps are, the company's public record on the grey
   below, and the same footer.

   The page exists so that anyone checking can find who runs the company and
   confirm it against a record they don't have to take on our word: each
   person links to a public profile, and the company to its registration.
   Each person wears a colour from the cast, as everyone does on this site. */
import Image from "next/image";
import type { CSSProperties } from "react";
import { cast } from "@/components/ideas/shared";
import { SiteFooter, SiteNav } from "@/components/ideas/SiteChrome";
import { company, team } from "@/content/team";

const HUES = [cast.peri, cast.yellow, cast.blue, cast.green, cast.pink, cast.purple];

function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10 10 4M5.5 4H10v4.5" />
    </svg>
  );
}

function Member({ member, i }: { member: (typeof team)[number]; i: number }) {
  const hue = HUES[i % HUES.length];
  const first = member.name.split(" ")[0];
  return (
    <article className="tm-cell" style={{ "--c": hue.body, "--ct": hue.ink } as CSSProperties}>
      <div className="tm-photo">
        {member.photo ? (
          <Image className="tm-photo-img" src={member.photo} alt="" width={176} height={176} loading="eager" />
        ) : (
          <span className="tm-photo-empty" aria-hidden="true" />
        )}
        {/* Their name tag, the way a teammate shows up on a shared page. */}
        <span className="tm-tag" aria-hidden="true">
          {first}
        </span>
      </div>
      <h3 className="tm-name">{member.name}</h3>
      <p className="tm-role">{member.role}</p>
      <p className="tm-bio">{member.bio}</p>
      <a className="tm-link" href={member.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
        <ExternalArrow />
      </a>
    </article>
  );
}

export function TeamPage() {
  return (
    <div className="ic-root i2">
      <SiteNav />
      <div className="i2-hero">
        <header className="tm-head">
          <p className="tm-kicker">Team</p>
          <h1 className="tm-title">Who&rsquo;s behind it</h1>
          <p className="tm-lede">
            {company.entity}, {company.hq}. The people running it, and a public record of each: nothing here asks to
            be taken on our word.
          </p>
        </header>
      </div>

      <main>
        <section className="tm-band" aria-labelledby="tm-people">
          <h2 className="sr-only" id="tm-people">
            Founders and core team
          </h2>
          <div className="tm-row">
            {team.map((member, i) => (
              <Member key={member.name} member={member} i={i} />
            ))}
          </div>
        </section>

        <section className="tm-record" aria-labelledby="tm-reg">
          <div className="tm-record-tile">
            <h2 id="tm-reg">Registration</h2>
            <p>
              {company.entity} was incorporated in {company.founded}, with its registered office in {company.hq}.
            </p>
            {company.registryUrl ? (
              <a className="tm-link" href={company.registryUrl} target="_blank" rel="noopener noreferrer">
                {company.registryLabel}
                <ExternalArrow />
              </a>
            ) : (
              <p className="tm-record-name">{company.registryLabel}</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
