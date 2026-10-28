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
      <div className="in flex h-full items-center gap-4 lg:gap-5">
        {/* The wordmark spells CKBdapps itself (840x128): 22px tall below 1024px, where the nav row is tight, 26px above. */}
        <Link href="/" className="flex min-h-10 shrink-0 items-center" aria-label={t("title")}>
          <Image
            src="/brand/logo-wordmark.png"
            alt=""
            width={840}
            height={128}
            sizes="171px"
            className="h-[22px] w-auto lg:h-[26px]"
            priority
          />
        </Link>
        <NavLinks />
        <div className="ml-auto lg:ml-0">
          <LangSwitch />
        </div>
        <SlotButton href="/submit" className="hidden min-[481px]:inline-flex">
          {t("add")}
        </SlotButton>
      </div>
    </header>
  );
}
