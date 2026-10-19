import type { Category, CategorySlug, Tag, TagSlug } from "./types";

export const categories: readonly Category[] = [
  {
    slug: "engineering",
    name: "工程",
    englishName: "Engineering",
    description: "组件、CSS、性能，以及把设计意图带进代码的过程。",
  },
  {
    slug: "design",
    name: "设计",
    englishName: "Design",
    description: "关于排版、交互与阅读体验的观察和取舍。",
  },
  {
    slug: "notes",
    name: "随笔",
    englishName: "Notes",
    description: "工具、工作方式，以及做东西时想明白的少数事情。",
  },
];

export const tags: readonly Tag[] = [
  { slug: "css", name: "CSS" },
  { slug: "react", name: "React" },
  { slug: "architecture", name: "架构" },
  { slug: "accessibility", name: "无障碍" },
  { slug: "typography", name: "排版" },
  { slug: "interaction", name: "交互" },
  { slug: "motion", name: "动效" },
  { slug: "reading", name: "阅读" },
  { slug: "writing", name: "写作" },
  { slug: "tools", name: "工具" },
  { slug: "craft", name: "工作方法" },
  { slug: "product", name: "产品" },
  { slug: "design-engineering", name: "设计工程" },
];

const categoryMap = new Map<CategorySlug, Category>(
  categories.map((category) => [category.slug, category]),
);

const tagMap = new Map<TagSlug, Tag>(tags.map((tag) => [tag.slug, tag]));

export function getCategory(slug: CategorySlug): Category {
  const category = categoryMap.get(slug);

  if (!category) {
    throw new Error(`Unknown category: ${slug}`);
  }

  return category;
}

export function getTags(slugs: readonly TagSlug[]): Tag[] {
  return slugs.map((slug) => {
    const tag = tagMap.get(slug);

    if (!tag) {
      throw new Error(`Unknown tag: ${slug}`);
    }

    return tag;
  });
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categoryMap.has(value as CategorySlug);
}

export function isTagSlug(value: string): value is TagSlug {
  return tagMap.has(value as TagSlug);
}
