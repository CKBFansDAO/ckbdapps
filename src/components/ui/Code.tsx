import type { ReactNode } from "react";

/** Inline code inside translated rich text: `t.rich(key, { code })`. */
export const code = (c: ReactNode) => <code className="bg-fg/8 px-1 font-mono text-[.88em] font-medium">{c}</code>;
