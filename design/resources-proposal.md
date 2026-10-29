# 方案草案：文档与工具索引（/resources）

状态：草案，待负责人决定（2026-10-29）
设计稿：[`design/resources-draft.html`](resources-draft.html)（在浏览器里打开，可以搜索和筛选）

## 1. 要解决什么

Neon（海外社区负责人）的反馈：希望 ckbdapps 收录 CKB 的各种文档和工具，并且可以检索，类似 [cookbook.ckbdapps.com/awesome](https://cookbook.ckbdapps.com/awesome)，但资料要保持更新。

读者是**开发者**，不是普通用户。所以它和现有页面的分工是：

| 页面 | 给谁看 | 收录什么 |
|---|---|---|
| Explore（目录） | 用户 | 已在主网上线、今天能用的产品 |
| In the making（`/builders`，本次新增） | 开发者、社区 | CKBuilder 追踪表里的在建项目 |
| **Resources（本方案）** | 开发者 | 文档、SDK、开发工具、教程课程、API 与节点服务、规范、社区渠道 |

## 2. 现有 awesome 列表的状态

数据来自 `CKBFansDAO/ckb-cookbook` 的 `data/awesome-list.js`，共 64 条，最后修改于 **2025-06-18**（已经 16 个月没动）。2026-10-29 用 CKB Pulse 和 GitHub 检查了一遍：

- 52 条有代码仓库。其中约 **20 条在最近 30 天有提交**；Pulse 只跟踪了其中 23 个仓库。
- 已经停止或被取代、但列表里没标出来的有：Lumos（已被 CCC 取代）、Capsule（已被 ckb-script-templates 取代）、Force Bridge、UTXOSwap SDK（UTXOSwap 已于 2026-10-11 关闭）。
- 3 个仓库已经迁移到新地址，1 个已经 404（`nervoscommunity/docs`）。
- 整个列表只有 4 条手工标了 "Outdated"。

结论：**“过时”靠人工打标签维护不住**，必须由数据推导出来。这也是 Neon 说的“资料更新”的核心。

## 3. 方案总览（分三期）

1. **一期：资源目录。** 新页面 `/{locale}/resources`，可以按类型、主题、编程语言筛选，可以搜索标题、简介和标签。每条显示代码最后更新日期和状态标记。过滤条件写在 URL 里，和 Explore 一样。
2. **二期：文档页级检索。** 每周构建时抓取约 8 个文档站的 sitemap 或 `llms.txt`，把每页的标题、小节标题和链接建成静态索引。搜 “xUDT” 时，直接给出 “docs.ckbccc.com › Examples › Issue a fungible token” 这样的具体页面（设计稿里的 “In docs pages” 区块）。
3. **三期：给 AI 用的汇总。** 提供 `/resources/llms.txt`，把选中资源的 llms.txt 汇总成一份，对应 cookbook 的 “Aggregation for AI” 功能。我们已经有 `/llms.txt`，这一期成本很低。

建议先做一期，二期和三期等一期上线、社区有反馈后再决定。

## 4. 内容模型（需要负责人批准：属于新增数据文件）

一个文件：`content/resources.yaml`。资源没有详情页，点击直接跳到资源本身，所以一个列表文件比“一项一文件”更好维护，也更容易审 PR。最少 5 行：

```yaml
- name: CCC
  url: https://docs.ckbccc.com
  kind: sdk
  topics: [dapps, wallets, udt, dob]
  github: ckb-devrel/ccc
```

可选字段：`about`（一句话简介，en/zh 二选一即可，规则同项目的 `tagline`）、`langs`（编程语言，如 `[ts, rust]`）、`locale: zh`（中文资源）、`llms`（llms.txt 地址）、`replaced_by`（被谁取代，写另一条资源的名字）、`verified`（日期）。

受控词表放进 `taxonomy.yaml`，和项目分类同一套校验：

- **kind（类型，单选）**：`docs` 文档 · `sdk` SDK 与库 · `tools` 开发工具 · `learn` 教程、课程、示例 · `api` API 与节点服务 · `spec` 规范（RFC 等）· `community` 论坛、视频、博客
- **topics（主题，多选）**：scripts、dapps、wallets、udt、dob、fiber、rgbpp、defi、infra、ssri
- **langs（编程语言）**：ts、rust、c、go、java、lua、ruby、python

`pnpm validate:content` 一并校验这个文件，CI 规则不变。

## 5. “保持更新”怎么落地（全部推导，不手写）

| 信息 | 来源 | 页面上的表现 |
|---|---|---|
| 代码最后更新 | CKB Pulse `/api/repo`，每小时，和项目页的 Activity 共用 `lib/activity` | “Code changed 2026-10-22” |
| 状态 | 由上一行推导：≤90 天 / 3–12 个月 / 超过一年 | 插头满格 / 半格 / 虚线空槽（复用 slot 造型，不用状态色） |
| 仓库已迁移、404、已归档 | 每周的 `check:links` 扩展检查 | 默认隐藏，标 “Repository gone” |
| 被取代 | `replaced_by` 字段（人工，唯一需要判断的） | 默认隐藏，标 “Replaced by CCC” |
| 新资源 | 扩展每周的 `discover:projects`：Pulse 跟踪的仓库里像 SDK、文档、工具的 | 开 draft PR，人工审核后合并 |

说明：

- 资源的状态阈值建议比项目 Activity 宽（项目是 30/90 天，资源是 90/365 天）。原因是文档和底层库长期不改也可能完全可用。超过一年只说“一年以上没有代码变更”，不判定为“过时”。
- Pulse 现在只跟踪 64 个仓库里的 23 个。按 CLAUDE.md 的做法，通过 `POST /api/propose` 请 Pulse 跟踪缺的那些 owner（sporeprotocol、nervosnetwork、cryptape 等）。网站本身仍然不调用 GitHub、不持有 token。这次检查也验证了：不带 token 调 GitHub API，不到 30 次就被限流。

## 6. 页面设计（见设计稿）

- **深色 hero**：标题 “Build on [CKB]”（CKB 放在 Slot 里，和首页一致），一句说明，SlotSearch 搜索框，快捷词（CCC、Scripts、xUDT、Spore/DOB、Fiber），三个数字（资源数、90 天内有更新的数量、二期上线后“逐页检索的文档站数”）。
- **浅色主体**：吸顶工具栏（类型标签带数量、编程语言下拉、“显示已取代和已失效”开关），主题标签，图例，然后是列表。手机上工具栏不吸顶，类型标签改为横向滚动。
- **列表一行**：状态标记、名称和类型、简介加标签（主题、语言、中文）、右侧是更新日期和 Open / Code / llms.txt 链接。默认按最近更新排序。
- **结尾**：“Missing something?”，说明只需改一个文件，链接到添加说明。
- **导航**：新增一项 “Build / 开发”。导航将有 6 项，桌面宽度放得下，手机在菜单里。

## 7. 和 cookbook 的关系

cookbook 也在 CKBFansDAO 名下。建议一期上线后，把 64 条清洗后导入 `resources.yaml`（停止的、404 的直接不导入，被取代的写 `replaced_by`），然后把 `cookbook.ckbdapps.com/awesome` 重定向到 `ckbdapps.com/en/resources`，只维护一份。

## 8. 需要负责人决定的问题

1. 新增数据文件 `content/resources.yaml` 和 taxonomy 里的三组词表（kind、topics、langs）。按规则要先批准。
2. 页面名称和导航文字：Resources / Build / Developers？中文用“开发者资源”还是“开发”？（设计稿用的是 Build。）
3. 要不要“从这里开始”（官方文档、CCC、OffCKB、CKB Academy 四项固定在最前）。这是人工挑选，和首页“不手选”的原则冲突。建议不加，靠排序和筛选解决。
4. 和目录的重叠：OffCKB、ckb-script-templates 等目前在目录的 Dev Tools 分类里。建议开发工具以后只放 Resources，目录里的 Dev Tools 分类迁出；或者两边都放，Resources 链接到目录页。
5. 二期需不需要做；如果做，是自建一个只含标题和小节的轻量索引（不加依赖，推荐），还是用 Pagefind 做全文检索（新依赖，要批准）。
6. cookbook 的 awesome 页是否重定向。

## 9. 工作量估计

- 一期：内容模型和校验、导入 cookbook 数据并清洗、页面（搜索、筛选、列表）、Pulse 状态、中英文、e2e 质量门。约 2–3 天，主要时间在逐条核对数据。
- 二期：文档站抓取脚本、索引、搜索结果区块。约 2 天，取决于各文档站有没有 sitemap 或 llms.txt。
- 三期：半天。
