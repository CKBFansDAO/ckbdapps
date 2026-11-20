"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { COMMUNITY_COUNT, communityPicks, LIKE_COUNT, PROOF_COUNT, recommend, shuffle, type PickItem } from "@/lib/picks";
import { readViewed } from "@/lib/viewed";
import { Tile, TILE_GRID, type TileData } from "../ui/Tile";
import { SubHead } from "./SubHead";

export type PickTile = PickItem & TileData;

/** Keep the original selection if a visitor could already have seen or focused it. */
function canRefresh(element: HTMLDivElement | null): boolean {
  return element !== null
    && element.getBoundingClientRect().top >= window.innerHeight
    && !element.contains(document.activeElement);
}

/** Render the seeded picks immediately, then sample again if the grid is still below the viewport. */
export function ProofTiles({ pool }: { pool: TileData[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const [proofs, setProofs] = useState<TileData[] | null>(null);

  useEffect(() => {
    if (!canRefresh(grid.current)) return;
    setProofs(shuffle(pool, Math.random).slice(0, PROOF_COUNT));
  }, [pool]);

  return (
    <div ref={grid} className={TILE_GRID}>
      {(proofs ?? pool.slice(0, PROOF_COUNT)).map((proof) => (
        <Tile key={proof.slug} alt {...proof} />
      ))}
    </div>
  );
}

type Props = {
  pool: PickTile[];
  /** Seeded picks for the static HTML, already free of repeats across the blocks. */
  likeInitial: string[];
  communityInitial: string[];
  /** Shown between the two blocks and never repeated in them. */
  newest: { slugs: string[]; block: ReactNode };
  /** Last cell of the community grid (see all, add yours). */
  communityEnd: ReactNode;
};

function Tiles({ bySlug, slugs, alt, end }: {
  bySlug: Map<string, PickTile>;
  slugs: string[];
  alt?: boolean;
  end?: ReactNode;
}) {
  return (
    <div className={TILE_GRID}>
      {slugs.map((s) => {
        const { slug, name, meta, logo } = bySlug.get(s)!;
        return <Tile key={slug} slug={slug} name={name} meta={meta} logo={logo} alt={alt} />;
      })}
      {end}
    </div>
  );
}

/**
 * "You might like" (projects like the ones opened on this device, or a random start), then the newest
 * listings, then community projects at random; no project shows twice. The seeded cards render
 * immediately. Refresh both selections together only while the first block is below the viewport.
 */
export function SpotlightPicks({ pool, likeInitial, communityInitial, newest, communityEnd }: Props) {
  const t = useTranslations();
  const firstBlock = useRef<HTMLDivElement>(null);
  const bySlug = new Map(pool.map((p) => [p.slug, p]));
  const [picks, setPicks] = useState<{ like: string[]; community: string[]; personal: boolean } | null>(null);
  const communitySlugs = picks?.community ?? communityInitial;

  useEffect(() => {
    if (!canRefresh(firstBlock.current)) return;
    const shown = new Set(newest.slugs);
    const like = recommend(pool, readViewed(), LIKE_COUNT, Math.random, shown);
    for (const p of like.items) shown.add(p.slug);
    const community = communityPicks(
      pool.filter((p) => !shown.has(p.slug)),
      COMMUNITY_COUNT,
      Math.random,
    );
    setPicks({ like: like.items.map((p) => p.slug), community: community.map((p) => p.slug), personal: like.personal });
  }, [pool, newest.slugs]);

  return (
    <>
      <div ref={firstBlock}>
        <SubHead title={t("like_h")} note={t(picks?.personal ? "like_viewed" : "like_new")} />
        <Tiles bySlug={bySlug} slugs={picks?.like ?? likeInitial} />
      </div>
      {newest.block}
      {communitySlugs.length > 0 && (
        <>
          <SubHead title={t("cb_h")} />
          <Tiles bySlug={bySlug} slugs={communitySlugs} alt end={communityEnd} />
        </>
      )}
    </>
  );
}
