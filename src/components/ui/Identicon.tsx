// Ported exactly from design/ckbdapps-v3.html: FNV-1a with a final avalanche, then a mirrored 5x5 grid.

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  return h >>> 0;
}

function pop(x: number) {
  let n = 0;
  for (let i = 0; i < 15; i++) n += (x >> i) & 1;
  return n;
}

/** Cells of the mirrored 5x5 grid, as [x, y] pairs. Also used by the OG image. */
export function identiconCells(slug: string): [number, number][] {
  let h = hash(slug);
  let salt = 0;
  // Reseed until 7..11 of the 15 source cells are on, so no pattern is near empty or near full.
  while (pop(h & 32767) < 7 || pop(h & 32767) > 11) {
    salt++;
    h = hash(slug + salt);
  }
  const out: [number, number][] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if ((h >> (y * 3 + x)) & 1) {
        out.push([x, y]);
        if (x < 2) out.push([4 - x, y]);
      }
    }
  }
  return out;
}

export function Identicon({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <svg className={`ic ${className}`} viewBox="0 0 5 5" fill="currentColor" aria-hidden="true">
      {identiconCells(slug).map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.06} y={y + 0.06} width=".88" height=".88" />
      ))}
    </svg>
  );
}
