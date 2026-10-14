import Image from "next/image";
import { Identicon } from "./Identicon";

/** Project avatar inside the bracket. Falls back to the slug's identicon when there is no logo. */
export function FramedAvatar({ slug, logo }: { slug: string; logo?: string }) {
  return (
    <div className="framed">
      {logo ? (
        <Image className="ic" src={logo} alt="" width={256} height={256} sizes="190px" priority />
      ) : (
        <Identicon slug={slug} />
      )}
    </div>
  );
}
