import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
};

export default function Privacy() {
  return <LegalPage doc={privacy} />;
}
