/** Heading of one block inside Spotlight, with an optional one-line note under it. */
export function SubHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mt-[clamp(32px,5vw,56px)] mb-4">
      <h3 className="semi m-0 text-[1.15rem]">{title}</h3>
      {note && <p className="mt-1 mb-0 text-[.9rem] text-mut">{note}</p>}
    </div>
  );
}
