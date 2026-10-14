import { useTranslations } from "next-intl";

type Props = { chips: { id: string; label: string }[]; selected: string | null; onSelect: (id: string | null) => void };

export function FilterChips({ chips, selected, onSelect }: Props) {
  const t = useTranslations();
  return (
    <div className="flex flex-wrap gap-2 pt-[18px] pb-1.5" role="group" aria-label={t("cats")}>
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={selected === c.id}
          onClick={() => onSelect(selected === c.id ? null : c.id)}
          // The visible chip stays compact; the ::before extends the hit area to 40px.
          className="relative border-[1.5px] border-line px-3 py-[5px] text-[.85rem] font-semibold before:absolute before:inset-x-0 before:-inset-y-1 hover:border-fg aria-pressed:border-purple aria-pressed:bg-purple aria-pressed:text-white"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
