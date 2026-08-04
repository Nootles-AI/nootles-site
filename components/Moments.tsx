import { DiagramView } from "@/components/Diagram";
import type { Diagram } from "@/lib/doc";

/* Three things the product does. Each is shown on a piece of the surface it
   actually happens on, and each gets a different piece — a line being finished,
   a sentence becoming a drawing, a change waiting to be answered. */

const drawn: Diagram = {
  w: 268,
  h: 58,
  nodes: [
    { id: "api", label: "API", x: 0, y: 4, w: 76, h: 44 },
    { id: "q", label: "Queue", x: 96, y: 4, w: 76, h: 44, fill: true },
    { id: "store", label: "Store", x: 192, y: 4, w: 76, h: 44 },
  ],
  edges: [
    { from: "api", to: "q" },
    { from: "q", to: "store" },
  ],
};

function Moment({
  title,
  note,
  flipped,
  children,
}: {
  title: string;
  note: string;
  flipped?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={flipped ? "nt-moment is-flipped" : "nt-moment"}>
      <div className="nt-moment-say">
        <h3 className="nt-h3">{title}</h3>
        <p className="nt-moment-note">{note}</p>
      </div>
      <div aria-hidden="true">{children}</div>
    </section>
  );
}

export function Moments() {
  return (
    <div className="nt-moments">
      <Moment
        title="Tab, and it keeps going."
        note="It finishes the sentence — then opens whatever block should come next. Structure included, not just words."
      >
        <div className="nt-strip">
          <p className="nt-strip-line">
            Events land in a queue rather than{" "}
            <span className="nt-ghost">
              going straight to the store, so a slow write stops being the
              client&rsquo;s problem.
            </span>
            <span className="nt-key">Tab</span>
          </p>
        </div>
      </Moment>

      <Moment
        flipped
        title="Say it, and it’s drawn."
        note="Describe the diagram in a sentence. It arrives as shapes you can drag and relabel — never a picture you have to start again."
      >
        <div className="nt-strip">
          <p className="nt-strip-said">a queue between the api and the store</p>
          <div className="nt-mini">
            <DiagramView diagram={drawn} id="moment-drawn" />
          </div>
        </div>
      </Moment>

      <Moment
        title="Nothing lands until you say so."
        note="The model edits the page in front of you, live. Every change it makes waits at the foot of the window to be kept or thrown away."
      >
        <div className="nt-strip">
          <p className="nt-diff is-del">Retries are handled by the client.</p>
          <p className="nt-diff is-add">
            Anything that fails twice goes to the dead letter.
          </p>
          <span className="nt-reviewbar">
            <span className="nt-reviewbar-count">2 CHANGES</span>
            <span className="nt-reviewbar-sep" />
            <span className="nt-reviewbar-act">Keep</span>
            <span className="nt-reviewbar-act is-quiet">Discard</span>
          </span>
        </div>
      </Moment>
    </div>
  );
}
