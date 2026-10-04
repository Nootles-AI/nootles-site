import type { Metadata } from "next";
import "./ideas.css";

export const metadata: Metadata = {
  title: "Hero ideas",
  robots: { index: false, follow: false },
};

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
