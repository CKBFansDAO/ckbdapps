---
name: CKB Connect Wallet Kit
url: https://ckb-connect-wallet-kit.vercel.app/
tagline:
  en: Composable React components for connecting a CKB wallet through CCC, with optional did:ckb profiles.
  zh: 通过 CCC 连接 CKB 钱包的可组合 React 组件，并可选择显示 did:ckb 个人资料。
categories: [Dev Tools]
github: Victor-Okenwa/revamp-ckb-connect-wallet
community: true
verified: 2026-11-03
listed: 2026-11-03
---

CKB Connect Wallet Kit is a React UI package, `ckb-connect-wallet-kit` on npm, built on `@ckb-ccc/connector-react`. Instead of one fixed widget, it gives you separate pieces for the connect button, wallet icon, balance and address, and you lay them out yourself. They share state through React context, so nothing is passed down by hand, and each piece can override the defaults for number formatting, address truncation and styling.

It can also show the avatar, display name and identifier from the did:ckb cells owned by the connected lock. This is read-only: creating or editing a DID is outside the kit. An optional dialog component replaces CCC's own connection popup.

You mount your own `ccc.Provider`, and the kit needs React 18. The components ship as Tailwind class names rather than a stylesheet, so a Tailwind v4 project has to point at the package with `@source`.
