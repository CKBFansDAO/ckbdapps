import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Identicon } from "./Identicon";

type Props = { slug: string; name: string; meta: string; logo?: string; alt?: boolean; small?: boolean };

/** Project tile linking to its page. `alt` is the outlined variant used for community picks. */
export function Tile({ slug, name, meta, logo, alt, small }: Props) {
  return (
    <Link className={["tile", alt && "alt", small && "sm"].filter(Boolean).join(" ")} href={`/projects/${slug}`}>
      <span className="block w-full">
        {logo ? (
          <Image className="ic h-auto" src={logo} alt="" width={256} height={256} sizes="(max-width: 600px) 45vw, 120px" />
        ) : (
          <Identicon slug={slug} />
        )}
      </span>
      <span>
        <h3 className="semi">{name}</h3>
        <p>{meta}</p>
      </span>
    </Link>
  );
}
