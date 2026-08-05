import { DiagramView } from "@/components/Diagram";
import type { Diagram } from "@/lib/doc";

/* Three things that stop happening. Each is shown on a piece of the surface it
   stops happening on, and each gets a different piece — a sentence becoming a
   drawing, a drawing being read back, a change waiting to be answered.

   They are frictions rather than features on purpose: a feature list says what
   the software has, and none of these are interesting as capabilities. What is
   interesting is the thing you no longer have to do. */

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

/* The drawing the model is reading in the second friction. It has to be a real
   diagram with a real dead-letter path, because the sentence underneath names
   something only visible in the picture. */
const read: Diagram = {
  w: 268,
  h: 130,
  nodes: [
    { id: "api", label: "API", x: 0, y: 4, w: 76, h: 44 },
    { id: "q", label: "Queue", x: 96, y: 4, w: 76, h: 44 },
    { id: "store", label: "Store", x: 192, y: 4, w: 76, h: 44 },
    { id: "dlq", label: "Dead letter", x: 96, y: 86, w: 76, h: 44, fill: true },
  ],
  edges: [
    { from: "api", to: "q" },
    { from: "q", to: "store" },
    { from: "q", to: "dlq", dashed: true },
  ],
};

function Friction({
  no,
  was,
  title,
  note,
  flipped,
  children,
}: {
  no: string;
  was: string;
  title: string;
  note: string;
  flipped?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={flipped ? "nt-friction is-flipped" : "nt-friction"}>
      <div className="nt-friction-say">
        <span className="nt-friction-was nt-meta nt-stamp">
          {no} — {was}
        </span>
        <h3 className="nt-h3">{title}</h3>
        <p className="nt-friction-note">{note}</p>
      </div>
      <div aria-hidden="true">{children}</div>
    </section>
  );
}

export function Frictions() {
  return (
    <div className="nt-frictions">
      <Friction
        no="01"
        was="You leave to draw it"
        title="Say what the drawing is. It appears on the page."
        note="You describe the diagram in a sentence and it arrives as shapes you can drag and relabel — not a picture you have to redraw when the plan changes."
      >
        <div className="nt-strip">
          <p className="nt-strip-said">a queue between the api and the store</p>
          <div className="nt-mini">
            <DiagramView diagram={drawn} id="friction-drawn" />
          </div>
        </div>
      </Friction>

      <Friction
        flipped
        no="02"
        was="Your AI reads half the page"
        title="It reads the diagram, the table and the maths too."
        note="Every other model in a document sees your prose and nothing else. This one is given the whole page, so it can answer using something you drew rather than something you wrote."
      >
        <div className="nt-strip">
          <div style={{ width: 268, height: 130 }}>
            <DiagramView diagram={read} id="friction-read" />
          </div>
          <p className="nt-strip-line" style={{ marginTop: 14 }}>
            <span className="nt-ghost">
              Nothing consumes the dead letter, so a message that fails twice is
              lost quietly
            </span>
            <span className="nt-stream-head" />
          </p>
        </div>
      </Friction>

      <Friction
        no="03"
        was="Then you apply the advice by hand"
        title="It makes the change itself, and waits."
        note="No wall of prose in a sidebar explaining what you should go and do. It edits the page in front of you, and every change stands at the foot of the window until you keep it or throw it away."
      >
        <div className="nt-strip">
          <p className="nt-diff is-del">Retries are handled by the client.</p>
          <p className="nt-diff is-add">
            Anything that fails twice goes to the dead letter.
          </p>
          <span className="nt-reviewbar">
            <span className="nt-meta">2 changes</span>
            <span className="nt-reviewbar-sep" />
            <span className="nt-reviewbar-act">Keep</span>
            <span className="nt-reviewbar-act is-quiet">Discard</span>
          </span>
        </div>
      </Friction>
    </div>
  );
}
