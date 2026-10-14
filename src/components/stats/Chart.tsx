"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { niceTicks } from "@/lib/stats-format";
import { extent, idxAtX, seriesPath, strideFor, ttLeft, xLabelIdx } from "@/lib/stats-chart";

export type Layer = {
  name: string;
  /** a text-* token class; strokes, fills and swatches inherit it through currentColor */
  cls: string;
  kind: "line" | "area";
  /** false hides the layer (legend toggle) */
  on?: boolean;
  top: (i: number) => number;
  base?: (i: number) => number;
  fmt: (i: number) => string;
};

export type Marker = { i: number; label: string };

type Props = {
  label: string;
  i0: number;
  i1: number;
  /** clamp the y axis to 0 (occupancy) instead of padding the data range */
  zero?: boolean;
  fmtAxis: (v: number) => string;
  fmtX: (i: number) => string;
  kbdHint: string;
  layers: Layer[];
  markers?: Marker[];
};

const ML = 58,
  MR = 14,
  MT = 12,
  MB = 26;
const AXIS_TEXT = "fill-mut-p font-mono text-[11px] font-medium";
const TIP =
  "pointer-events-none absolute z-5 min-w-[150px] max-w-60 bg-ink px-3 py-[9px] text-[.85rem] text-white shadow-tooltip left-(--tx) top-(--ty)";
const TIP_DATE = "mb-1.5 font-mono text-[.78rem] font-medium text-mut-d";

/** One SVG chart. The crosshair snaps to the day index and one tooltip lists every layer. */
export function Chart({ label, i0, i1, zero, fmtAxis, fmtX, kbdHint, layers, markers = [] }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [cur, setCur] = useState<number | null>(null);
  const [mk, setMk] = useState<Marker | null>(null);
  useEffect(() => {
    const el = host.current!;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = size.w,
    H = size.h;
  const pw = W - ML - MR,
    ph = H - MT - MB;
  const L = layers.filter((l) => l.on !== false);

  const { lo, hi } = extent(L.map((l) => l.top), i0, i1, !!zero);
  const X = (k: number) => ML + ((k - i0) / (i1 - i0)) * pw;
  const Y = (v: number) => MT + (1 - (v - lo) / (hi - lo)) * ph;
  const ready = W >= 40;
  const stride = strideFor(i1 - i0, pw);
  const ticks = ready ? niceTicks(lo, hi, 4) : [];
  const labels = ready ? xLabelIdx(i0, i1, W >= 560) : [];

  const at = (idx: number) => setCur(Math.max(i0, Math.min(i1, idx)));
  const off = () => {
    setCur(null);
    setMk(null);
  };
  const tip = (x: number, y: number) => ({ "--tx": `${ttLeft(x, W)}px`, "--ty": `${y}px` }) as CSSProperties;

  return (
    <div ref={host} className="relative mt-2 h-60 touch-pan-y select-none min-[561px]:h-[300px]">
      {ready && (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block size-full overflow-visible"
          tabIndex={0}
          role="img"
          aria-label={`${label}. ${kbdHint}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              const step = Math.max(1, Math.round((i1 - i0) / 60));
              at(cur == null ? (e.key === "ArrowLeft" ? i1 : i0) : cur + (e.key === "ArrowLeft" ? -step : step));
            } else if (e.key === "Escape") off();
          }}
          onBlur={off}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line className="stroke-line-p [stroke-dasharray:2_6]" x1={ML} x2={W - MR} y1={Y(v)} y2={Y(v)} />
              <text className={AXIS_TEXT} x={ML - 8} y={Y(v)} textAnchor="end" dy=".32em">
                {fmtAxis(v)}
              </text>
            </g>
          ))}
          <line className="stroke-paper-ink/50" x1={ML} x2={W - MR} y1={MT + ph} y2={MT + ph} />
          {labels.map((xi, k) => (
            <text
              key={xi}
              className={AXIS_TEXT}
              x={X(xi)}
              y={H - 6}
              textAnchor={k === 0 ? "start" : k === labels.length - 1 ? "end" : "middle"}
            >
              {fmtX(xi)}
            </text>
          ))}
          {L.map((l, k) => {
            const p = seriesPath(
              l.top,
              l.kind === "area" ? (l.base ?? (() => 0)) : null,
              i0,
              i1,
              X,
              Y,
              stride,
            );
            return (
              <g key={k} className={l.cls}>
                {p.area && <path d={p.area} className="fill-current" fillOpacity={0.3} />}
                <path
                  d={p.top}
                  className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                />
              </g>
            );
          })}
          {cur != null && mk == null && (
            <g>
              <line className="stroke-paper-ink/45" x1={X(cur)} x2={X(cur)} y1={MT} y2={MT + ph} />
              {L.map((l, k) => (
                <circle
                  key={k}
                  r={5}
                  cx={X(cur)}
                  cy={Y(l.top(cur))}
                  className={`${l.cls} fill-current stroke-paper stroke-2`}
                />
              ))}
            </g>
          )}
          <rect
            x={ML}
            y={MT}
            width={pw}
            height={ph}
            className="fill-transparent"
            onPointerMove={(e) =>
              at(idxAtX(e.clientX - e.currentTarget.ownerSVGElement!.getBoundingClientRect().left, ML, pw, i0, i1))
            }
            onPointerLeave={off}
          />
          {L.length > 0 &&
            markers
              .filter((mi) => mi.i >= i0 && mi.i <= i1)
              .map((mi) => (
                <circle
                  key={mi.i}
                  r={5}
                  cx={X(mi.i)}
                  cy={Y(L[0].top(mi.i))}
                  className="cursor-pointer fill-paper-ink stroke-paper stroke-2"
                  tabIndex={0}
                  role="img"
                  aria-label={`${mi.label} ${fmtX(mi.i)}`}
                  onPointerEnter={() => {
                    setCur(null);
                    setMk(mi);
                  }}
                  onFocus={() => {
                    setCur(null);
                    setMk(mi);
                  }}
                  onPointerLeave={() => setMk(null)}
                  onBlur={() => setMk(null)}
                />
              ))}
        </svg>
      )}
      {cur != null && mk == null && (
        <div className={TIP} style={tip(X(cur), MT)}>
          <div className={TIP_DATE}>{fmtX(cur)}</div>
          {L.map((l, k) => (
            <div className="mt-1 flex items-center gap-2" key={k}>
              <i className={`${l.cls} h-[3px] w-3.5 shrink-0 bg-current`} />
              <b className="text-base font-bold">{l.fmt(cur)}</b>
              <span className="ml-auto text-mut-d">{l.name}</span>
            </div>
          ))}
        </div>
      )}
      {mk != null && L.length > 0 && (
        <div className={TIP} style={tip(X(mk.i), Math.max(0, Y(L[0].top(mk.i)) - 20))}>
          <div className={TIP_DATE}>{fmtX(mk.i)}</div>
          <div className="mt-1 flex items-center gap-2">
            <b className="text-base font-bold">{mk.label}</b>
            <span className="ml-auto text-mut-d">{L[0].fmt(mk.i)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
