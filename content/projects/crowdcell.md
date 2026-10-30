---
name: CrowdCell
url: https://crowdcell.vercel.app/
tagline:
  en: All-or-nothing crowdfunding where on-chain scripts release each pledge to the creator or refund it to the backer.
  zh: 全有或全无的众筹：由链上脚本决定每笔认捐是交给发起人，还是退还给支持者。
categories: [DeFi]
links:
  x: crowdcellckb
github: alesfer001/CrowdCell
testnet: true
verified: 2026-10-30
listed: 2026-10-30
---

# What it proves

Crowdfunding can run without anyone holding the money. In CrowdCell every pledge sits in its own cell that only the campaign's outcome can unlock: if the goal is met by the deadline the funds go to the creator, otherwise every backer is refunded. There is no admin key.

# How it uses CKB

A campaign is a cell with a goal and a deadline block that cannot change afterwards, and each pledge is a cell that raises the campaign's on-chain total in the same transaction. Five scripts guard them: type and lock scripts for the campaign and the pledge, and a type script for the receipt cell each backer gets. After the deadline anyone can finalize the campaign against its total and settle the pledges; a bot does it by default. A pledge still unsettled about 180 days after the deadline can be returned to its backer by anyone, so funds cannot get stuck. Campaigns refer to the scripts by code hash, so nobody can upgrade them under a live campaign. The testnet code hashes are listed in the repository's README.

# Before mainnet

CKB developers have reviewed the contracts, but there has been no independent audit yet. The builder plans one before mainnet.
