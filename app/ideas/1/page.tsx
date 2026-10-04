import { Archivo } from "next/font/google";
import { Idea1Swiss } from "@/components/ideas/Idea1Swiss";
import "./idea1.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--i1-face" });

export default function Page() {
  return (
    <div className={archivo.variable}>
      <Idea1Swiss />
    </div>
  );
}
