"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { COMMUNITY_COUNT, communityPicks, LIKE_COUNT, recommend, type PickItem } from "@/lib/picks";
import { readViewed } from "@/lib/viewed";
import { Tile, TILE_GRID, type TileData } from "../ui/Tile";
import { SubHead } from "./SubHead";

export type PickTile = PickItem & TileData;

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

function Tiles({ bySlug, slugs, alt, end }: { bySlug: Map<string, PickTile>; slugs: string[]; alt?: boolean; end?: ReactNode }) {
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
 * listings, then community projects at random; no project shows twice. The static HTML carries the
 * seeded sets; after hydration the browser swaps in this visitor's own, which depend on localStorage
 * and Math.random and so cannot be known on the server.
 */
export function SpotlightPicks({ pool, likeInitial, communityInitial, newest, communityEnd }: Props) {
  const t = useTranslations();
  const bySlug = new Map(pool.map((p) => [p.slug, p]));
  const [picks, setPicks] = useState({ like: likeInitial, community: communityInitial, personal: false });

  useEffect(() => {
    const shown = new Set(newest.slugs);
    const like = recommend(pool, readViewed(), LIKE_COUNT, Math.random, shown);
    for (const p of like.items) shown.add(p.slug);
    const community = communityPicks(
      pool.filter((p) => !shown.has(p.slug)),
      COMMUNITY_COUNT,
      Math.random,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only inputs, see above
    setPicks({ like: like.items.map((p) => p.slug), community: community.map((p) => p.slug), personal: like.personal });
  }, [pool, newest.slugs]);

  return (
    <>
      <SubHead title={t("like_h")} note={t(picks.personal ? "like_viewed" : "like_new")} />
      <Tiles bySlug={bySlug} slugs={picks.like} />
      {newest.block}
      {picks.community.length > 0 && (
        <>
          <SubHead title={t("cb_h")} />
          <Tiles bySlug={bySlug} slugs={picks.community} alt end={communityEnd} />
        </>
      )}
    </>
  );
}
