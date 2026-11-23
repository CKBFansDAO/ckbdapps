import { Link } from "@/i18n/navigation";
import { storyAssetPath } from "@/lib/content/stories";
import { FramedAvatar } from "../ui/FramedAvatar";

export type Byline = { slug: string; person: { name: string; avatar?: string }; project: { slug: string; name: string } };

/** The builder's avatar (their own picture, or an identicon of their name) for a story. */
export function PersonAvatar({ story, size = "sm", className = "" }: { story: Omit<Byline, "project">; size?: "sm" | "md"; className?: string }) {
  const { avatar, name } = story.person;
  return <FramedAvatar slug={name} logo={avatar && storyAssetPath(story.slug, avatar)} size={size} className={className} />;
}

/** "name // project": who the story is about and what they build. */
export function NameLine({ story, link, className = "" }: { story: Byline; link?: boolean; className?: string }) {
  return (
    <span className={`font-bold ${className}`}>
      {story.person.name}
      <span aria-hidden="true" className="mx-[.35em] font-semibold text-mut">
        {"//"}
      </span>
      <span className="sr-only">, </span>
      {link ? (
        <Link href={`/projects/${story.project.slug}`} className="linkbtn">
          {story.project.name}
        </Link>
      ) : (
        <span className="font-semibold text-mut">{story.project.name}</span>
      )}
    </span>
  );
}

/** Avatar plus name line. */
export function StoryByline({ story, link, className = "" }: { story: Byline; link?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PersonAvatar story={story} />
      <NameLine story={story} link={link} />
    </div>
  );
}
