import { Idea2Canvas } from "@/components/ideas/Idea2Canvas";
import { fontVars } from "@/components/ideas/fonts";
import "./ideas/ideas.css";
import "./ideas/2/idea2.css";
import "./ideas/steps/steps.css";
import "./ideas/2/showcase.css";
import "./ideas/2/app-project.css";

export default function Home() {
  return (
    <div className={fontVars}>
      <Idea2Canvas />
    </div>
  );
}
