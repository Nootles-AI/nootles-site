import type { MathToken } from "@/lib/doc";

/* Maths as the app sets it: a real rule between numerator and denominator, a
   real radical over its radicand, variables in the italic they are conventional
   in. A slash and a caret would be a description of the notation rather than
   the notation.

   The token list is flat by design — a token may hold two strings and never
   another token — which is the same bounded-depth rule the product's own
   document model follows. */

function Token({ token }: { token: MathToken }) {
  switch (token.t) {
    case "run":
      return <span className="nt-math-run">{token.text}</span>;
    case "op":
      return <span className="nt-math-op">{token.text}</span>;
    case "frac":
      return (
        <span className="nt-math-frac">
          <span className="nt-math-num">{token.num}</span>
          <span className="nt-math-den">{token.den}</span>
        </span>
      );
  }
}

export function MathView({ expr, result }: { expr: MathToken[]; result?: string }) {
  return (
    <div>
      <div className="nt-doc-math">
        {expr.map((t, i) => (
          <Token key={i} token={t} />
        ))}
      </div>
      {/* What the compute engine returned. The app shows the value under the
          expression rather than replacing it, because you still need to see
          what was asked as well as what it came to. */}
      {result ? <span className="nt-math-result nt-meta">= {result}</span> : null}
    </div>
  );
}
