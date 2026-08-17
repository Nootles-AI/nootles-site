import { Footer, Nav } from "@/components/Chrome";
import type { LegalBlock, LegalDoc } from "@/content/legal";

/* An email address in a policy is an invitation, so it is the one thing in the
   text that becomes a link. Split on a capture group: odd indices are the
   addresses. */
const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function linked(text: string) {
  return text.split(EMAIL).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} className="nt-legal-link" href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if ("list" in block) {
    return (
      <ul className="nt-legal-list">
        {block.list.map((item, i) => (
          <li key={i}>
            {item.lead ? <strong>{item.lead} </strong> : null}
            {linked(item.text)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      {block.lead ? <strong>{block.lead} </strong> : null}
      {linked(block.p)}
    </p>
  );
}

/* A legal page is set like every other sheet here: on the paper, at a measure,
   sections numbered the way a drawing's notes are numbered. Nothing is small
   print — if it is worth agreeing to, it is set to be read. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Nav />
      <main className="nt-legal nt-shell">
        <header className="nt-legal-head">
          <p className="nt-meta nt-stamp">{doc.stamp}</p>
          <h1 className="nt-legal-title">{doc.title}</h1>
          <p className="nt-lede">{doc.lede}</p>
          <p className="nt-meta nt-stamp nt-legal-date">
            Effective {doc.effective}
          </p>
        </header>
        <div className="nt-legal-body">
          {doc.sections.map((section, i) => (
            <section key={section.title} className="nt-legal-section">
              <h2 className="nt-legal-h">
                <span className="nt-meta nt-stamp" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
