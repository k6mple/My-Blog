import type { Project } from "./types";

export const projects: readonly Project[] = [
  {
    slug: "margin",
    name: "Margin",
    chineseName: "余白",
    tagline: "不打断阅读的批注工具。",
    description:
      "为长文阅读而做的本地优先批注工具。高亮、旁注和阅读进度都留在你身边，不需要账号，也不上传原文。我希望它像一个安静的纸边，而不是又一个需要维护的内容平台。",
    role: "产品设计 / 前端开发",
    period: "2025 — 至今",
    stack: ["Next.js", "TypeScript", "Tauri", "SQLite"],
    status: "building",
    statusLabel: "开发中",
    demoUrl: null,
    sourceUrl: null,
    preview: "margin",
  },
  {
    slug: "scale",
    name: "Scale",
    chineseName: "标尺",
    tagline: "让中文排版有据可依。",
    description:
      "一个在浏览器里生成字阶、行高和间距 token 的小工具。它从中文字符的实际阅读密度出发，而不是把西文字体的比例直接搬过来。导出的 CSS 变量可以直接进入项目。",
    role: "设计 / 前端开发",
    period: "2025",
    stack: ["React", "TypeScript", "CSS"],
    status: "prototype",
    statusLabel: "内测筹备中",
    demoUrl: null,
    sourceUrl: null,
    preview: "scale",
  },
  {
    slug: "afterimage",
    name: "Afterimage",
    chineseName: "余像",
    tagline: "把屏幕上的一瞬做成海报。",
    description:
      "一个基于 Canvas 的抽象排版实验：输入一段短句，用种子生成可复现的几何海报。它没有模板，每次调整都像冲洗照片——先设定条件，再接受一点点不可控。",
    role: "概念 / 视觉设计 / 开发",
    period: "2024 — 2025",
    stack: ["Canvas", "TypeScript", "SVG"],
    status: "research",
    statusLabel: "研究中",
    demoUrl: null,
    sourceUrl: null,
    preview: "afterimage",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
