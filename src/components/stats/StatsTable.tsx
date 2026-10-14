type Props = { summary: string; head: string[]; rows: string[][] };

const TH = "border-b-2 border-fg py-2 pr-2.5 pl-0 font-sans font-bold";
const TD = "border-b border-line-p py-2 pr-2.5 pl-0";

/** "View as table": a few evenly sampled rows for the current window. */
export function StatsTable({ summary, head, rows }: Props) {
  return (
    <details className="mt-10">
      <summary className="cursor-pointer py-2 font-bold">{summary}</summary>
      <table className="mt-2.5 w-full border-collapse font-mono text-[.85rem] font-medium text-paper-ink">
        <thead>
          <tr>
            {head.map((h, j) => (
              <th key={h} className={`${TH} ${j ? "text-right" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k}>
              <td className={TD}>{r[0]}</td>
              {r.slice(1).map((v, j) => (
                <td key={j} className={`${TD} text-right`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
