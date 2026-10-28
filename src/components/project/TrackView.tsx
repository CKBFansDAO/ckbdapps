"use client";

import { useEffect } from "react";
import { addViewed } from "@/lib/viewed";

/** Remembers, in this browser only, that the project was opened. Renders nothing. */
export function TrackView({ slug }: { slug: string }) {
  useEffect(() => addViewed(slug), [slug]);
  return null;
}
