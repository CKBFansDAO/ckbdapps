"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { REPORT_CATEGORIES, REPORT_MAX, newIssueUrl, type ReportCategory } from "@/lib/report";
import { SlotButton } from "../ui/SlotButton";

type Status = { is: "idle" | "sending" | "failed" } | { is: "sent"; url?: string };
type Props = { slug: string; name: string; url: string };

/** "Report a problem" on a project page: no GitHub account needed. The server turns it into an issue. */
export function ReportProblem({ slug, name, url }: Props) {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const openedAt = useRef(0);
  const [status, setStatus] = useState<Status>({ is: "idle" });
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState("");

  const open = () => {
    openedAt.current = Date.now();
    dialog.current?.showModal();
  };
  // A sent report starts fresh next time; an unsent one keeps what was typed.
  const onClose = () => {
    if (status.is !== "sent") return;
    setStatus({ is: "idle" });
    setCategory(null);
    setDescription("");
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ is: "sending" });
    const website = new FormData(e.currentTarget).get("website");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, category, description, website, elapsed: Date.now() - openedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ is: "sent", url: ((await res.json()) as { url?: string }).url });
    } catch {
      setStatus({ is: "failed" });
    }
  };

  return (
    <>
      <button type="button" onClick={open} className="linkbtn mt-3 min-h-10 cursor-pointer text-[.9rem] font-semibold">
        {t("rp_open")}
      </button>
      <dialog
        ref={dialog}
        onClose={onClose}
        aria-labelledby="report-title"
        className="on-dark m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-32px))] overflow-y-auto border-2 border-fg bg-ink p-[clamp(18px,4vw,28px)] text-fg backdrop:bg-page/80"
      >
        <h2 id="report-title" className="semi mt-0 mb-2.5 text-[1.3rem]">
          {t("rp_title", { name })}
        </h2>
        {status.is === "sent" ? (
          <div role="status">
            <p className="mt-0 mb-4">{t("rp_done")}</p>
            {status.url && (
              <p className="mt-0 mb-5">
                <a className="linkbtn" href={status.url} target="_blank" rel="noopener">
                  {t("rp_view")}
                </a>
              </p>
            )}
            <SlotButton onClick={() => dialog.current?.close()}>{t("rp_close")}</SlotButton>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="mt-0 mb-5 text-[.92rem] text-mut">{t("rp_note")}</p>
            <fieldset className="m-0 mb-4 border-0 p-0">
              <legend className="mb-1 p-0 font-semibold">{t("rp_cat")}</legend>
              {REPORT_CATEGORIES.map((c) => (
                <label key={c} className="flex min-h-10 cursor-pointer items-center gap-2.5 py-1">
                  <input
                    type="radio"
                    name="category"
                    required
                    checked={category === c}
                    onChange={() => setCategory(c)}
                    className="m-0 size-[17px] flex-none accent-accent"
                  />
                  {t(`rp_c_${c}`)}
                </label>
              ))}
            </fieldset>
            <label className="mb-1.5 block font-semibold" htmlFor="report-details">
              {t(category === "other" ? "rp_desc" : "rp_desc_opt")}
            </label>
            <textarea
              id="report-details"
              rows={3}
              maxLength={REPORT_MAX}
              required={category === "other"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("rp_ph")}
              className="block w-full rounded-none border-2 border-fg bg-surface p-3 text-fg placeholder:text-mut placeholder:opacity-100"
            />
            {/* Honeypot: hidden from people, filled in by simple scripts. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" hidden />
            {status.is === "failed" && (
              <p role="alert" className="mt-4 mb-0 border-[1.5px] border-dashed border-accent px-3.5 py-2.5">
                {t("rp_fail")}{" "}
                <a className="linkbtn" href={newIssueUrl({ slug, name, url }, { category: category ?? "other", description })} target="_blank" rel="noopener">
                  {t("rp_fail_cta")}
                </a>
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <SlotButton type="submit" disabled={status.is === "sending"}>
                {t(status.is === "sending" ? "rp_sending" : "rp_send")}
              </SlotButton>
              <button type="button" onClick={() => dialog.current?.close()} className="linkbtn min-h-10 cursor-pointer font-semibold">
                {t("rp_cancel")}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
