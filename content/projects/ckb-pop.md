---
name: CKB PoP
url: https://www.ckb-pop.xyz/
tagline:
  en: Non-transferable badges on CKB for attending real-world events, plus a reusable presence module.
  zh: 在 CKB 上为参加线下活动的人铸造不可转让的徽章，并提供可复用的签到模块。
categories: [DOBs, Dev Tools]
github: RobaireTH/ckb-pop
testnet: true
verified: 2026-10-30
listed: 2026-10-30
---

# What it proves

Proof of attendance fits CKB's cell model. An organiser anchors an event on-chain, attendees scan a dynamic QR code during a timed window, and each gets a soulbound badge cell that can be checked against the event.

# How it uses CKB

Two type scripts do the on-chain part: an event anchor and the badge. Verification of the QR code and the time window stays off-chain in a backend that only observes the chain and cannot override what the scripts allow. The repository separates the reusable part, the `ckb-presence` TypeScript package with extension points for proof formats, artifacts and policies, from the reference app built on it, so other CKB apps can add presence checks of their own.

# Before mainnet

It runs on testnet only, and no audit of the scripts is published.
