import { useTranslations } from "next-intl";
import { REPO_URL } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations();
  return (
    <footer className="on-dark overflow-hidden pt-[clamp(40px,6vw,72px)]">
      <div className="in flex flex-wrap items-center justify-between gap-x-7 gap-y-3 pb-7 text-mut">
        <span>{t("foot")}</span>
        <a href={REPO_URL} target="_blank" rel="noopener" className="text-fg">
          {REPO_URL.replace("https://", "")}
        </a>
      </div>
      <span
        aria-hidden="true"
        className="wide block pb-2 text-[clamp(3rem,14.7vw,13rem)] leading-[.86] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1.5px_color-mix(in_srgb,var(--color-white)_34%,transparent)]"
      >
        CKBdapps
      </span>
    </footer>
  );
}
