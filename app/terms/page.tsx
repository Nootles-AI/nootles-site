import type { Metadata } from "next";
import { LegalPage } from "@/components/ideas/LegalPage";
import { fontVars } from "@/components/ideas/fonts";
import { terms } from "@/content/legal";
import "../ideas/ideas.css";
import "../ideas/2/idea2.css";
import "../legal.css";

export const metadata: Metadata = {
  title: terms.title,
  description: terms.description,
};

export default function Terms() {
  return (
    <div className={fontVars}>
      <LegalPage doc={terms} />
    </div>
  );
}
