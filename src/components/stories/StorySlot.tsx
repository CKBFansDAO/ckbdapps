import { useTranslations } from "next-intl";
import { STORY_ISSUE_URL, STORY_TALK_URL } from "@/lib/site";
import { EmptySlot } from "../ui/EmptySlot";

/** The open slot: "your story could be next", with both ways to get in touch. */
export function StorySlot({ className = "" }: { className?: string }) {
  const t = useTranslations();
  return (
    <EmptySlot title={t("sy_slot_h")} className={className}>
      <p className="mt-0 mb-2 max-w-[46ch] text-[.95rem] text-mut">{t("sy_slot_p")}</p>
      <a className="linkbtn" href={STORY_ISSUE_URL} target="_blank" rel="noopener">
        {t("sy_slot_issue")}
      </a>
      <a className="linkbtn" href={STORY_TALK_URL} target="_blank" rel="noopener">
        {t("sy_slot_talk")}
      </a>
      <span className="mt-2">{t("sy_reply")}</span>
    </EmptySlot>
  );
}
