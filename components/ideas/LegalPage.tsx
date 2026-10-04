/* The legal pages, in the home page's world: the same bar, a header on the
   hero's dot grid that ends in the ground line, the document itself on one
   white sheet ruled like the site's tiles, and the same footer. Beside the
   sheet, a numbered list of its sections that stays in view, so a long
   document can be read in any order. Nothing is small print: if it is worth
   agreeing to, it is set to be read. */
import { SiteFooter, SiteNav } from "@/components/ideas/SiteChrome";
import type { LegalBlock, LegalDoc } from "@/content/legal";

/* An email address in a policy is an invitation, so it is the one thing in the
   text that becomes a link. Split on a capture group: odd indices are the
   addresses. */
const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function linked(text: string) {
  return text.split(EMAIL).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`}>
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
      <ul>
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

const no = (i: number) => String(i + 1).padStart(2, "0");
const idOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="ic-root i2">
      <SiteNav />
      <div className="i2-hero">
        <header className="lg-head">
          <h1 className="lg-title">{doc.title}</h1>
          <p className="lg-date">Effective {doc.effective}</p>
        </header>
      </div>

      <div className="lg-wrap">
        <nav className="lg-toc" aria-label="Sections">
          <p className="lg-toc-h">Sections</p>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#${idOf(s.title)}`}>
                  <span aria-hidden="true">{no(i)}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <main className="lg-sheet">
          {doc.sections.map((s, i) => (
            <section key={s.title} id={idOf(s.title)} className="lg-section">
              <h2>
                <span aria-hidden="true">{no(i)}</span>
                {s.title}
              </h2>
              {s.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
