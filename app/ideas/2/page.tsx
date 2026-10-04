import { Bricolage_Grotesque, Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Idea2Canvas } from "@/components/ideas/Idea2Canvas";
import "./idea2.css";
import "../steps/steps.css";
import "./showcase.css";
import "./app-project.css";

const face = Bricolage_Grotesque({ subsets: ["latin"], variable: "--i2-face" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--i2-mono" });
/* The app's own faces, for the project screen in section 3. */
const appSans = Geist({ subsets: ["latin"], variable: "--app-sans" });
const appMono = Geist_Mono({ subsets: ["latin"], variable: "--app-mono" });

export default function Page() {
  return (
    <div className={`${face.variable} ${mono.variable} ${appSans.variable} ${appMono.variable}`}>
      <Idea2Canvas />
    </div>
  );
}
