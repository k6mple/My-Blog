# 帧间 · Interframe

一个深色、克制、以阅读为中心的个人博客。内容涵盖前端工程、界面设计与工作方法。

设计概念是「帧间」：界面处在代码与人的缝隙里。页面用系统无衬线字体、超大中文标题、细线、冷蓝色标记和原创排印图形建立识别，动效只用于解释变化。

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript（strict）
- Tailwind CSS 4
- 本地 Markdown + unified / remark / Shiki
- Lucide 图标
- 纯 CSS 动效与原生 Web API；未引入运行时动画库

## 本地运行

需要 Node.js 20.9 或更新版本。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

生产构建：

```bash
npm run build
npm run start
```

质量检查：

```bash
npm run typecheck
npm run lint
```

## 页面

| 路径 | 内容 |
| --- | --- |
| `/` | 首页：个人主张、编辑精选、最新文章、专题、项目 |
| `/posts` | 文章归档、关键词搜索、分类与标签筛选、加载更多 |
| `/posts/[slug]` | 文章详情、语法高亮、复制代码/链接、目录、阅读进度、相关文章 |
| `/topics` | 全部专题 |
| `/topics/[slug]` | 单个专题的文章列表 |
| `/projects` | 作品与项目状态 |
| `/about` | 个人介绍、关注领域、经历时间线、当前状态、联系方式 |
| 任意未知路径 | 延续全站风格的 404 页面 |
| `/sitemap.xml`、`/robots.txt` | 站点索引与搜索引擎配置 |

全局搜索可通过导航栏、`Command/Ctrl + K` 打开；`Esc` 关闭，方向键选择，回车打开。

## 修改个人信息

所有个人品牌信息集中在：

```
src/content/site.ts
```

这里可以修改姓名、站点名、简介、所在地、邮箱、合作状态、社交链接和导航。

需要一起替换的示例链接与文件：

- `src/content/site.ts` 中的 `url`、GitHub 地址和邮箱
- `public/og.png`：社交分享封面（1200×630）
- `src/app/icon.svg`：站点图标
- `src/app/about/page.tsx` 中的介绍、关注领域、时间线与当前状态
- `src/content/projects.ts` 中的项目名称、描述、技术与链接

个人资料与项目均为示例内容，发布前请替换成自己的真实信息。

## 新增或编辑文章

文章位于 `content/articles/*.md`。

新建文件 `content/articles/my-article.md`：

```md
---
title: "文章标题"
description: "用于列表摘要和 SEO 的一句话描述。"
date: "2026-10-19"
category: "design"
tags: ["typography", "reading"]
featured: false
artwork: "reading"
---

正文从这里开始。
```

字段说明：

- `category`：必须是 `src/content/taxonomy.ts` 中已有的分类 slug（当前为 `engineering`、`design`、`notes`）。
- `tags`：必须是已有标签 slug。需要新标签时先在 `src/content/taxonomy.ts` 中定义。
- `featured` / `featuredRank`：是否进入精选，以及精选排序。
- `artwork`：可选值为 `weight`、`material`、`reading`、`grid`，决定精选卡片使用的排印图形。

正文支持 GFM Markdown：

- `##`、`###` 标题会自动进入侧边目录；
- 代码围栏会自动用自定义 Shiki 主题高亮，并生成复制按钮；
- 使用 `![图片替代文本](/art/example.svg "图片说明")` 插入图片，构建时会自动补齐图片尺寸、懒加载和说明文字；
- 文章详情页会自动生成页面标题、描述、Open Graph 与 JSON-LD 信息。

文章排序按日期倒序，阅读时长在构建时自动估算。

## 专题、分类与标签

- `src/content/taxonomy.ts`：分类和标签的唯一数据源
- `src/content/topics.ts`：专题定义，通过分类或标签圈选文章
- 专题文章数与首页、专题页保持一致，因为所有数量都从同一份文章数据推导

## 项目链接

`src/content/projects.ts` 中每个项目都有可选的 `demoUrl` 和 `sourceUrl`。

- 有链接时，页面会自动渲染可点击的「查看演示」「查看源码」；
- 为 `null` 时，页面显示「演示即将上线」「源码即将公开」，不会生成无效按钮。

## 设计系统

全局变量、排版和组件样式集中在 `src/app/globals.css` 顶部与各分区：

- 背景 `#060608`，表面 `#0E0E10` / `#141416`
- 主文字 `#F5F5F7`，辅助文字 `#A1A1A6`，低层级文字 `#86868D`
- 强调色 `#7CB4FF`，只用于链接、焦点、选中和关键动作
- 系统字体栈：Apple 系统字体 → Helvetica Neue → 苹方 / 微软雅黑 → sans-serif
- 正文 17–19px、行高 1.8–1.9，文章栏宽 720px
- 动画时长 180–420ms，并为 `prefers-reduced-motion` 提供降级

## 目录结构

```
content/articles/       Markdown 文章
public/art/             原创 SVG 排印图形
public/og.png           社交分享封面
src/app/                路由、页面元数据与全局样式
src/components/         导航、搜索、文章、项目等组件
src/content/            站点配置、分类、标签、专题、项目
src/hooks/              弹层可访问性、滚动锁定等客户端 hook
src/lib/                内容加载、Markdown 渲染、格式化与剪贴板
inspiration/            设计参考素材（不会被打包进站点）
```
