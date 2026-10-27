import Image from "next/image";
import { Identicon } from "./Identicon";

type Size = "lg" | "md" | "sm";

// lg is the project hero; md sits in tiles and grid cards; sm in list rows. The bracket keeps the
// logo's proportions at every size: border ≈ 9%, padding ≈ 7%, plug ≈ 21% of the frame width.
const SIZE: Record<Size, { frame: string; px: string }> = {
  lg: { frame: "", px: "190px" },
  md: { frame: "w-[68px] border-[6px] p-[5px] [--plug:14px]", px: "48px" },
  sm: { frame: "w-11 border-4 p-[3px] [--plug:9px]", px: "32px" },
};

type Props = { slug: string; logo?: string; size?: Size; className?: string };

/** Project avatar inside the bracket. Falls back to the slug's identicon when there is no logo. */
export function FramedAvatar({ slug, logo, size = "lg", className = "" }: Props) {
  const { frame, px } = SIZE[size];
  const lg = size === "lg";
  return (
    <div className={`framed shrink-0 ${frame} ${className}`}>
      {logo ? (
        <Image
          className={lg ? "ic" : "ic size-full object-contain"}
          src={logo}
          alt=""
          width={lg ? 256 : 64}
          height={lg ? 256 : 64}
          sizes={px}
          priority={lg}
        />
      ) : (
        <Identicon slug={slug} className={lg ? "" : "size-full text-(--avatar-ic,var(--purple-hi))"} />
      )}
    </div>
  );
}
