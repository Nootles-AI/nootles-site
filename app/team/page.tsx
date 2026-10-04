import type { Metadata } from "next";
import { TeamPage } from "@/components/ideas/TeamPage";
import { fontVars } from "@/components/ideas/fonts";
import "../ideas/ideas.css";
import "../ideas/2/idea2.css";
import "./team.css";

export const metadata: Metadata = {
  title: "Team",
  description: "The founders and core team behind Nootles, and how to verify each of them.",
};

export default function Team() {
  return (
    <div className={fontVars}>
      <TeamPage />
    </div>
  );
}
