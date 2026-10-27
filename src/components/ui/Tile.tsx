import { Link } from "@/i18n/navigation";
import { FramedAvatar } from "./FramedAvatar";

type Props = { slug: string; name: string; meta: string; logo?: string; alt?: boolean; small?: boolean };

// Filled (featured) or outlined (community picks); both turn purple on hover, where the avatar's
// bracket follows the text colour and its plug flips to white.
const SKIN = {
  solid: "bg-ink text-white [--tile-mut:var(--mut-d)] [--avatar-ic:var(--purple-hi)]",
  alt: "border-2 border-fg text-fg [--tile-mut:var(--mut)] [--avatar-ic:var(--accent)] hover:border-purple",
};

// Phones get compact rows; wider screens stack the avatar over the name.
const LAYOUT = {
  row: "items-center gap-4 p-4 sm:min-h-[200px] sm:flex-col sm:items-start sm:justify-between sm:gap-8 sm:p-6",
  small: "min-h-[170px] flex-col justify-between gap-4 p-3.5",
};

/** Project tile linking to its page. `alt` is the outlined variant used for community picks. */
export function Tile({ slug, name, meta, logo, alt, small }: Props) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`group flex min-w-0 no-underline transition-colors duration-150 hover:bg-purple hover:text-white hover:[--avatar-ic:var(--white)] hover:[--avatar-plug:var(--white)] motion-reduce:transition-none ${SKIN[alt ? "alt" : "solid"]} ${LAYOUT[small ? "small" : "row"]}`}
    >
      <FramedAvatar slug={slug} logo={logo} size="md" className="border-current" />
      <span className="min-w-0">
        <h3
          className={`semi m-0 leading-none [overflow-wrap:anywhere] ${small ? "text-[1.15rem]" : "text-[1.25rem] sm:text-[clamp(1.35rem,2vw,1.7rem)]"}`}
        >
          {name}
        </h3>
        <p className="mt-2 mb-0 text-[.85rem] text-(--tile-mut) group-hover:text-white">{meta}</p>
      </span>
    </Link>
  );
}
