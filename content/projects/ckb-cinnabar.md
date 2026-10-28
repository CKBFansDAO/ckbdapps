---
name: Cinnabar
url: https://github.com/ashuralyk/ckb-cinnabar
tagline:
  en: A Rust framework for CKB contracts built on the calculate-and-verify split, with an AI agent skill that turns product rules into a tested contract.
  zh: 基于“计算与验证分离”的 CKB 合约 Rust 框架，附带 AI 智能体技能，可把产品规则变成经过测试的合约。
categories: [Dev Tools]
github: ashuralyk/ckb-cinnabar
verified: 2026-10-28
listed: 2026-10-28
---

Cinnabar is a Rust framework for writing CKB contracts. It builds on the Cell model's split between calculating a transaction off-chain and verifying it on-chain, and fills in the parts that plain CKB script development leaves to the author.

It ships an agent skill, cinnabar-agent, for AI coding tools. You describe the product in plain words, the agent asks for the missing rules one at a time and shows them back as a verification tree, and only after you accept the tree does it write the contract: on-chain checks, the off-chain transactions that carry them out, and tests that run in a local CKB-VM before a dry-run deploy.
