import { useTranslations } from "next-intl";
import { EmptySlot } from "@/components/ui/EmptySlot";
import { SlotButton } from "@/components/ui/SlotButton";
import { REPO_URL } from "@/lib/site";

export default function NotFound() {
  const t = useTranslations();
  return (
    <main className="on-paper py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <h1 className="wide m-0 text-[clamp(2.6rem,9vw,7rem)] leading-[.92]">{t("nf_h")}</h1>
        <p className="mt-5 mb-8 max-w-[52ch] text-[1.1rem] text-mut">{t("nf_p")}</p>
        <div className="flex flex-wrap items-center gap-x-[22px] gap-y-4">
          <SlotButton big href="/explore">
            {t("n_explore")}
          </SlotButton>
        </div>
        <div className="mt-[clamp(32px,5vw,56px)] max-w-[520px]">
          <EmptySlot href={REPO_URL} title={t("gr_open")} cta={t("add")} />
        </div>
      </div>
    </main>
  );
}
