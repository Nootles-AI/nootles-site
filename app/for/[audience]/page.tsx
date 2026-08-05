import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { audiences, bySlug } from "@/content/audiences";

type Params = { params: Promise<{ audience: string }> };

export function generateStaticParams() {
  return audiences.map((a) => ({ audience: a.slug }));
}

export const dynamicParams = false;

/* Titled by bench rather than by headline. The headlines are a deliberate
   formula — one verb changes and the rest holds — which carries the fold and
   fails a tab strip, where seven near-identical titles help nobody. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = bySlug((await params).audience);
  if (!a) return {};
  return {
    title: `${a.label} — ${a.makes}`,
    description: a.sub,
    openGraph: { title: `${a.headline} — Nootles`, description: a.sub },
  };
}

export default async function AudiencePage({ params }: Params) {
  const audience = bySlug((await params).audience);
  if (!audience) notFound();
  return <Landing audience={audience} />;
}
