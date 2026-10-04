import { Bricolage_Grotesque, Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";

/* The new design's faces, loaded once and shared by every page that uses it:
   Bricolage for the site, JetBrains Mono for its meta, and the app's own
   Geist pair for the project screen drawn on the home page. */
const face = Bricolage_Grotesque({ subsets: ["latin"], variable: "--i2-face" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--i2-mono" });
const appSans = Geist({ subsets: ["latin"], variable: "--app-sans" });
const appMono = Geist_Mono({ subsets: ["latin"], variable: "--app-mono" });

export const fontVars = `${face.variable} ${mono.variable} ${appSans.variable} ${appMono.variable}`;
