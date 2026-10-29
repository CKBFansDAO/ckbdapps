import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EmptySlot } from "../ui/EmptySlot";
import { Tile, TILE_GRID, type TileData } from "../ui/Tile";
import { SpotlightPicks, type PickTile } from "./Picks";
import { SubHead } from "./SubHead";

type Props = {
  pool: PickTile[];
  likeInitial: string[];
  communityInitial: string[];
  /** Number of community projects in the directory, for "see all". */
  communityTotal: number;
  /** Newest by `listed` date; the block is left out while no project has one. */
  newest: TileData[];
  /** A few testnet proofs at random; the block is left out while there are none. */
  proofs: TileData[];
};

/** "Start here": nothing is picked by hand. Recommendations, newest listings, community at random. */
export function Spotlight({ pool, likeInitial, communityInitial, communityTotal, newest, proofs }: Props) {
  const t = useTranslations();
  return (
    <section className="on-paper py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <h2 className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("spot_h")}</h2>
          <p className="m-0 max-w-[42ch] text-mut">{t("spot_p")}</p>
        </div>
        <SpotlightPicks
          pool={pool}
          likeInitial={likeInitial}
          communityInitial={communityInitial}
          newest={{
            slugs: newest.map((p) => p.slug),
            block: newest.length > 0 && (
              <>
                <SubHead title={t("new_h")} />
                <div className={TILE_GRID}>
                  {newest.map((p) => (
                    <Tile key={p.slug} {...p} />
                  ))}
                </div>
              </>
            ),
          }}
          communityEnd={
            <EmptySlot title={t("gr_open")}>
              <Link href={{ pathname: "/explore", query: { community: "1" } }} className="linkbtn">
                {t("cb_all", { n: communityTotal })}
              </Link>
              <Link href="/submit" className="linkbtn">
                {t("add")}
              </Link>
            </EmptySlot>
          }
        />
        {proofs.length > 0 && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-x-8">
              <SubHead title={t("pf_home_h")} note={t("pf_home_p")} />
              <Link href="/proofs" className="linkbtn mb-4">
                {t("pf_home_all")}
              </Link>
            </div>
            <div className={TILE_GRID}>
              {proofs.map((p) => (
                <Tile key={p.slug} alt {...p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
