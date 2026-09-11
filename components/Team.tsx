import Image from "next/image";
import { Footer, Nav } from "@/components/Chrome";
import { company, team } from "@/content/team";

function ExternalArrow() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10 10 4M5.5 4H10v4.5" />
    </svg>
  );
}

/* A real photo fills the frame; without one, a drafting sheet marks a photo
   not yet placed the way it marks any other missing measurement — with a
   ruled box and a note, never by pretending the space is filled. */
function Photo({ member }: { member: (typeof team)[number] }) {
  if (member.photo) {
    return (
      <div className="nt-team-photo">
        <Image
          className="nt-team-photo-img"
          src={member.photo}
          alt=""
          width={112}
          height={112}
        />
      </div>
    );
  }
  return (
    <div className="nt-team-photo" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.2">
        <path d="M2 2 18 18M18 2 2 18" />
      </svg>
    </div>
  );
}

function Row({ member }: { member: (typeof team)[number] }) {
  return (
    <div className="nt-team-row">
      <Photo member={member} />
      <div className="nt-team-who">
        <p className="nt-team-name">{member.name}</p>
        <p className="nt-team-role nt-meta nt-stamp">{member.role}</p>
        <p className="nt-team-bio">{member.bio}</p>
      </div>
      <a
        className="nt-team-link"
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
        <ExternalArrow />
      </a>
    </div>
  );
}

/* Set the way the legal pages are: on the paper, one column, sections ruled
   off with numbers. The content differs but the register is the same page —
   a company either states its facts plainly or it doesn't, and the site
   already made that choice once. */
export function TeamPage() {
  return (
    <>
      <Nav />
      <main className="nt-legal nt-shell">
        <header className="nt-legal-head">
          <p className="nt-meta nt-stamp">Company — Team</p>
          <h1 className="nt-legal-title">Who&rsquo;s behind it</h1>
          <p className="nt-lede">
            {company.entity}, {company.hq}. The people running it, and a public
            record of each — nothing here is asked to be taken on our word.
          </p>
        </header>

        <div className="nt-legal-body">
          <section className="nt-legal-section">
            <h2 className="nt-legal-h">
              <span className="nt-meta nt-stamp" aria-hidden="true">01</span>
              Founders &amp; core team
            </h2>
            <div className="nt-team-roster">
              {team.map((member) => (
                <Row key={member.name} member={member} />
              ))}
            </div>
          </section>

          <section className="nt-legal-section">
            <h2 className="nt-legal-h">
              <span className="nt-meta nt-stamp" aria-hidden="true">02</span>
              Registration
            </h2>
            <p>
              {company.entity} was {company.founded}, with its registered
              office in {company.hq}.
            </p>
            <p>
              <a className="nt-legal-link" href={company.registryUrl} target="_blank" rel="noopener noreferrer">
                {company.registryLabel}
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
