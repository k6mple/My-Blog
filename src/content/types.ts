export const CATEGORY_SLUGS = ["engineering", "design", "notes"] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const TAG_SLUGS = [
  "css",
  "react",
  "architecture",
  "accessibility",
  "typography",
  "interaction",
  "motion",
  "reading",
  "writing",
  "tools",
  "craft",
  "product",
  "design-engineering",
] as const;

export type TagSlug = (typeof TAG_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  name: string;
  englishName: string;
  description: string;
}

export interface Tag {
  slug: TagSlug;
  name: string;
}

export type ArtworkVariant = "weight" | "material" | "reading" | "grid";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  category: CategorySlug;
  tags: TagSlug[];
  featured?: boolean;
  featuredRank?: number;
  artwork?: ArtworkVariant;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  tags: Tag[];
  featured: boolean;
  featuredRank: number | null;
  readingTime: number;
  artwork: ArtworkVariant;
  tableOfContents: TableOfContentsItem[];
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  categoryName: string;
  tags: string[];
}

export interface Topic {
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  introduction: string;
  categories: CategorySlug[];
  tags: TagSlug[];
}

export interface TopicWithPosts extends Topic {
  posts: ArticleMeta[];
}

export type ProjectPreview = "margin" | "scale" | "afterimage";

export type ProjectStatus = "building" | "prototype" | "research";

export interface Project {
  slug: string;
  name: string;
  chineseName: string;
  tagline: string;
  description: string;
  role: string;
  period: string;
  stack: string[];
  status: ProjectStatus;
  statusLabel: string;
  demoUrl: string | null;
  sourceUrl: string | null;
  preview: ProjectPreview;
}
