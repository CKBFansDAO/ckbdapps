"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { COMMUNITY_COUNT, communityPicks, LIKE_COUNT, PROOF_COUNT, recommend, shuffle, type PickItem } from "@/lib/picks";
import { readViewed } from "@/lib/viewed";
import { Tile, TILE_GRID, type TileData } from "../ui/Tile";
import { SubHead } from "./SubHead";

export type PickTile = PickItem & TileData;

function PickSlot({ pending, children }: { pending: boolean; children: ReactNode }) {
  return pending ? <div className="pick-placeholder grid">{children}</div> : children;
}

/** Sample the testnet pool in the browser before showing its cards. */
export function ProofTiles({ pool }: { pool: TileData[] }) {
  const [proofs, setProofs] = useState<TileData[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only random selection after hydration
    setProofs(shuffle(pool, Math.random).slice(0, PROOF_COUNT));
  }, [pool]);

  return (
    <div className={TILE_GRID}>
      {(proofs ?? pool.slice(0, PROOF_COUNT)).map((proof) => (
        <PickSlot key={proof.slug} pending={!proofs}>
          <Tile alt {...proof} />
        </PickSlot>
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

function Tiles({ bySlug, slugs, pending, alt, end }: {
  bySlug: Map<string, PickTile>;
  slugs: string[];
  pending: boolean;
  alt?: boolean;
  end?: ReactNode;
}) {
  return (
    <div className={TILE_GRID}>
      {slugs.map((s) => {
        const { slug, name, meta, logo } = bySlug.get(s)!;
        return (
          <PickSlot key={slug} pending={pending}>
            <Tile slug={slug} name={name} meta={meta} logo={logo} alt={alt} />
          </PickSlot>
        );
      })}
      {end}
    </div>
  );
}

/**
 * "You might like" (projects like the ones opened on this device, or a random start), then the newest
 * listings, then community projects at random; no project shows twice. The seeded cards reserve
 * space until the browser has sampled its recommendations using localStorage and Math.random.
 */
export function SpotlightPicks({ pool, likeInitial, communityInitial, newest, communityEnd }: Props) {
  const t = useTranslations();
  const bySlug = new Map(pool.map((p) => [p.slug, p]));
  const [picks, setPicks] = useState<{ like: string[]; community: string[]; personal: boolean } | null>(null);
  const communitySlugs = picks?.community ?? communityInitial;

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
      <SubHead title={t("like_h")} note={t(picks?.personal ? "like_viewed" : "like_new")} />
      <Tiles bySlug={bySlug} slugs={picks?.like ?? likeInitial} pending={!picks} />
      {newest.block}
      {communitySlugs.length > 0 && (
        <>
          <SubHead title={t("cb_h")} />
          <Tiles bySlug={bySlug} slugs={communitySlugs} pending={!picks} alt end={communityEnd} />
        </>
      )}
    </>
  );
}
