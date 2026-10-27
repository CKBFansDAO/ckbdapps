import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LangSwitch } from "./LangSwitch";
import { NavLinks } from "./NavLinks";
import { SlotButton } from "./ui/SlotButton";

export function SiteHeader() {
  const t = useTranslations();
  return (
    // transform-gpu + touch-manipulation: without its own compositing layer, a sticky
    // backdrop-filter header swallows taps on iOS/WebView browsers (click never fires).
    <header className="on-dark sticky top-[env(safe-area-inset-top,0px)] z-50 h-(--hh) touch-manipulation transform-gpu border-b border-line bg-page/86 backdrop-blur-md">
      <div className="in flex h-full items-center gap-5">
        <Link href="/" className="wide flex items-center gap-2.5 text-[1.15rem] no-underline" aria-label={t("title")}>
          <Image src="/brand/logo.png" alt="" width={34} height={34} className="rounded-lg" priority />
          <span>CKBdapps</span>
        </Link>
        <NavLinks />
        <div className="ml-auto min-[761px]:ml-0">
          <LangSwitch />
        </div>
        <SlotButton href="/submit" className="hidden min-[481px]:inline-flex">
          {t("add")}
        </SlotButton>
      </div>
    </header>
  );
}
