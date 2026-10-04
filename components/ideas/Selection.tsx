import type { CSSProperties, ReactNode } from "react";
import { cast, type Hue } from "@/components/ideas/shared";

/** A word or phrase held by someone: the frame and four handles a design
    tool draws around a selected object, in the holder's colour. */
export function Selection({
  hue,
  children,
  className,
  style,
}: {
  hue: Hue | "ink";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const c = hue === "ink" ? "#16181a" : cast[hue].body;
  return (
    <span className={`ic-sel ${className ?? ""}`} style={{ ...style, ["--c" as string]: c }}>
      {children}
      <span className="ic-sel-frame" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
