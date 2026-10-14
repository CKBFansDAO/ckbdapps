"use client";

import { useState, type ReactNode } from "react";
import { preconnect } from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// One client per browser tab, so Home and Halving share the chain data across navigations.
let browserClient: QueryClient | undefined;
const make = () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 30_000 } } });

/** Wraps only the parts of a page that read live chain data. */
export function LiveData({ children }: { children: ReactNode }) {
  preconnect("https://mainnet.ckb.dev", { crossOrigin: "anonymous" });
  const [client] = useState(() => (typeof window === "undefined" ? make() : (browserClient ??= make())));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
