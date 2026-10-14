"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The 64px cell grid behind the home hero, ported from design/ckbdapps-v3.html.
// Ambient lit cells, a glow that follows the pointer, ripples on click.
// Stops when the tab is hidden; effects are torn down when the route is hidden or left.
// With prefers-reduced-motion the grid is static: no ambient animation and no ripples.

const CS = 64;

/** "r,g,b" triple of a hex token, so canvas rgba() fills stay in sync with tokens.css. */
const rgbOf = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(v.replace("#", ""), 16);
  return `${n >> 16},${(n >> 8) & 255},${n & 255}`;
};

export function HeroGrid({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current!;
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PURPLE = rgbOf("--purple"),
      PURPLE_HI = rgbOf("--purple-hi"),
      WHITE = rgbOf("--white");
    let W = 0, H = 0, cols = 0, rows = 0, mx = -9999, my = -9999, next = 0, raf = 0;
    let lit = new Float32Array(1);
    let rip: { x: number; y: number; t: number }[] = [];

    const rr = (x: number, y: number, s: number) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, s, s, 8);
      else ctx.rect(x, y, s, s);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const R = 240;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c, x = c * CS + 3, y = r * CS + 3, s = CS - 6, cx = x + s / 2, cy = y + s / 2;
          const d = Math.hypot(cx - mx, cy - my), p = d < R ? 1 - d / R : 0;
          let l = lit[i];
          for (const q of rip) {
            const rd = (now - q.t) * 0.6, dd = Math.abs(Math.hypot(cx - q.x, cy - q.y) - rd);
            if (dd < CS && rd < 900) l = Math.max(l, 0.95 * (1 - dd / CS) * (1 - rd / 900));
          }
          rr(x, y, s);
          ctx.strokeStyle = `rgba(${WHITE},.07)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          const a = Math.max(p, l);
          if (a > 0.02) {
            rr(x, y, s);
            ctx.fillStyle = `rgba(${PURPLE},${(0.34 * Math.max(p * p, l)).toFixed(3)})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${PURPLE_HI},${(0.2 + 0.7 * a).toFixed(3)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
    };

    const size = () => {
      const b = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      W = b.width;
      H = b.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / CS) + 1;
      rows = Math.ceil(H / CS) + 1;
      lit = new Float32Array(cols * rows);
      for (let k = 0; k < cols * rows * 0.05; k++) lit[(Math.random() * lit.length) | 0] = 0.5 + Math.random() * 0.4;
      draw(performance.now());
    };

    const tick = (ts: number) => {
      if (ts > next) {
        lit[(Math.random() * lit.length) | 0] = 1;
        next = ts + 150;
      }
      for (let i = 0; i < lit.length; i++) lit[i] *= 0.975;
      rip = rip.filter((q) => ts - q.t < 1500);
      draw(ts);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!reduce && !document.hidden && !raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const local = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => {
      [mx, my] = local(e);
      if (reduce) draw(performance.now());
    };
    const onLeave = () => {
      mx = my = -9999;
      if (reduce) draw(performance.now());
    };
    const onDown = (e: PointerEvent) => {
      if (reduce || (e.target as Element).closest("input,button,a,li")) return;
      const [x, y] = local(e);
      rip.push({ x, y, t: performance.now() });
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    size();
    start();
    const ro = new ResizeObserver(size);
    ro.observe(hero);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="on-dark relative overflow-hidden pt-[clamp(56px,10vw,128px)] pb-[clamp(44px,7vw,88px)]"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full" />
      <div className="in relative">{children}</div>
    </section>
  );
}
