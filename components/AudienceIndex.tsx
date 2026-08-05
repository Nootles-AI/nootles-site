import Link from "next/link";
import { ArrowRight } from "@/components/Chrome";
import { audiences } from "@/content/audiences";
import { blockRegister } from "@/lib/doc";

/* A register of drawings, not a grid of cards. Seven of anything in boxes is a
   menu; seven ruled lines carrying their numbers and their contents is a
   drawing register, which is what this is.

   Each row states which blocks that bench's document actually uses, derived
   from the document rather than written by hand. That is the argument for these
   pages existing: the work differs, so the sheets differ. A row that could only
   ever read the same as the one above it would be a swapped noun. */
export function AudienceIndex({ except }: { except?: string }) {
  return (
    <nav className="nt-index" aria-label="What people use it for">
      {audiences.map((a, i) =>
        a.slug === except ? null : (
          <Link key={a.slug} className="nt-index-row" href={`/for/${a.slug}`}>
            <span className="nt-index-no nt-meta" aria-hidden="true">
              {String(i + 2).padStart(2, "0")}
            </span>
            <span className="nt-index-label">{a.label}</span>
            <span className="nt-index-makes">{a.makes}</span>
            <span className="nt-index-uses nt-meta nt-stamp">{blockRegister(a.doc)}</span>
            <ArrowRight className="nt-index-arrow" />
          </Link>
        ),
      )}
    </nav>
  );
}
