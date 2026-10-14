import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { htmlLang, routing } from "@/i18n/routing";
import { alternates, SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

// Variable Archivo with the width axis: wdth 125 for display, 112 for sub-heads, 100 for body.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

// Data text only. "optional": if it is not there at first paint the fallback stays for that page view,
// so wrapped mono lines (hashes, the source file panel) never reflow and shift the page.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "optional",
});

// Self-hosted as Google's unicode-range slices: the browser only downloads the slices
// for characters on the page, and nothing at all on pages without Chinese text.
const notoSC = Noto_Sans_SC({
  preload: false,
  variable: "--font-noto-sc",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("kicker"),
    alternates: alternates(locale, ""),
    openGraph: { siteName: t("title"), type: "website", locale: htmlLang(locale).replace("-", "_") },
    twitter: { card: "summary_large_image" },
    // /favicon.ico comes from src/app/favicon.ico (generated from the brand logo)
    icons: { apple: "/brand/logo.png" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={htmlLang(locale)}
      className={`${archivo.variable} ${jetbrains.variable} ${notoSC.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
