"use client";

import { useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, useRouter } from "@/i18n/navigation";
import { Identicon } from "./Identicon";

export type SearchItem = { slug: string; name: string; tags: string[] };

/**
 * Hero search: a thick bracket whose plug is the submit button.
 * Submitting goes to Explore with `?q=`; picking a suggestion opens the project.
 * Without JS it is a plain GET form to Explore.
 */
export function SlotSearch({ items, placeholders }: { items: SearchItem[]; placeholders: string[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [ph, setPh] = useState(0);

  const v = q.trim().toLowerCase();
  const matches = v
    ? items
        .filter((it) => `${it.name} ${it.tags.join(" ")}`.toLowerCase().includes(v))
        .sort(
          (a, b) =>
            Number(b.name.toLowerCase().startsWith(v)) - Number(a.name.toLowerCase().startsWith(v)) ||
            a.name.localeCompare(b.name, "en"),
        )
        .slice(0, 6)
    : [];
  const expanded = open && matches.length > 0;

  // Rotate the example in the placeholder while the field is idle.
  useEffect(() => {
    if (q || focused || placeholders.length < 2) return;
    const timer = setInterval(() => {
      if (!document.hidden) setPh((i) => i + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, [q, focused, placeholders.length]);

  const openProject = (slug: string) => {
    setOpen(false);
    router.push(`/projects/${slug}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      // First Escape closes the list; with the list closed the browser's native clear applies.
      if (expanded) e.preventDefault();
      setOpen(false);
      setSel(-1);
    } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && matches.length) {
      e.preventDefault();
      setOpen(true);
      setSel((s) => (s + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (expanded && sel > -1) return openProject(matches[sel].slug);
    setOpen(false);
    router.push(v ? { pathname: "/explore", query: { q: v } } : "/explore");
  };

  return (
    <form
      className="slot-search"
      role="search"
      action={getPathname({ href: "/explore", locale })}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <div className="slot-bar">
        <input
          type="search"
          name="q"
          role="combobox"
          aria-label={t("search_label")}
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-expanded={expanded}
          aria-activedescendant={expanded && sel > -1 ? `${id}-${sel}` : undefined}
          placeholder={placeholders.length ? t("ph", { name: placeholders[ph % placeholders.length] }) : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(-1);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setOpen(false);
          }}
        />
        <button className="plug" type="submit">
          {t("sgo")}
        </button>
      </div>
      <ul className="suggest" id={`${id}-list`} role="listbox" aria-label={t("search_label")} hidden={!expanded}>
        {matches.map((it, i) => (
          <li
            key={it.slug}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === sel}
            // Keep focus in the input so blur does not close the list before the click lands.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => openProject(it.slug)}
          >
            <Identicon slug={it.slug} />
            <b>{it.name}</b>
            <span className="c">{it.tags[0]}</span>
          </li>
        ))}
      </ul>
    </form>
  );
}
