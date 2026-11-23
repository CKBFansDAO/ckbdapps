# ckbdapps Builder Stories 页需求说明

Nov 17, 2026 · @Someone

## 概述

在 ckbdapps 新增 Builder Stories（建设者故事）栏目，用于发布和长期展示 CKB 开发者的叙事故事，形式参考 GitHub ReadME 的 Developer Stories，编号和封面参考 The ReadME Podcast。

**范围**

- 新增两个页面：汇总页和详情页
- 新增内容类型：`content/stories/`
- 从现有页面增加入口：导航、首页、项目页
- 「分享你的故事」自荐入口
- 分享卡片（OG 图）、sitemap、llms.txt、RSS

**不在范围内**：评论系统（讨论放在 Nervos Talk）、站内投稿表单、任何需要登录的功能。

**交付顺序**

1. 原型：在 `design/` 下新建 `stories-draft.html`，和 `ckbdapps-design.html`、`proofs-draft.html` 一样，是一个单文件原型，使用模拟数据，并支持 EN/中文切换。
2. 评审：Yixiu 审阅原型和本文档，定下设计与文案。
3. 开发：由 Claude 起草 PR，Yixiu review 并合并。第一篇 story 的内容单独提 PR。

**必须遵守的仓库约定**（见 `CLAUDE.md`）

- 设计系统不变：只用 slot 标志形；不加新的强调色；不用渐变、带阴影的圆角卡片、emoji
- 不引入 UI 库、状态管理库或动画库
- 内容用 Markdown 加 front matter，用 zod 校验；`pnpm build` 会先运行 `validate:content`
- 项目文件不加新字段。story 与项目之间的关联由 story 一侧声明，项目页上的标识由程序推导生成

## 基调

这个栏目是写给真正的开发者看的，要有社区味、人情味、接地气。它不是项目方的宣传页，也不是官方通稿。

- **写人，不写产品**：从一个具体的时刻写起，写怎么走到这一步、难在哪里、靠什么撑过来。技术细节用开发者自己的话放进正文，不单独做成「亮点框」。
- **说话像朋友**：短句，口语，用「你」和「我们」。不说「赋能」「生态价值」「重磅」，也不用排比、对仗和「不是……而是……」这类套话。中文按中文的习惯写，不要翻译腔。
- **尊重隐私**：大多数开发者不愿公开真实身份。默认只用 handle（昵称），不要求真名和照片，也不写所在地、工作单位这类信息。头像可选，用开发者自己愿意给的任何图片（画、logo 都行）；不给就用 Identicon。
- **没有官方腔**：页面上不出现「CKB DevRel」等头衔，署名只写作者的名字。

文案检查：写完读一遍，像是在社区群里跟人介绍一位朋友，就对了；像新闻稿或者 AI 生成的，就重写。

## 路由与入口

新增两个静态路由。现有页面里的入口都由程序推导生成，不写任何人工挑选的列表。

| 位置 | 内容 | 生成规则 |
| --- | --- | --- |
| `/{locale}/stories` | 汇总页 | 静态生成，按 `published` 倒序排列 |
| `/{locale}/stories/{slug}` | 详情页 | 静态生成，用 `generateStaticParams` 生成路径 |
| `/{locale}/stories/feed.xml` | RSS | 静态生成，每种语言一份 |
| 顶部导航 | 新增「Stories / 故事」（`n_stories`），放在 Explore 之后；同时去掉 Map。导航变为：首页、探索、故事、减半、数据 | 固定 |
| 首页 | 在 Start here 之后增加一个「Builder Stories」区块：最新一篇的卡片，加一个「分享你的故事」空位（`EmptySlot`） | 取发布日期最新的一篇，和「Newly listed」一样按日期推导；一篇都没有时不显示该区块 |
| 项目详情页 | 在 hero 里显示「读读 <昵称> 的故事」标识，链接到对应故事；有多篇时显示最新一篇，并附「还有 N 篇」 | 由 story 的 `project` 字段反向推导，项目文件不动 |

页脚这次不加链接，以后统一规划。去掉导航里的 Map 后，生态地图仍然在首页，`/#map` 照常可用。

关于「不人工挑选」的原则：这条约定管的是项目在目录中的展示。story 的选题有公开标准：要么经过小组表决，要么由开发者自荐；每个入口又都按日期自动生成，所以与这条原则不冲突。合并时把这段说明写进 `CLAUDE.md`。

## 编号与封面

参考 The ReadME Podcast 的「EPISODE 33」，每篇 story 都有期数和一张封面。

- **期数**：按发布日期顺序推导，最早的一篇为第 1 期，不写进文件。显示为「Builder Story // No. 04」/「建设者故事 // 第 04 期」，用 JetBrains Mono。
- **封面**：程序生成，不需要照片。就是 slot 标志形本身：一个大方框（左、上、下三边），里面是两位数的期数，右侧是紫色插头。每期只有数字不同，整个栏目看起来是一个系列。
- 封面用在：汇总页的最新一篇和往期列表（小号）、详情页 hero、首页区块、分享卡片。开发者的头像只出现在人名旁边，作为辅助。

## 内容模型

每篇 story 单独占一个目录。英文版必须有，共享字段只写在英文版里；中文版可选，只放标题和正文。页面显示语言的回退顺序和项目一致：优先用请求的语言，缺失时回退到 `en`。

文件本身就是一篇普通的 Markdown：和开发者确认的就是这份文件，在 GitHub 上直接打开也要好读，放到 ckbdapps 上再由页面排得更好看。所以图片和 md 放在同一个目录里，相对路径在 GitHub 上也能显示；构建时把它们复制到 `public/stories/<slug>/`。

```text
content/stories/<slug>/en.md       # 必须：共享字段 + 英文正文
content/stories/<slug>/zh.md       # 可选：title / dek + 中文正文
content/stories/<slug>/*.webp      # 可选：头像、截图；宽度 ≤1600px
```

```ts
// src/lib/content/schema.ts（新增）
export const Story = z.object({
  title: z.string(),                       // 主题句，不是项目名
  dek: z.string(),                         // 副标题，一句话
  project: z.string(),                     // content/projects 里的 slug，必须存在（主站或 proofs）
  person: z.object({
    name: z.string(),                      // 文中称呼，默认是 handle；只有本人愿意时才用真名
    avatar: z.string().optional(),         // 同目录下的文件名，任何本人愿意给的图；缺省时用 Identicon
    links: z.object({ github: z.string(), x: z.string(), telegram: z.string() }).partial().optional(),
  }),
  voice: z.enum(['narrative', 'as-told-to']).default('narrative'),
  author: z.string(),                      // 例如 "Yixiu"，页面上只显示名字，不加头衔
  published: z.string().date(),
  help: z.array(L10n).max(3).optional(),   // 「想帮 <昵称> 一把？」
  disclosure: L10n.optional(),             // 利益关系披露
  talk: z.string().url().optional(),       // 发布后回填的 Talk 讨论帖
  corrections: z.array(z.object({ date: z.string().date(), note: L10n })).optional(),
});
```

**正文约定**：只用 GitHub 能正常显示的标准 Markdown（GFM），不加自定义语法，不写 HTML。

- `## 小标题`：划分正文各节
- `> 引语`：开发者的原话，页面上渲染为大号引语，下面自动署上昵称
- 代码块：照常写，比如开发者最得意的那段代码
- 图片写成 `![说明](./shot-1.webp)`，说明渲染为图注
- 第一段是开场，页面上字号略大

**校验规则**（加入 `validate:content`）

- `project` 必须对应一个已存在的项目文件
- 引用的图片必须存在
- `zh.md` 里不得出现共享字段
- 正文里不得有原始 HTML
- 同一个项目可以有多篇 story

## 汇总页 /stories

汇总页的第一屏要让人想点进最新一篇，第二屏要让人想把自己的故事也放进来。

1. **Hero**（`.on-dark`）：大标题采用 Slot 写法：「Hi, I build on \[CKB\]」/「你好，我在 \[CKB\] 上做东西」；一段引言说清楚这个栏目在做什么；「分享你的故事」SlotButton，旁边是「或者在 Nervos Talk 私信 Yixiu」。
2. **最新一篇**：封面、期数、标题、副标题、头像 + 昵称 // 项目名、发布日期和阅读时长（JetBrains Mono）。
3. **往期故事**：按发布日期倒序。每条包含小封面、昵称 // 项目、标题、副标题、日期。采用列表而不是卡片网格，以避开设计系统禁止的「圆角卡片网格」。
4. **开放的空位**（`EmptySlot`）：「下一篇，也许就是你」，见下文「分享你的故事」。
5. **这个栏目怎么来的**：两句话说明选题方式（社区的朋友轮流推荐、公开商量、欢迎自荐）和内容经主人公确认；「我们想听谁的故事」列出入选门槛；最后一句说明这些故事不代表背书，也不构成投资建议。这句要让读者读得到，但语气平和。
6. 底部一个 RSS 链接。

只有 1 篇时：省略往期列表，只显示最新一篇和空位。少于 10 篇时不分页。

## 详情页 /stories/[slug]

详情页要读得舒服，同时让读者在读完时知道三件事：这位开发者是谁、项目在哪里、自己能帮上什么忙。整页由 story 文件和它关联的项目文件推导生成，不写额外数据。

1. **Hero**（`.on-dark`）
   - 返回链接「全部故事」
   - 期数（「Builder Story // No. 04」）
   - 标题（`.wide`）和副标题
   - 头像 + 昵称 // 项目名（链接到项目页），下面一行是发布日期和阅读时长
   - 右侧（窄屏时在上方）是大号封面
2. **正文**（`.on-paper`，正文栏宽约 66ch）
   - 第一段是开场，字号略大
   - `##` 渲染为 h2（这一页的 h1 是标题，没有别的 h2，所以不像项目页那样降两级）
   - `> 引语`：大号引语，外框用 Slot 写法（左、上、下三边框，右侧紫色插头），下面署昵称。全文 2–3 条
   - 代码块：深色底，左侧紫色竖条
   - 图片：整栏宽度，`![说明]` 渲染为图注；用 `next/image` 输出
3. **侧栏**（宽屏在正文右侧并吸顶；窄屏移到正文之后，hero 里已经有昵称和项目）
   - 「关于 <昵称>」：头像、昵称、「打个招呼」加 `person.links`（GitHub / X / Telegram）
   - 「在做」：项目头像、项目名、状态和「<项目名> 在 CKBdapps 上」链接。状态由项目文件推导：主网或测试网（`testnet`）、是否有审计（`audits` 非空时显示最近一次的机构和年月，否则显示「暂未列出审计」）
   - `talk` 存在时显示「去 Nervos Talk 打个招呼」
4. **想帮 <昵称> 一把？**（`help` 存在时显示）：放在正文之后，用带插头的框，编号列出 1–3 条，每条写成具体、能马上做的事（「手边有旧安卓手机？装上测试版试试」），下面是联系方式和 Talk 帖子
5. **页底**
   - 署名：叙事体为「Yixiu 根据 pine 的回答写成，发布前 pine 已经读过并同意。」；`as-told-to` 为「kiwi 口述，Yixiu 整理，发布前 kiwi 已经读过并同意。」不出现任何头衔
   - 发布日期
   - 免责声明（固定文案：「这些都是他们自己的故事，不代表背书，也不构成投资建议。」）后接 `disclosure`
   - 「发布后的更正」（`corrections` 存在时显示）：日期（JetBrains Mono）加说明，按日期倒序
   - 「哪里写得不对？告诉我们」链接到预填的 GitHub issue
6. **更多故事**：除本篇外最新的 2 篇，用汇总页的列表样式，旁边是「分享你的故事」空位；一共只有 1 篇时只显示空位

**语言回退**：`/zh/stories/<slug>` 没有 `zh.md` 时，标题、副标题和正文都用英文，内容容器标 `lang="en"`，hero 下方显示一条提示「这篇故事还没有中文版，先放英文原文。」页面本身照常生成，不跳转。

**阅读时长**：英文按每分钟 220 词，中文按每分钟 400 字，向上取整。

## 「分享你的故事」自荐入口

不做站内表单，不需要登录本站。所有「分享你的故事」入口（汇总页 hero、汇总页空位、首页区块空位、详情页末尾空位）都给出同样的两条路，并写明「我们会在一周内回复你」：

1. **GitHub issue**：新增 `.github/ISSUE_TEMPLATE/builder-story.yml`（issue 表单），标签 `story`，标题前缀 `[story] `，链接 `{REPO_URL}/issues/new?template=builder-story.yml`
2. **Nervos Talk 私信 Yixiu**：给不想用 GitHub、或者不想公开自荐的人。链接 `https://talk.nervos.org/new-message?username=yixiu.ckbfans.bit&title=My Builder Story`（Yixiu 的主页：https://talk.nervos.org/u/yixiu.ckbfans.bit/）

issue 表单的字段和 SOP 的提名表一致，只是改成自荐的口吻，问得轻松一些：

- 怎么称呼你、项目叫什么（必填；可以只写 handle。项目还没收录的话，先按 README 加上，只要五行）
- 在哪里能看到你在做的东西：GitHub 仓库、Talk 帖子、demo 或 ckbdapps 页面（必填）
- 你做了什么，为什么想讲讲（必填，一两句就行）
- 你最想聊的一个片段（选填）
- 有没有拿过 Spark 或其他资助（必填，没有就写「没有」）
- 确认项：「我知道这是公开 issue，不要在这里留私人联系方式」；「整个过程不会有人向我索要私钥、钱包或付款」

汇总页「我们想听谁的故事」写明入选门槛（与 SOP 一致：近三个月公开活跃、开源且能跑起来、已被 ckbdapps 收录），让自荐的人先自己对照。自荐进入下一轮提名，按 SOP 同样表决，一周内在 issue 或私信里回复。

## 分享、SEO 与机器可读

- **分享卡片**：`src/app/[locale]/stories/[slug]/opengraph-image.tsx`，1200×630，深色底，整张卡就是一个 slot 方框加紫色插头。左边是「CKBdapps · Builder Stories」、标题（`.wide`）、「No. 04 // 昵称 // 项目名」；右边是封面。中文页用中文标题；没有 `zh.md` 时用英文卡片
- **页面元信息**：`<title>` 为「标题 · Builder Stories · CKBdapps」，description 用 `dek`；`og:type=article`、`article:published_time`；canonical 指向当前语言；hreflang 只列出有对应语言文件的版本（英文总是有）
- **JSON-LD**：详情页输出 `Article`（headline、description、datePublished、dateModified = 最近一次更正的日期或发布日期、author 为 Person「Yixiu」、about 指向项目页、image 为 OG 图）；汇总页输出 `CollectionPage` 加 `ItemList`
- **RSS**：`/{locale}/stories/feed.xml`，每篇一条：标题、dek、链接、发布日期；汇总页 `<head>` 里加 `<link rel="alternate" type="application/rss+xml">`，页面底部也放一个 RSS 链接
- **sitemap**：`/stories` 和每篇 story，每种语言一条；`lastModified` 同 dateModified
- **llms.txt**：新增「Builder Stories」一节，每篇一行：标题、昵称 / 项目、URL、dek
- **projects.json** 不变；项目文件不加字段

## 原型范围与验收标准

原型文件：`design/stories-draft.html`，单文件、模拟数据（昵称、项目和故事都是编的）、支持 EN/中文切换。它只是视觉参考，和其他原型一样不上线，CSS 不直接复制。

**视图与状态**

| 视图 | 必须展示的状态 |
| --- | --- |
| 汇总页 | 4 篇（最新一篇 + 往期列表 + 空位 + 这个栏目怎么来的）；只有 1 篇 |
| 详情页 | 叙事体（完整中英文）；as-told-to + 更正记录 + 没有中文版时的回退；开发者自选头像；测试网项目的侧栏状态；底部展开可以看到对应的 `en.md` / `zh.md` |
| 首页区块 | 有故事；没有故事（区块不显示） |
| 项目页 | hero 里的「读读 <昵称> 的故事」标识 |
| 分享卡片 | 英文、中文、另一期 |

**验收标准**

- 只用设计系统里已有的元素：Slot、SlotButton、FramedAvatar、EmptySlot、`.on-dark` / `.on-paper`；没有新颜色、渐变、阴影、圆角卡片网格、emoji、全大写的眉题
- 页面上没有真名、照片、所在地；没有「CKB DevRel」等头衔；没有技术亮点框
- 文案读起来像社区里的人在说话，没有官方腔，也没有 AI 味
- 宽 1280 和 390 时都没有横向滚动，正文行宽不超过约 70ch
- 中文排版：标题字重 900、不用负字距
- 所有可交互元素都能用键盘操作，焦点清晰可见；`prefers-reduced-motion` 下关闭插头动画
- 截图存到 `design/screenshots/stories/`（1280 和 390，中英文各一组）

## 已确认

| 问题 | 结论 |
| --- | --- |
| 导航 | Explore 之后加「故事」，去掉 Map |
| 页脚 | 不加，以后统一规划 |
| 不用 GitHub 的自荐渠道 | 加 Nervos Talk 私信 Yixiu |
| 期数 | 显示，参考 The ReadME Podcast；配程序生成的封面 |
| 安全事件提示 | 现阶段不加字段，遇到再加 |
| 自荐回复时间 | 一周内 |
| RSS | 提供 |
| 作者头衔 | 不显示「CKB DevRel」，署名只写名字；去掉技术亮点框 |
| 真名和照片 | 默认不用，只用 handle；头像可选 |
| 汇总页标题 | A：「Hi, I build on \[CKB\]」/「你好，我在 \[CKB\] 上做东西」 |
| Talk 私信 | Yixiu：`yixiu.ckbfans.bit` |
| SOP 首次联系模板 | 保留「from the CKB DevRel team」：邀请时带上头衔更显真诚；页面上不出现头衔 |
