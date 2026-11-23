import type { ReactNode } from "react";

/** A surface in the bracket with the plug on its right edge: the story's side card and its "help" box. */
export function Bracket({ as: Tag = "div", className = "", children, ...rest }: { as?: "div" | "aside" | "section"; className?: string; children: ReactNode; "aria-labelledby"?: string }) {
  return (
    <Tag
      {...rest}
      className={`relative mr-3.5 border-2 border-r-0 border-fg bg-surface after:absolute after:-top-0.5 after:-right-3.5 after:-bottom-0.5 after:w-3.5 after:bg-purple after:content-[''] ${className}`}
    >
      {children}
    </Tag>
  );
}
