import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: terms.title,
  description: terms.description,
};

export default function Terms() {
  return <LegalPage doc={terms} />;
}
