/** Bracket with a dashed plug: "this slot is open, add your project". */
export function EmptySlot({ href, title, cta }: { href: string; title: string; cta: string }) {
  return (
    <a className="empty-slot" href={href} target="_blank" rel="noopener">
      <strong className="semi">{title}</strong>
      <span>{cta}</span>
    </a>
  );
}
