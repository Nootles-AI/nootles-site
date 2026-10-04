import type { Metadata } from "next";
import { LegalPage } from "@/components/ideas/LegalPage";
import { fontVars } from "@/components/ideas/fonts";
import { privacy } from "@/content/legal";
import "../ideas/ideas.css";
import "../ideas/2/idea2.css";
import "../legal.css";

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
};

export default function Privacy() {
  return (
    <div className={fontVars}>
      <LegalPage doc={privacy} />
    </div>
  );
}
