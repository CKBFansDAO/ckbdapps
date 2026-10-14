import type { ReactNode } from "react";

/** Inline bracket around a word, purple plug on the right. Sizes with the surrounding font. */
export function Slot({ children }: { children: ReactNode }) {
  return <span className="inslot">{children}</span>;
}
