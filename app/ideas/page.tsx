import Link from "next/link";

const ideas = [
  ["The poster on the grid", "Swiss-style headline on a visible 12-column layout grid; two teammates already hold words of it."],
  ["The hero is a board", "A dotted canvas: the headline is a selected text object, while a designer draws a flow, a PM types notes and the AI writes code beside it."],
  ["Written by the room", "Four roles type the headline, a phrase each; their pointers hover over the cast, and a “You” tag follows your own."],
  ["The page everyone is on", "One shared doc: the margin answers “which version is latest?”, and the AI’s edit waits for a person to accept it."],
  ["Six copies, one canvas", "Each character holds their own version of the brief; the copies are struck and merge into one live canvas."],
];

export default function Ideas() {
  return (
    <main className="ic-root">
      <div className="ic-index">
        <h1>Hero ideas</h1>
        <p>Five directions for the new hero. Same headline, same cast.</p>
        <ol>
          {ideas.map(([t, d], i) => (
            <li key={t}>
              <Link href={`/ideas/${i + 1}`}>
                <span className="n">{i + 1}</span>
                <strong>{t}</strong>
                <span className="d">{d}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: 40 }}>
          <Link href="/ideas/steps">Section 2 · Step 1 — five ideas →</Link>
        </p>
      </div>
    </main>
  );
}
