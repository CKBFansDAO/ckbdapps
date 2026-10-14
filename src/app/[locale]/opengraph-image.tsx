import { ImageResponse } from "next/og";
import { brandLogoDataUrl } from "@/lib/og";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CKBdapps, the directory for the Nervos CKB ecosystem";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Default shared image: the headline with CKB in the slot. English only (the OG font has no CJK glyphs). */
export default async function Image() {
  const brand = await brandLogoDataUrl();
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#121218", color: "white", padding: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <img src={brand} width={48} height={48} alt="" style={{ borderRadius: 10 }} />
          CKBdapps
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>
          <div>Find what&apos;s</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
            built on
            <div style={{ display: "flex", position: "relative", marginLeft: 32, padding: "4px 28px 8px 20px", border: "12px solid white", borderRight: "0" }}>
              CKB
              <div style={{ position: "absolute", right: -34, top: -12, bottom: -12, width: 34, background: "#733dff" }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a3a2b3" }}>The directory for the Nervos CKB ecosystem</div>
      </div>
    ),
    size,
  );
}
