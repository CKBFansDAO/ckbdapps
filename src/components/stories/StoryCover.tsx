import { padIssue } from "@/lib/content/story-derive";

type Size = "sm" | "md" | "lg" | "xl";

// The cover is the slot itself with the issue number in it: no photo needed, and every issue reads as one series.
// Frame, border and plug keep the logo's proportions, as in FramedAvatar.
const SIZE: Record<Size, string> = {
  sm: "w-14 border-4 [--plug:10px]",
  md: "w-[clamp(96px,12vw,140px)] border-[clamp(6px,.8vw,9px)] [--plug:clamp(18px,2.2vw,24px)]",
  lg: "",
  xl: "w-[clamp(150px,24vw,300px)]",
};

/** Generated cover: the issue number inside the bracket. Decorative; the number is also in the text next to it. */
export function StoryCover({ no, size = "lg", className = "" }: { no: number; size?: Size; className?: string }) {
  return (
    <div aria-hidden="true" className={`framed flex shrink-0 items-center justify-center p-0 [container-type:inline-size] ${SIZE[size]} ${className}`}>
      <span className="wide text-[46cqw] leading-none tracking-[-.04em]">{padIssue(no)}</span>
    </div>
  );
}
