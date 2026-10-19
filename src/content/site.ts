export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export const siteConfig = {
  url: "https://interframe.blog",
  siteName: "帧间",
  siteNameEn: "Interframe",
  name: "陈屿",
  role: "前端工程师 / 界面设计者",
  location: "杭州，中国",
  email: "hello@interframe.blog",
  description:
    "陈屿的个人博客。关于界面、代码，以及两者之间那些容易被忽略的细节。",
  intro:
    "我是陈屿，一名前端工程师与界面设计者。过去六年，我在产品团队里做设计系统、阅读体验和前端架构；现在以独立身份继续做这些事。",
  availability: "2026 年 11 月起，接受 1–2 个长期合作",
  nav: [
    { label: "文章", href: "/posts" },
    { label: "专题", href: "/topics" },
    { label: "作品", href: "/projects" },
    { label: "关于", href: "/about" },
  ] satisfies NavItem[],
  social: [
    {
      label: "GitHub",
      href: "https://github.com/chenyu-interframe",
      handle: "@chenyu-interframe",
    },
    {
      label: "邮箱",
      href: "mailto:hello@interframe.blog",
      handle: "hello@interframe.blog",
    },
  ] satisfies SocialLink[],
  footerNote:
    "写界面，也写界面背后的判断。这里没有更新计划，只有想清楚之后才写下的东西。",
  copyrightStartYear: 2024,
} as const;
