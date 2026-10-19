import type { Topic } from "./types";

export const topics: readonly Topic[] = [
  {
    slug: "interface-engineering",
    title: "界面的工程",
    englishTitle: "Built, not decorated",
    description: "把设计意图带进代码：组件、CSS、性能与边界。",
    introduction:
      "设计稿只是界面的一半。另一半发生在浏览器里：层叠如何工作、状态如何被管理、一个组件应该在哪里结束。这个专题收集那些关于“把界面做出来”的判断。",
    categories: ["engineering"],
    tags: ["design-engineering"],
  },
  {
    slug: "readable-interfaces",
    title: "阅读的形状",
    englishTitle: "The shape of reading",
    description: "关于中文排版、编辑设计与长时间阅读的细节。",
    introduction:
      "文字是界面里最古老、也最常被低估的材质。这里讨论行高与字距，也讨论节奏、留白和一个人愿意在一段文字前停留多久。",
    categories: ["design"],
    tags: ["reading", "typography", "writing"],
  },
  {
    slug: "slow-craft",
    title: "慢一点做东西",
    englishTitle: "Craft over velocity",
    description: "工具、方法与那些无法被效率衡量的判断。",
    introduction:
      "不是每一件事都值得更快。这个专题记录我对工具、工作节奏和个人实践的重新校准——如何保留判断力，以及如何做少一点、但更完整。",
    categories: ["notes"],
    tags: ["tools", "craft", "product"],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}
