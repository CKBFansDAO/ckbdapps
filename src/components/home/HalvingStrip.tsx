import { useTranslations } from "next-intl";
import { HalvingDays } from "../halving/Countdown";
import { LiveData } from "../halving/LiveData";
import { Slot } from "../ui/Slot";
import { SlotButton } from "../ui/SlotButton";

/** "CKB halves in N days", with N estimated live from the chain (same data as the Halving page). */
export function HalvingStrip() {
  const t = useTranslations();
  return (
    <section className="on-dark border-b border-line">
      <div className="in flex flex-wrap items-center justify-between gap-x-10 gap-y-[22px] py-[clamp(30px,4.5vw,52px)]">
        <p className="wide m-0 text-[clamp(1.7rem,4.2vw,3.4rem)] leading-[1.1] zh:leading-[1.3]">
          {t.rich("hs", {
            slot: () => (
              <Slot>
                <LiveData>
                  <HalvingDays />
                </LiveData>
              </Slot>
            ),
          })}
        </p>
        <SlotButton big href="/halving">
          {t("hs_cta")}
        </SlotButton>
      </div>
    </section>
  );
}
