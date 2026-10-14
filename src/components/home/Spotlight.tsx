import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { REPO_URL } from "@/lib/site";
import { EmptySlot } from "../ui/EmptySlot";
import { Tile } from "../ui/Tile";

type TileData = { slug: string; name: string; meta: string; logo?: string };
type Props = { featured: TileData[]; community: TileData[]; grants: { slug: string; name: string; amount: string }[] };

const TILES = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3.5";

export function Spotlight({ featured, community, grants }: Props) {
  const t = useTranslations();
  return (
    <section className="on-paper py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="mb-[clamp(24px,4vw,44px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <h2 className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("spot_h")}</h2>
          <p className="m-0 max-w-[42ch] text-mut">{t("spot_p")}</p>
        </div>
        <h3 className="semi mt-[clamp(32px,5vw,56px)] mb-4 text-[1.15rem]">{t("feat_h")}</h3>
        <div className={TILES}>
          {featured.map((p) => (
            <Tile key={p.slug} {...p} />
          ))}
        </div>
        <h3 className="semi mt-[clamp(32px,5vw,56px)] mb-4 text-[1.15rem]">{t("cb_h")}</h3>
        <div className={TILES}>
          {community.map((p) => (
            <Tile key={p.slug} alt {...p} />
          ))}
        </div>
        <div className="mt-[clamp(32px,5vw,56px)] grid grid-cols-1 gap-3.5 min-[821px]:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))]">
          {grants.map((g) => (
            <div key={g.slug} className="flex min-h-[190px] flex-col justify-between gap-7 bg-ink p-6 text-white">
              <h3 className="m-0 text-[1.15rem] font-bold text-mut-d">{t("gr_h")}</h3>
              <div>
                <div className="wide text-[clamp(2rem,4vw,3rem)] leading-none">{g.amount}</div>
                <small className="mt-2 block text-[.9rem] text-mut-d">
                  <Link href={`/projects/${g.slug}`} className="text-white">
                    {g.name}
                  </Link>
                  , {t("gr_amt")}
                </small>
              </div>
            </div>
          ))}
          <EmptySlot href={REPO_URL} title={t("gr_open")} cta={t("gr_cta")} />
          <EmptySlot href={REPO_URL} title={t("gr_open")} cta={t("gr_cta")} />
        </div>
      </div>
    </section>
  );
}
