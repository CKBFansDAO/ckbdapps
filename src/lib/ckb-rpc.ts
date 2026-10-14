// Minimal CKB JSON-RPC client for the browser: the halving page needs three read-only calls,
// so this stays a few lines of fetch instead of an SDK in the client bundle.

const RPC_URL = "https://mainnet.ckb.dev";

export type Header = { epoch: string; timestamp: string; number: string };

let id = 0;
async function call<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: ++id, jsonrpc: "2.0", method, params }),
  });
  if (!res.ok) throw new Error(`CKB RPC ${method}: HTTP ${res.status}`);
  const body = (await res.json()) as { result?: T; error?: { message: string } };
  if (body.error || body.result == null) throw new Error(`CKB RPC ${method}: ${body.error?.message ?? "empty result"}`);
  return body.result;
}

const hex = (n: number) => `0x${n.toString(16)}`;

export const getTipHeader = () => call<Header>("get_tip_header", []);

// Past epochs never change, so their start headers are cached for the session.
const epochStart = new Map<number, Promise<Header>>();
export function getEpochStartHeader(epoch: number): Promise<Header> {
  let p = epochStart.get(epoch);
  if (!p) {
    p = call<{ start_number: string }>("get_epoch_by_number", [hex(epoch)]).then((e) =>
      call<Header>("get_header_by_number", [e.start_number]),
    );
    p.catch(() => epochStart.delete(epoch));
    epochStart.set(epoch, p);
  }
  return p;
}
