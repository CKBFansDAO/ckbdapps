---
name: ChainPress
url: https://ckb-academy-progress.vercel.app/
tagline:
  en: Blog posts published on-chain with CKBFS, with edits kept as an append-only version history.
  zh: 用 CKBFS 把博客文章发布到链上，修改以只增不删的版本历史保存。
categories: [Tools]
github: chetanchauhan64/CKB-Academy-Progress
testnet: true
verified: 2026-10-30
listed: 2026-10-30
---

# What it proves

A publishing platform can keep its content on CKB itself. ChainPress stores each post with CKBFS, the CKB file system, so a post stays readable from the chain without the site.

# How it uses CKB

A post is written into a transaction witness and checked with an Adler32 checksum, as CKBFS specifies. Editing a post creates a new cell that links back to the previous version, so the history can be browsed as a tree and nothing is deleted. Readers can unlock paid posts by sending the writer a CKB tip. It connects JoyID, MetaMask and OKX wallets through the CCC SDK.

# Before mainnet

It runs on testnet only. The code is in the `frontend` folder of the builder's CKB Academy progress repository, not in a repository of its own.
