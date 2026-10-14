import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Countdown } from "@/components/halving/Countdown";
import { Explainer } from "@/components/halving/Explainer";
import { LiveData } from "@/components/halving/LiveData";
import { Schedule } from "@/components/halving/Schedule";
import { TipSummary } from "@/components/halving/TipSummary";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/halving">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("hv_title"), description: t("hv_what_p"), alternates: alternates(locale, "/halving") };
}

// Static shell; the countdown, tip and "now" row fill in from the chain in the browser.
export default function HalvingPage() {
  return (
    <main>
      <LiveData>
        <Countdown />
        <TipSummary />
        <Schedule />
      </LiveData>
      <Explainer />
    </main>
  );
}
