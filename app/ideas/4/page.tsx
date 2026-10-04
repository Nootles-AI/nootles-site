import { Geist, Source_Serif_4 } from "next/font/google";
import { Idea4Doc } from "@/components/ideas/Idea4Doc";
import "./idea4.css";

const doc = Source_Serif_4({ subsets: ["latin"], variable: "--i4-doc", axes: ["opsz"] });
const ui = Geist({ subsets: ["latin"], variable: "--i4-ui" });

export default function Page() {
  return (
    <div className={`${doc.variable} ${ui.variable}`}>
      <Idea4Doc />
    </div>
  );
}
