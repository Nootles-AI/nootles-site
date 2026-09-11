import type { Metadata } from "next";
import { TeamPage } from "@/components/Team";

export const metadata: Metadata = {
  title: "Team",
  description: "The founders and core team behind Nootles, and how to verify each of them.",
};

export default function Team() {
  return <TeamPage />;
}
