import { Geist, Geist_Mono } from "next/font/google";
import { Idea5Merge } from "@/components/ideas/Idea5Merge";
import "./idea5.css";

const sans = Geist({ subsets: ["latin"], variable: "--i5-face" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--i5-mono" });

export default function Page() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <Idea5Merge />
    </div>
  );
}
