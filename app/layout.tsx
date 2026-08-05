import type { Metadata } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/* Overpass is drawn from Highway Gothic, the alphabet on American road signs —
   lettering engineered to be read off a sheet at speed rather than styled to
   look designed. That is the same job it has here. */
const sans = Overpass({ variable: "--font-sans", subsets: ["latin"] });
const mono = Overpass_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  /* www, because that is what the site actually canonicalises to. The bare
     apex redirects, and the og:image URL is built off this base — a scraper
     that declines to follow a redirect for an image gets no image at all. */
  metadataBase: new URL("https://www.nootles.com"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
  /* The card was `summary`, which is the small square thumbnail. The sheet is a
     landscape object and is unreadable at that size. */
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
