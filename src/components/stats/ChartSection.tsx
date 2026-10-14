import type { ReactNode } from "react";
import { Chart, type Layer, type Marker } from "./Chart";

type Props = {
  title: string;
  value: string;
  change?: string;
  i0: number;
  i1: number;
  fmtAxis: (v: number) => string;
  fmtX: (i: number) => string;
  kbdHint: string;
  layers: Layer[];
  markers?: Marker[];
  /** clamp the y axis to 0 */
  zero?: boolean;
  legend?: ReactNode;
};

/** One chart block: heading + current value, the plot, and an optional legend. */
export function ChartSection({ title, value, change, legend, ...chart }: Props) {
  return (
    <section className="mt-[clamp(40px,6vw,64px)] first:mt-[clamp(32px,5vw,48px)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-b-2 border-fg pb-3">
        <h2 className="semi m-0 text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1]">{title}</h2>
        <div className="font-mono text-base font-semibold">
          {value}
          {change && <span className="ml-2.5 font-medium text-mut-p">{change}</span>}
        </div>
      </div>
      <Chart label={title} {...chart} />
      {legend}
    </section>
  );
}
