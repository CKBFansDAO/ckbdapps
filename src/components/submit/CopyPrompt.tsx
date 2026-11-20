"use client";

import { useState } from "react";
import { SlotButton } from "@/components/ui/SlotButton";

export function CopyPrompt({
  prompt,
  copyLabel,
  copiedMessage,
  failedMessage,
}: {
  prompt: string;
  copyLabel: string;
  copiedMessage: string;
  failedMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <pre className="on-dark mt-0 mb-4 bg-ink p-4 font-mono text-[.85rem] leading-[1.65] whitespace-pre-wrap [overflow-wrap:anywhere]">
        {prompt}
      </pre>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <SlotButton onClick={copy}>{copyLabel}</SlotButton>
        <span role="status" className="text-sm text-mut">
          {status === "copied" && copiedMessage}
          {status === "failed" && failedMessage}
        </span>
      </div>
    </>
  );
}
