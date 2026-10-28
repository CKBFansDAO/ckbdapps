---
name: CellScript
url: https://cellscript.dev/
tagline:
  en: A small language for CKB Cell contracts that checks state changes at compile time and emits metadata reviewers can audit.
  zh: 一门面向 CKB Cell 合约的小型语言：编译时检查状态变化，并输出便于审阅的元数据。
categories: [Dev Tools]
github: CellScript-Labs/CellScript
verified: 2026-10-28
listed: 2026-10-28
---

CellScript is a domain-specific language for writing CKB contracts in terms of the Cells they consume, create and change, rather than raw witness bytes and output indexes. A `.cell` source file declares resources, shared state and actions; the compiler checks the declared transitions and compiles them to ckb-vm RISC-V assembly or ELF.

Alongside the binary, the compiler writes typed metadata: schema layout, Cell effects, source hashes and the obligations a verifier must meet, so reviewers can audit what a contract does. The site has documentation, a browser playground and a registry of examples such as a fungible token, an NFT, an AMM pool and vesting. The project is open source and still pre-audit: its README does not yet recommend unaudited mainnet deployment.
