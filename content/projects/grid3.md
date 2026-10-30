---
name: Grid3
url: https://grid3-ckb.vercel.app/
tagline:
  en: Tic-tac-toe for two players who stake CKB, with every move checked by an on-chain script.
  zh: 双人质押 CKB 对战的井字棋，每一步都由链上脚本验证。
categories: [DeFi]
github: truthixify/grid3
testnet: true
verified: 2026-10-30
listed: 2026-10-30
---

# What it proves

A whole game can live in one cell. Grid3 keeps the board, both players, the turn and the stake in a game cell, and each move is a transaction that replaces it. The type script does not run the game; it only accepts or rejects each proposed state change, which is how CKB scripts work.

# How it uses CKB

The game cell moves through four states: waiting, active, finished and cancelled. The script checks that a move is signed by the player whose turn it is, changes exactly one empty square and flips the turn. When a game ends it checks the winning line against the board and the payout: 80% of the pool to the winner and 20% to a fee address, or the stakes split evenly on a draw. The player who opened a game can cancel it and take the stake back until someone joins. The full design is in `SPEC.md` in the repository.

# Before mainnet

It runs on testnet only, and no audit of the script is published. Real stakes would need one.
