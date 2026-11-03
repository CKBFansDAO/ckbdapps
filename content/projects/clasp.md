---
name: Clasp
url: https://useclasp.xyz/
tagline:
  en: Scoped, time-boxed and revocable wallet sessions, so apps and AI agents can pay over Fiber without holding your keys.
  zh: 限定权限、限时且可撤销的钱包会话，让应用和 AI 代理无需持有你的密钥就能通过 Fiber 付款。
categories: [Fiber, Dev Tools]
github: Enoch208/Clasp
testnet: true
verified: 2026-11-03
listed: 2026-11-03
---

# What it proves

An app does not need permanent, unlimited access to a Fiber wallet in order to pay from it. In Clasp the app asks for permissions and spend limits, the wallet owner cuts them down, and the app only ever gets what the owner approved, until it expires or is revoked. Clasp was the overall winner of the Gone in 60ms Fiber infrastructure hackathon.

# How it uses CKB

Clasp sits between an app and a Fiber node and does not add an on-chain script. Each request passes a 10-step policy engine covering the signature, permission, origin, replay, amount and session budget before a real payment settles on the Fiber testnet, and the wallet returns a signed receipt. An AI agent can hand a sub-agent a weaker credential that draws on the same budget and dies with its parent. Developers integrate through an open-source TypeScript and React SDK, and the live Security Lab lets you try the attacks yourself.

# Before mainnet

It runs on testnet only, with the wallet service hosted by the project and the receiving side a second node it runs itself. By its own account the origin check still relies on a header the app declares, approval uses a device PIN rather than passkeys, the relay runs as a separate process but not on a separate host, and only CKB is supported, not UDTs.
