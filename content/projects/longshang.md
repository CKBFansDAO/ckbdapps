---
name: 垄上
url: https://ckb-farm.pages.dev/
tagline:
  en: An on-chain social farming game where every farm is a CKB cell and a type script checks each planting, harvest and visit.
  zh: 一个跑在 CKB 主网上的社交农场游戏：每座农场是一个 cell，播种、偷菜、喂狗等每一步都由 type script 验算。
categories: [Game]
github: tianlitao/qq-farm
contracts:
  - name: farm-type
    code_hash: "0x578e1f832861bc0040beaf777182f82262aa58a21ae2135f6afb0cbdfcfbf12b"
    hash_type: type
verified: 2026-11-23
listed: 2026-11-23
---

垄上 is a social farming game that lives on CKB mainnet. Each farm is one CKB cell: its plots, crops, gold, experience, inventory and dog are encoded in the cell's data. The web page is only a client. The farm type script replays every action in a transaction and requires the resulting state to match the output byte for byte.

# How it uses CKB

A farm cell's type script takes the game hour as an argument and guards the full farm state. Owner actions need an input locked by the owner's lock. Visitors do not need the owner's signature, but the script accepts only the visit actions it defines, and the capacity in a farm cell can only grow. Actions are batched in one transaction: a visit is written into the visited farm's witness and names the guest farm's input, so both scripts replay the same action list and must agree on the result.

Time comes from a recent block header carried by the transaction. Planting records no timestamp; the script fills it in from the block that contained the planting transaction, along with a per-plot seed from that block's hash. CKB's single-cell-per-block rule means two visits to the same farm in one block conflict, and the later transaction has to retry.

The contracts are `no_std` Rust built for CKB-VM, and the web client runs the same farm-core Rust compiled to WebAssembly, so the rules it shows are the ones the script enforces. It connects wallets with CCC, including JoyID, MetaMask, OKX and UniSat. A new farm locks about 332 CKB; the cell is destroyed and the CKB returned when the owner closes the farm.

# Trust model and status

The code cell has a fixed type id and can be upgraded in place by the deployment key, so every farm runs the new rules from the next transaction. The lock on that code cell is an administrator key: its holder can ship rules that hurt existing farms, or burn the code cell and freeze every farm's capacity for good. The type-id validator guarantees a single code identity and no forged copy, not that an upgrade is benign. The live binary's rules cannot move farm capacity out, but an upgrade could change that. This is a game with concentrated, on-chain-visible upgrade power, not one nobody can change.

Two high-severity risks remain in the project's own audit baseline. The deployment key can replace the code cell with rules that move farm capacity, or burn the cell and freeze every farm; and an ACP-locked farm can be force-closed for about 1 CKB of profit. The project says the tip-close bug is fixed, that its official client refuses ACP, AnyoneCanPay and AlwaysSuccess addresses when creating a farm, and that three medium issues are fixed in the deployed binary. The contract-level ACP path is still open to third-party clients. Four AI model audits (Gemini 4 Neon, Qwen4 Max, Claude Fable 5.2 and GLM-5.3-Flash) produced these reports, not a third-party audit firm, and the README calls the game experimental.

# Try it on testnet

There is a separate testnet build at [ckb-farm-testnet.pages.dev](https://ckb-farm-testnet.pages.dev/), where the same free rules run without committing real CKB to a new game. The testnet and mainnet are separate worlds: farms, crops, gold and dog food do not carry over, and a farm opened on one does not appear on the other. A testnet farm needs testnet CKB for its deposit and fees, which you can get from the [Nervos faucet](https://faucet.nervos.org/).
