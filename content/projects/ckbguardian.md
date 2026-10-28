---
name: CKB Guardian
url: https://nervosnetwork.github.io/CkbGuardian/
tagline:
  en: Regular RPC checks of the well-known public CKB nodes on mainnet and testnet, published as a test report.
  zh: 定期检查主网和测试网上知名 CKB 公共节点的 RPC 连通性，并以测试报告形式公开结果。
categories: [Dev Tools]
github: nervosnetwork/CkbGuardian
verified: 2026-10-28
listed: 2026-10-28
---

CKB Guardian monitors the RPC endpoints of well-known public CKB nodes on mainnet and testnet. A scheduled GitHub workflow calls each node's RPC methods and publishes the results as a test report, so developers can see which public endpoints are reachable before relying on one. It checks connectivity, not whether the results are correct.

Anyone running a public node can add it by editing the node list in the repository and opening a pull request; nodes that need an API key or block some methods can say so in their entry. It is maintained by the Nervos Network team.
