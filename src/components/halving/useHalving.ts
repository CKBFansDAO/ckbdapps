"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEpochStartHeader, getTipHeader } from "@/lib/ckb-rpc";
import {
  estimateHalvingTime,
  isNearHalving,
  justHalved,
  nextHalvingEpoch,
  parseEpoch,
  prevHalvingEpoch,
  refEpochFor,
  type Epoch,
} from "@/lib/halving";

export type HalvingData = {
  tip: Epoch;
  blockNumber: number;
  /** Next halving epoch */
  target: number;
  /** Estimated time of the next halving, ms */
  estimate: number;
  /** Set during the ~30 days after a halving */
  halved?: { epoch: number; time: number };
  near: boolean;
};

async function fetchHalving(): Promise<HalvingData> {
  const header = await getTipHeader();
  const tip = parseEpoch(header.epoch);
  const tipTime = Number(BigInt(header.timestamp));
  const [ref, prev] = await Promise.all([
    getEpochStartHeader(refEpochFor(tip)),
    justHalved(tip) ? getEpochStartHeader(prevHalvingEpoch(tip.number)) : undefined,
  ]);
  return {
    tip,
    blockNumber: Number(BigInt(header.number)),
    target: nextHalvingEpoch(tip.number),
    estimate: estimateHalvingTime({ tip, tipTime, refStartTime: Number(BigInt(ref.timestamp)) }),
    halved: prev && { epoch: prevHalvingEpoch(tip.number), time: Number(BigInt(prev.timestamp)) },
    near: isNearHalving(tip),
  };
}

/** Live chain data for the halving: refreshed every minute, every 10 s in the last 100 blocks. */
export function useHalving() {
  return useQuery({
    queryKey: ["ckb-halving"],
    queryFn: fetchHalving,
    refetchInterval: (q) => (q.state.data?.near ? 10_000 : 60_000),
    retry: 2,
  });
}

// A clock that ticks once a second while subscribed; 0 on the server so nothing time-based is prerendered.
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
export const useNow = () =>
  useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => 0,
  );
