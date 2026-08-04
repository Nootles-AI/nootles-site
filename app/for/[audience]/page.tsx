import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { audiences, bySlug } from "@/content/audiences";

type Params = { params: Promise<{ audience: string }> };

export function generateStaticParams() {
  return audiences.map((a) => ({ audience: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = bySlug((await params).audience);
  if (!a) return {};
  return {
    title: a.headline,
    description: a.sub,
    openGraph: { title: `${a.headline} — Nootles`, description: a.sub },
  };
}

export default async function AudiencePage({ params }: Params) {
  const audience = bySlug((await params).audience);
  if (!audience) notFound();
  return <Landing audience={audience} />;
}
