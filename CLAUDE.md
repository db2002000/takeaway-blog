# 打包Takeaway — CLAUDE.md

## 项目概述

个人博客网站，将视频文字稿整理为文章发布。内容关于个人成长与发现。
主语言：中文。英文为辅助翻译版本，手动维护。

**技术栈**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Content: MDX (next-mdx-remote)
- i18n: next-intl
- 部署: Vercel
- 包管理: pnpm

---

## 目录结构

```
takeaway-blog/
├── CLAUDE.md                    # 本文件，所有规范从这里查
├── .env.local                   # 本地环境变量（不进 git）
├── .env.example                 # 环境变量模板（进 git）
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── content/                     # 所有文章内容
│   └── posts/
│       └── [slug]/              # slug 用英文小写连字符，如 how-i-beat-procrastination
│           ├── zh.mdx           # 中文版
│           └── en.mdx           # 英文版（可选，没有则不显示英文入口）
│
├── public/
│   ├── images/
│   │   └── posts/
│   │       └── [slug]/          # 文章配图放在对应 slug 文件夹下
│   └── og/                      # Open Graph 封面图
│
├── src/
│   ├── app/
│   │   ├── [locale]/            # 语言路由根
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # 首页（文章列表）
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── posts/
│   │   │       └── [slug]/
│   │   │           └── page.tsx # 文章详情页
│   │   └── api/
│   │       └── og/              # 动态 OG 图生成（可选，后期加）
│   │
│   ├── components/
│   │   ├── ui/                  # 基础 UI 组件（Button、Badge 等）
│   │   ├── PostCard.tsx         # 文章卡片
│   │   ├── PostHeader.tsx       # 文章页标题区
│   │   ├── YouTubeEmbed.tsx     # YouTube 嵌入组件（文章底部）
│   │   ├── PlatformLinks.tsx    # 平台图标跳转组件（YouTubeEmbed 下方）
│   │   ├── Concept.tsx          # 概念卡片组件（行内悬停/点击弹出）
│   │   ├── LanguageSwitcher.tsx # 中/英切换
│   │   └── Nav.tsx              # 导航
│   │
│   ├── lib/
│   │   ├── mdx.ts               # 读取和解析 MDX 文件
│   │   └── types.ts             # 共用类型定义
│
├── content/
│   ├── posts/                   # 文章内容（见上）
│   └── concepts.ts              # 所有概念卡片数据，统一在此维护
│   │
│   └── styles/
│       └── globals.css          # 全局样式、字体引入、CSS 变量
│
└── messages/                    # next-intl 翻译字符串
    ├── zh.json
    └── en.json
```

---

## 内容规范

### MDX Frontmatter 格式

每篇文章的 `.mdx` 文件顶部必须包含以下字段：

```mdx
---
title: "标题写在这里"
date: "2024-04-01"          # 格式固定 YYYY-MM-DD
description: "一句话摘要，用于首页卡片和 SEO meta description，控制在 80 字以内"
cover: "/images/posts/slug/cover.jpg"  # 封面图路径（可选）
tags: ["个人成长", "习惯"]   # 标签（可选）
platforms:
  youtube: "https://youtube.com/watch?v=xxx"      # 必填，视频嵌入以此为主
  xiaohongshu: "https://www.xiaohongshu.com/..."  # 可选
  douyin: "https://www.douyin.com/video/..."       # 可选
  bilibili: "https://www.bilibili.com/video/..."   # 可选
---

正文从这里开始...
```

### Slug 命名规则

- 语义化，见名知意
- 中文标题：用中文或拼音转写，如 `从拖延到轻松靠近目标的方法`
- 英文标题：用英文小写连字符，如 `how-i-beat-procrastination`
- 不用日期前缀（URL 会变丑）

### 文件操作规则

- 新建文章：在 `content/posts/` 下新建 `[slug]/zh.mdx`，英文版按需创建
- 删除文章：**必须先问 DB**，不自行删除任何内容文件
- 重命名 slug：**必须先问 DB**，会影响已有 URL

---

## 设计规范

### 色彩系统（CSS 变量定义在 globals.css）

```css
--color-bg: #FAF8F5;           /* 主背景：极浅暖白 */
--color-surface: #FFFFFF;       /* 卡片背景 */
--color-text-primary: #2A2535;  /* 主文字：深紫黑 */
--color-text-secondary: #6B6480;/* 次要文字：紫灰 */
--color-text-muted: #8A84A0;    /* 弱文字：浅紫灰（日期、标签） */
--color-accent: #7B6FA0;        /* 强调色：深紫（按钮、active 状态） */
--color-accent-pink: #B49AC0;   /* 粉紫：标签 label、decorative */
--color-accent-blue: #8AACD4;   /* 蓝紫：次要插图色 */
--color-accent-muted: #F2EEF8;  /* 浅紫：tag 背景、hover 背景 */
--color-border: #EDE8F4;        /* 分割线：浅紫边框 */
--color-border-muted: #DDD8E8;  /* 更弱的边框 */
```

插图用色原则：粉紫（#D4B8E8 系）用于主要图形，蓝紫（#B8CCE8 系）用于次要图形，手绘笔触感，低饱和。

### 字体

- **标题**：`Playfair Display`（衬线，杂志感）
- **正文**：`Noto Serif SC`（中文衬线，与标题字体气质统一）
- **UI 标签/小字**：`DM Sans`（无衬线，干净）
- 从 Google Fonts 引入：`Playfair+Display:wght@400;700 | Noto+Serif+SC:wght@400;700 | DM+Sans:wght@300;400`

### 排版规则

- 文章标题：`text-5xl` 以上，字重 700，行高 1.1
- 正文：`text-lg`，行高 1.8，最大宽度 `max-w-2xl`
- 大量留白：section 间距不低于 `py-16`
- 卡片圆角：`rounded-2xl`
- 禁止使用阴影堆叠，最多一层 `shadow-sm`

### 组件行为规则

- `YouTubeEmbed`：16:9 响应式，懒加载，点击后才加载 iframe（保护隐私 + 性能）。**放在文章页底部，正文之后。**
- `PlatformLinks`：平台图标链接组，紧接在 YouTubeEmbed 下方。显示 YouTube / 小红书 / 抖音 / 哔哩哔哩四个图标，点击在新标签页打开对应链接。图标用各平台品牌色，尺寸 28px，间距 `gap-3`，hover 时轻微放大（`scale-110`）。链接来自 frontmatter 的 `platforms` 字段，某平台没有填写则不显示该图标。
- `Concept`：行内概念卡片组件。用法：`<Concept id="amygdala">杏仁核</Concept>`。点击/hover 后弹出卡片，显示中文标题、英文名、简短解释、相关概念标签。相关概念标签可点击跳转至对应概念。卡片数据从 `content/concepts.ts` 读取；若 id 不存在则静默降级（只显示文字，不弹卡片）。桌面端 hover 触发，移动端 tap 触发。
- `PostCard`：hover 时整张卡片轻微上移（`transform translateY(-2px)`），不加边框变化
- `LanguageSwitcher`：只在该文章有对应语言版本时显示

### concepts.ts 格式

所有概念统一在 `content/concepts.ts` 维护，格式如下：

```ts
export const concepts: Record<string, Concept> = {
  amygdala: {
    zh: {
      title: "杏仁核",
      desc: "大脑中负责处理情绪反应的杏仁状结构，尤其是恐惧与威胁信号。会在意识介入之前触发「战或逃」反应。"
    },
    en: {
      title: "Amygdala",
      desc: "An almond-shaped brain structure that processes emotional responses, especially fear. It triggers fight-or-flight before conscious awareness kicks in."
    },
    related: ["fight-or-flight", "cortisol"]  // 填其他概念的 id
  }
}
```

**维护规则：**
- 新增概念：在 `concepts.ts` 加一条记录，MDX 里用 `<Concept id="xxx">` 包住对应词
- `desc` 控制在 60 字以内（中文），一句话说清楚
- `related` 只填已存在的概念 id，不填不存在的
- 英文版 `en` 可选，没有时卡片只显示中文

---

### 每次改动后必须验证

```bash
pnpm build        # 确认构建无报错
pnpm lint         # 确认无 lint 错误
```

本地开发：`pnpm dev`

### 禁止事项

- 不注释掉报错来让代码跑起来，找根本原因
- 不把任何 token、密钥写入代码或 commit
- 不自行修改 `next.config.mjs` 的 i18n 配置，改之前先说明

### 红线操作（必须先问 DB）

- 删除任何文件或目录
- 修改 `.env` 相关文件
- git push / git reset --hard
- 安装新的全局依赖
- 修改 Vercel 部署配置

---

## 部署

- 平台：Vercel
- 分支策略：`main` 分支自动部署到生产
- Preview：每个 PR 自动生成预览链接
- 环境变量在 Vercel Dashboard 设置，不写入代码

---

## SEO 规范

每个页面必须有：
- `<title>`：`文章标题 | 打包Takeaway`
- `<meta name="description">`：来自 frontmatter 的 `description` 字段
- `<meta property="og:image">`：来自 frontmatter 的 `cover` 字段，无则用默认封面

语言标注：
- 中文页面：`<html lang="zh-Hans">`
- 英文页面：`<html lang="en">`
- 每篇文章的中英版本互相添加 `hreflang` 标注

---

## 后期可扩展（现在不做）

- RSS Feed
- 邮件订阅
- 搜索功能
- 文章阅读进度条
- 动态 OG 图生成

---

## 内容自动化

### YouTube 视频抓取

**脚本**：`scripts/fetch-youtube.mjs`

**前提条件**：
- `.env.local` 中有 `YOUTUBE_API_KEY`
- 代理开启（Clash 默认 `127.0.0.1:7890`）

**运行**：
```bash
node scripts/fetch-youtube.mjs
```

如需设置代理：
```bash
export https_proxy=http://127.0.0.1:7890
node scripts/fetch-youtube.mjs
```

**过滤逻辑**：
- 只创建 >= 2:30 的长视频（Shorts 跳过）
- 已有 MDX 的 slug 会跳过，不会重复创建
- 新视频上线后重新运行脚本即可抓取

**频道信息**：
- Handle: `@dbdb3845`
- Channel ID: `UCAQ6A0Q-0_Gjb8Xhz0vr6fA`

---

*最后更新：2025-05*
*维护者：DB*
