---
name: CKB Contract Flow
url: https://gpblockchain.github.io/ckb-contract-flow-html/
tagline:
  en: Visual one-page explainers of how cells move through 46 CKB contracts, plus an on-chain transaction decoder.
  zh: 以一页图解说明 46 个 CKB 合约的 Cell 流转规则，并附链上交易解码器。
categories: [Dev Tools]
github: gpBlockchain/ckb-contract-flow-html
verified: 2026-10-28
listed: 2026-10-28
---

CKB Contract Flow explains how cells move through CKB contracts, one page per contract. Each state transition (for example 0 to 1, 1 to 1, 1 to 0) gets a card showing the structure of the input and output cells and the rules the scripts enforce. It currently covers 46 contracts.

The site also has an on-chain transaction decoder for mainnet and testnet: paste a transaction hash to see which of those contracts it touches and how. The project is open source and accepts contributions for more contracts.
