---
name: Credora
url: https://credora-ckb.vercel.app/
tagline:
  en: Issue, hold and verify course certificates as Spore DOBs on CKB.
  zh: 以 Spore DOB 的形式在 CKB 上签发、持有和验证课程证书。
categories: [DID, DOBs]
github: hiepthach/Credora_CKB
testnet: true
verified: 2026-10-30
listed: 2026-10-30
---

# What it proves

Credentials can be ordinary cells that anyone can check. Credora issues course completion certificates as Spore DOBs, following the W3C Verifiable Credentials format, and anyone can verify one against the chain without asking the issuer.

# How it uses CKB

An issuer registers as a provider by creating a Spore cluster, then mints certificates into it, one at a time or in batches from a CSV or JSON file. Certificates can carry an expiry date, which verification checks. The holder can melt a certificate to destroy it and reclaim the CKB locked in it; a melted certificate no longer verifies. Identities use `did:ckb` through the CCC SDK, and the app shows the exact CKB capacity a certificate will lock before it is minted.

# Before mainnet

It uses the standard Spore scripts, so there is no new contract to deploy. What a real deployment needs is issuers that stand behind the certificates they mint.
