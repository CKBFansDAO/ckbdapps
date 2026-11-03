---
name: FiberNuts
url: https://fibernuts.xyz/
tagline:
  en: A Cashu ecash wallet and mint that settle over Fiber, for private bearer payments in RUSD.
  zh: 通过 Fiber 结算的 Cashu 电子现金钱包和铸币方案，用 RUSD 进行私密的不记名支付。
categories: [Payment, Fiber]
github: code3ks/fibernuts
testnet: true
verified: 2026-11-03
listed: 2026-11-03
---

# What it proves

Cashu ecash can settle over Fiber and be denominated in a stablecoin. With the `cdk-fiber` adapter, an unmodified Cashu mint issues and redeems RUSD ecash against Fiber channels. A wallet adds ecash by paying a Fiber invoice, sends it to someone as a bearer token with no transaction, and cashes out by having the mint pay a Fiber invoice. It took first place in its category at the Gone in 60ms Fiber infrastructure hackathon.

# How it uses CKB

The mint runs a Fiber node with RUSD channels, and that channel balance is what backs the ecash it issues. Ecash is credited only after Fiber reports an invoice as paid, and a cash-out that has not settled stays pending rather than failed, so the same money cannot be spent twice. The repository also has a browser wallet, a Community Market app for payments between attendees and vendors, and the deployment files to run your own mint.

# Before mainnet

It runs on testnet only, and the mint is custodial: its operator holds the RUSD and controls issuance and redemption. Adding ecash normally needs your own Fiber node with an RUSD channel to the mint. A Community Fund DAO proposal, open for voting in November 2026, covers restart-safe settlement, hosted-LSP onboarding and a capped mainnet test, but not a public mainnet mint.
