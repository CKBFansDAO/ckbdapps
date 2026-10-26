"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const ITEMS = [
  { key: "n_home", href: "/", match: (p: string) => p === "/" },
  { key: "n_explore", href: "/explore", match: (p: string) => p.startsWith("/explore") },
  { key: "n_map", href: "/#map" },
  { key: "n_halving", href: "/halving", match: (p: string) => p.startsWith("/halving") },
  { key: "n_stats", href: "/stats", match: (p: string) => p.startsWith("/stats") },
] as const;

const ROW =
  "flex min-h-12 items-center gap-3.5 border-b border-line text-[1.05rem] font-bold text-mut no-underline hover:text-fg aria-[current=page]:text-fg before:size-[9px] before:flex-none before:border before:border-fg/45 before:content-[''] aria-[current=page]:before:border-purple-hi aria-[current=page]:before:bg-purple";

/** Desktop nav row; below 761px a disclosure menu replaces it (the prototype hides nav there,
    which leaves Stats and Map unreachable on phones). The trigger uses order-last so it lands
    after the language switch at the far edge. */
export function NavLinks() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Escape closes the menu and puts focus back on its button, which would otherwise be lost.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav aria-label={t("nav")} className="ml-auto hidden gap-6 min-[761px]:flex">
        {ITEMS.map((it) => {
          const current = "match" in it && it.match(pathname);
          return (
            <Link
              key={it.key}
              href={it.href}
              aria-current={current ? "page" : undefined}
              className="border-b-2 border-transparent py-1.5 text-[.92rem] font-semibold text-mut no-underline hover:border-purple-hi hover:text-fg aria-[current=page]:border-purple-hi aria-[current=page]:text-fg"
            >
              {t(it.key)}
            </Link>
          );
        })}
      </nav>

      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="order-last inline-flex size-10 flex-none touch-manipulation items-center justify-center border-2 border-fg text-fg hover:bg-fg hover:text-ink active:bg-fg active:text-ink min-[761px]:hidden"
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="block">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" className="block">
            <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
        <span className="sr-only">{t("menu")}</span>
      </button>

      {open && (
        <>
          {/* Portalled to body: the sticky header's backdrop-filter makes it the containing
              block for fixed descendants, so a fixed scrim inside it would only cover the bar. */}
          {createPortal(
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-page/70 min-[761px]:hidden"
            />,
            document.body,
          )}
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-full border-b-2 border-fg bg-ink min-[761px]:hidden"
          >
            <nav aria-label={t("nav")} className="in flex flex-col py-2">
              {ITEMS.map((it) => {
                const current = "match" in it && it.match(pathname);
                return (
                  <Link
                    key={it.key}
                    href={it.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={ROW}
                  >
                    {t(it.key)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
