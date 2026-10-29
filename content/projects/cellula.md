---
name: Cellula.id
url: https://cellula.id/
tagline:
  en: ".cell names on CKB: one name to get paid at in CKB, sats or Lightning, sign in with, and point to your page."
  zh: CKB 上的 .cell 名称：一个名字即可收取 CKB、比特币或闪电网络付款，还能用于登录和个人主页。
categories: [DID, Dev Tools]
community: true
links:
  x: cellula_id
  telegram: cellula_id
  docs: https://cellula.id/developers
github: LusoCryptoLabs/cells-contracts
contracts:
  - name: account-cell-type
    code_hash: "0xd96cee56727a2bb9a21408c154d278df5095fb4b4dcfd50516156424479bfe54"
    hash_type: type
  - name: account-lock
    code_hash: "0x9f0f0ba142b58cba2fe047546cfd8481d5b1769437cd3533e6458b21b61871ab"
    hash_type: type
  - name: sale-lock
    code_hash: "0x086c8f4e9d4272e3dfbaca399792f730e6604591e87931ee6d67047a3c900879"
    hash_type: type
  - name: price-cell-type
    code_hash: "0x97bf5f760cf72f918f13704d7184933b79d4ddc1fd85075762373e531152d4f9"
    hash_type: type
verified: 2026-10-28
listed: 2026-10-28
---

Cellula.id is a naming protocol on CKB for names ending in .cell, live on mainnet since 21 September 2026. Each name is one live cell under a fixed type script, and its records point to where you want to be paid. One name gives you an address wallets can pay in CKB, a Lightning address (name@cellula.id), and a web page at name.cellula.id with your picture, links and addresses.

You can also sign in to sites with a name, send signed payment requests for an exact amount, create sub-names, let a manager keep records current without being able to sell the name, and sell a name in a single transaction with no escrow. A name can be owned by a quantum-safe key. Names start at 5 USD a year. The contracts and the resolver are open source and their mainnet builds are reproducible.
