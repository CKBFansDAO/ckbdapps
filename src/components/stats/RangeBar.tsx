"use client";

import { useRef, type CSSProperties } from "react";

type Props = {
  n: number;
  i0: number;
  i1: number;
  /** path `d` for the log-price sparkline inside the brush */
  sparkD: string;
  presets: { key: string; days: number; active: boolean }[];
  onPreset: (days: number) => void;
  onWin: (a: number, b: number) => void;
  rangeText: string;
  groupLabel: string;
};

/** Sticky range control: preset buttons + a draggable brush window over the whole series. */
export function RangeBar({ n, i0, i1, sparkD, presets, onPreset, onWin, rangeText, groupLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<null | { mode: "l" | "r" | "m"; x: number; a: number; b: number }>(null);
  const span = () => ref.current?.clientWidth || 1;
  const toIndex = (clientX: number) =>
    Math.round(((clientX - ref.current!.getBoundingClientRect().left - 5) / span()) * (n - 1));

  return (
    <div className="sticky top-[calc(var(--hh)+env(safe-area-inset-top,0px))] z-30 border-y-2 border-fg bg-bg">
      <div className="in flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5">
        <div className="inline-flex border-2 border-fg" role="group" aria-label={groupLabel}>
          {presets.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={p.active}
              onClick={() => onPreset(p.days)}
              className="min-h-9 px-3 py-1.5 text-[.85rem] font-bold aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {p.key}
            </button>
          ))}
        </div>
        <div
          ref={ref}
          className="relative mr-[19px] h-11 min-w-[200px] flex-[1_1_320px] cursor-pointer touch-none border-[5px] border-r-0 border-fg bg-white"
          onPointerDown={(e) => {
            e.preventDefault();
            const t = e.target as HTMLElement;
            if (!t.closest("[data-bwin]")) {
              // click outside the window: recentre the window there
              const len = i1 - i0;
              const a = Math.max(0, Math.min(n - 1 - len, toIndex(e.clientX) - Math.round(len / 2)));
              onWin(a, a + len);
              return;
            }
            drag.current = {
              mode: (t.dataset.handle as "l" | "r") ?? "m",
              x: e.clientX,
              a: i0,
              b: i1,
            };
            ref.current!.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d0 = drag.current;
            if (!d0) return;
            const d = Math.round(((e.clientX - d0.x) / span()) * (n - 1));
            if (d0.mode === "m") {
              const len = d0.b - d0.a;
              const a = Math.max(0, Math.min(n - 1 - len, d0.a + d));
              onWin(a, a + len);
            } else if (d0.mode === "l") onWin(Math.min(d0.b - 6, d0.a + d), d0.b);
            else onWin(d0.a, Math.max(d0.a + 6, d0.b + d));
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 block size-full">
            <path d={sparkD} className="fill-none stroke-paper-ink/45 [stroke-width:1.5] [vector-effect:non-scaling-stroke]" />
          </svg>
          <div
            data-bwin
            className="absolute inset-y-0 min-w-[22px] cursor-grab border-y-2 border-purple bg-purple/30 left-(--bx) w-(--bw) active:cursor-grabbing"
            style={
              { "--bx": `${(i0 / (n - 1)) * 100}%`, "--bw": `${((i1 - i0) / (n - 1)) * 100}%` } as CSSProperties
            }
            tabIndex={0}
            role="slider"
            aria-label={groupLabel}
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={i0}
            aria-valuetext={rangeText}
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              const len = i1 - i0;
              const step = e.shiftKey ? 90 : 14;
              const a = e.key === "ArrowLeft" ? Math.max(0, i0 - step) : Math.min(n - 1 - len, i0 + step);
              onWin(a, a + len);
            }}
          >
            <span data-handle="l" className="absolute -inset-y-0.5 left-0 w-3 cursor-ew-resize bg-purple" />
            <span data-handle="r" className="absolute -inset-y-0.5 right-0 w-3 cursor-ew-resize bg-purple" />
          </div>
          {/* open plug stub at the brush's right edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-[5px] -right-[19px] w-3.5 border-2 border-dashed border-purple-deep"
          />
        </div>
        <span className="font-mono text-[.85rem] font-medium text-mut-p">{rangeText}</span>
      </div>
    </div>
  );
}
