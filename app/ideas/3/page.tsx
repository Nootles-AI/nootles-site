import { Gabarito } from "next/font/google";
import { Idea3Presence } from "@/components/ideas/Idea3Presence";
import "./idea3.css";

const face = Gabarito({ subsets: ["latin"], variable: "--i3-face" });

export default function Page() {
  return (
    <div className={face.variable}>
      <Idea3Presence />
    </div>
  );
}
