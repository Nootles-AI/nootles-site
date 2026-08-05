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
  metadataBase: new URL("https://nootles.com"),
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
