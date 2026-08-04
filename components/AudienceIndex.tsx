import Link from "next/link";
import { ArrowRight } from "@/components/Chrome";
import { audiences } from "@/content/audiences";

/* A contents page, not a menu of cards. Each line goes to the same product
   shown doing that reader's own work. */
export function AudienceIndex({ except }: { except?: string }) {
  const rows = audiences.filter((a) => a.slug !== except);

  return (
    <nav className="nt-index" aria-label="What people use it for">
      {rows.map((a) => (
        <Link key={a.slug} className="nt-index-row" href={`/for/${a.slug}`}>
          <span className="nt-index-label">{a.label}</span>
          <span className="nt-index-makes">{a.makes}</span>
          <ArrowRight className="nt-index-arrow" />
        </Link>
      ))}
    </nav>
  );
}
