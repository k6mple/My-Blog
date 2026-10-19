import type { ArtworkVariant } from "@/content/types";

export const artworkSources: Record<ArtworkVariant, string> = {
  weight: "/art/weight-study.svg",
  material: "/art/material-grid.svg",
  reading: "/art/weight-study.svg",
  grid: "/art/material-grid.svg",
};

export const artworkAlt: Record<ArtworkVariant, string> = {
  weight: "由粗细不同的横线与蓝色标尺构成的抽象排版图",
  material: "由网格、结构线与蓝色约束线构成的抽象图",
  reading: "由层叠文字与线条构成的抽象阅读主题图",
  grid: "由细网格与几何色块构成的抽象图",
};
