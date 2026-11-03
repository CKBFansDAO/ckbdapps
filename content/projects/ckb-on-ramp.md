---
name: CKB On-ramp
url: https://onramp.retric.uk/
tagline:
  en: Pay a Lightning invoice from an ordinary BTC wallet and receive wrapped BTC in a Fiber channel, with no software to install and no CKB to start with.
  zh: 用普通 BTC 闪电钱包支付一张发票，就能在 Fiber 通道里收到封装 BTC，无需安装软件，也无需事先持有 CKB。
categories: [Payment, Fiber]
github: RetricSu/ckb-on-ramp
testnet: true
verified: 2026-11-03
listed: 2026-11-03
---

# What it proves

A first deposit into the CKB ecosystem does not have to start on layer 1. A newcomer with only a Lightning wallet can open a web page, pay a standard BOLT11 invoice with a wallet such as Phoenix or Zeus, and hold cWBTC, a testnet token, in a Fiber channel. It takes nothing beyond the RPCs Fiber already has.

# How it uses CKB

The user's Fiber node runs in the browser through fiber-js (WASM), with its key protected by a passkey. Opening a UDT channel needs about 184 CKB, so the channel uses external funding: the operator's cells pay for it, and the operator only signs a funding transaction that passes its checks. Fiber's cross-chain hub then ties the Lightning invoice and the Fiber payment to one payment hash, so if one side fails the other does not settle and the operator does not hold user funds. From there the user can pay Fiber invoices or close the channel to a CKB address.

# Before mainnet

It runs on testnet only. The CKB an operator sponsors can be lost, because a user who force-closes a ready channel takes it. Every user gets the same fixed inbound capacity, what the operator can receive is limited by its Lightning inbound liquidity, and quotes do not check that limit, so a payment can fail after a quote. The builder proposes Fiber-level changes for these: on-demand channels, refund rules for sponsored capacity and liquidity-aware swaps.
