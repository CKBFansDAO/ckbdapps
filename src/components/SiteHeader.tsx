import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { REPO_URL } from "@/lib/site";
import { LangSwitch } from "./LangSwitch";
import { NavLinks } from "./NavLinks";
import { SlotButton } from "./ui/SlotButton";

export function SiteHeader() {
  const t = useTranslations();
  return (
    <header className="on-dark sticky top-[env(safe-area-inset-top,0px)] z-50 h-(--hh) border-b border-line bg-page/86 backdrop-blur-md">
      <div className="in flex h-full items-center gap-5">
        <Link href="/" className="wide flex items-center gap-2.5 text-[1.15rem] no-underline" aria-label={t("title")}>
          <Image src="/brand/logo.png" alt="" width={34} height={34} className="rounded-lg" priority />
          <span>CKBdapps</span>
        </Link>
        <NavLinks />
        <div className="max-[760px]:ml-auto">
          <LangSwitch />
        </div>
        <SlotButton href={REPO_URL} className="max-[480px]:hidden">
          {t("add")}
        </SlotButton>
      </div>
    </header>
  );
}
