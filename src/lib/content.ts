import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Heading, Root as MdastRoot } from "mdast";
import { cache } from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { createHighlighter, type ThemeRegistrationRaw } from "shiki";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type {
  Element,
  ElementContent,
  Parent,
  Root as HastRoot,
} from "hast";

import { getCategory, getTags, isCategorySlug, isTagSlug } from "@/content/taxonomy";
import { topics } from "@/content/topics";
import type {
  Article,
  ArticleFrontmatter,
  ArticleMeta,
  ArtworkVariant,
  CategorySlug,
  SearchEntry,
  TableOfContentsItem,
  TagSlug,
  Topic,
  TopicWithPosts,
} from "@/content/types";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

const artworkVariants: readonly ArtworkVariant[] = [
  "weight",
  "material",
  "reading",
  "grid",
];

interface SourceArticle {
  meta: ArticleMeta;
  body: string;
}

/**
 * A restrained syntax theme: near-black paper, quiet punctuation, and one
 * cool blue for structural language. It is intentionally quieter than the
 * default editor themes.
 */
const codeTheme: ThemeRegistrationRaw = {
  name: "interframe",
  type: "dark",
  colors: {
    "editor.background": "#0b0b0d",
    "editor.foreground": "#e7e7ec",
  },
  settings: [],
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#686870", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "constant.language",
      ],
      settings: { foreground: "#83b8ff" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "constant.other.symbol",
        "markup.inline.raw",
      ],
      settings: { foreground: "#c8d3e3" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "variable.function",
      ],
      settings: { foreground: "#f0f0f4" },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#a7c7ea" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#d8d8df" },
    },
    {
      scope: ["numeric", "constant.numeric"],
      settings: { foreground: "#b9d6c9" },
    },
    {
      scope: ["entity.name.tag", "support.type.property-name"],
      settings: { foreground: "#9fc5ec" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#c0cdda" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#85858e" },
    },
    {
      scope: ["markup.heading", "entity.name.section"],
      settings: { foreground: "#f5f5f7", fontStyle: "bold" },
    },
  ],
};

const highlighterPromise = createHighlighter({
  themes: [codeTheme],
  langs: ["ts", "tsx", "js", "jsx", "css", "html", "bash", "json", "markdown"],
});

const languageLabels: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  jsx: "JSX",
  css: "CSS",
  html: "HTML",
  bash: "Shell",
  json: "JSON",
  markdown: "Markdown",
  text: "代码",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  fileName: string,
): string {
  const value = data[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Article "${fileName}" needs a non-empty "${key}" string.`);
  }

  return value.trim();
}

function parseFrontmatter(
  data: Record<string, unknown>,
  fileName: string,
): ArticleFrontmatter {
  const title = requireString(data, "title", fileName);
  const description = requireString(data, "description", fileName);
  const date = requireString(data, "date", fileName);
  const categoryValue = requireString(data, "category", fileName);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`Article "${fileName}" has an invalid date: ${date}`);
  }

  if (!isCategorySlug(categoryValue)) {
    throw new Error(`Article "${fileName}" has an unknown category: ${categoryValue}`);
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    throw new Error(`Article "${fileName}" needs at least one tag.`);
  }

  const tags = data.tags.map((tag) => {
    if (typeof tag !== "string" || !isTagSlug(tag)) {
      throw new Error(`Article "${fileName}" has an unknown tag: ${String(tag)}`);
    }

    return tag;
  });

  const featured = data.featured === true;
  const featuredRank =
    typeof data.featuredRank === "number" && Number.isFinite(data.featuredRank)
      ? data.featuredRank
      : null;

  const artworkValue = data.artwork;
  const artwork =
    typeof artworkValue === "string" &&
    (artworkVariants as readonly string[]).includes(artworkValue)
      ? (artworkValue as ArtworkVariant)
      : "grid";

  return {
    title,
    description,
    date,
    category: categoryValue,
    tags,
    featured,
    ...(featuredRank !== null ? { featuredRank } : {}),
    artwork,
  };
}

function parseTableOfContents(body: string): TableOfContentsItem[] {
  const tree = unified().use(remarkParse).parse(body) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: TableOfContentsItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = mdastToString(node).trim();

    // Every heading must pass through the slugger so duplicate suffixes match
    // the IDs generated later by rehype-slug.
    const id = slugger.slug(text);

    if ((node.depth === 2 || node.depth === 3) && text.length > 0) {
      headings.push({ id, text, depth: node.depth });
    }
  });

  return headings;
}

function calculateReadingTime(body: string): number {
  const plainText = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ");

  const cjkCharacters = plainText.match(/[㐀-鿿]/g)?.length ?? 0;
  const latinWords =
    plainText
      .replace(/[㐀-鿿]/g, " ")
      .match(/[A-Za-z0-9][A-Za-z0-9'’.-]*/g)?.length ?? 0;

  return Math.max(3, Math.ceil(cjkCharacters / 320 + latinWords / 220));
}

function readSourceArticle(fileName: string): SourceArticle {
  const slug = fileName.replace(/\.md$/, "");
  const filePath = path.join(articlesDirectory, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  if (!isRecord(data)) {
    throw new Error(`Article "${fileName}" has invalid frontmatter.`);
  }

  const frontmatter = parseFrontmatter(data, fileName);
  const category = getCategory(frontmatter.category);
  const tags = getTags(frontmatter.tags);

  return {
    meta: {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category,
      tags,
      featured: frontmatter.featured ?? false,
      featuredRank: frontmatter.featuredRank ?? null,
      readingTime: calculateReadingTime(content),
      artwork: frontmatter.artwork ?? "grid",
      tableOfContents: parseTableOfContents(content),
    },
    body: content,
  };
}

const loadSourceArticles = cache((): SourceArticle[] => {
  if (!fs.existsSync(articlesDirectory)) {
    throw new Error(`Articles directory not found: ${articlesDirectory}`);
  }

  const files = fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => /\.md$/.test(fileName))
    .sort();

  if (files.length === 0) {
    throw new Error("No articles found.");
  }

  return files
    .map(readSourceArticle)
    .sort((a, b) => Date.parse(b.meta.date) - Date.parse(a.meta.date));
});

export function getAllArticles(): ArticleMeta[] {
  return loadSourceArticles().map(({ meta }) => meta);
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles()
    .filter((article) => article.featured)
    .sort((a, b) => {
      const rankA = a.featuredRank ?? Number.POSITIVE_INFINITY;
      const rankB = b.featuredRank ?? Number.POSITIVE_INFINITY;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return Date.parse(b.date) - Date.parse(a.date);
    });
}

export function getLatestArticles(limit?: number): ArticleMeta[] {
  const articles = getAllArticles();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(
  article: ArticleMeta,
  limit = 3,
): ArticleMeta[] {
  const articleTagSlugs = new Set(article.tags.map((tag) => tag.slug));

  return getAllArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) =>
        articleTagSlugs.has(tag.slug),
      ).length;
      const sameCategory = candidate.category.slug === article.category.slug ? 2 : 0;

      return { candidate, score: sharedTags * 2 + sameCategory };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return Date.parse(b.candidate.date) - Date.parse(a.candidate.date);
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getSearchIndex(): SearchEntry[] {
  return getAllArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    categoryName: article.category.name,
    tags: article.tags.map((tag) => tag.name),
  }));
}

export function getPostsForTopic(topic: Topic): ArticleMeta[] {
  return getAllArticles().filter((article) => {
    const categoryMatch = topic.categories.includes(
      article.category.slug as CategorySlug,
    );
    const topicTagSet = new Set<TagSlug>(topic.tags);
    const tagMatch = article.tags.some((tag) => topicTagSet.has(tag.slug));

    return categoryMatch || tagMatch;
  });
}

export function getTopicsWithPosts(): TopicWithPosts[] {
  return topics.map((topic) => ({
    ...topic,
    posts: getPostsForTopic(topic),
  }));
}

export function getTopicWithPosts(slug: string): TopicWithPosts | undefined {
  const topic = topics.find((candidate) => candidate.slug === slug);

  if (!topic) {
    return undefined;
  }

  return { ...topic, posts: getPostsForTopic(topic) };
}

function textContent(node: Element | ElementContent): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type === "element") {
    return node.children.map(textContent).join("");
  }

  return "";
}

function rehypeArticleFigures() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "p") {
        return;
      }

      const meaningfulChildren = node.children.filter(
        (child) => child.type !== "text" || child.value.trim().length > 0,
      );
      const image = meaningfulChildren[0];

      if (
        meaningfulChildren.length !== 1 ||
        !image ||
        image.type !== "element" ||
        image.tagName !== "img"
      ) {
        return;
      }

      const captionValue = image.properties.title;
      image.properties.width = 1600;
      image.properties.height = 1000;
      image.properties.loading = "lazy";
      image.properties.decoding = "async";
      delete image.properties.title;

      const children: ElementContent[] = [image];

      if (typeof captionValue === "string" && captionValue.trim().length > 0) {
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: captionValue }],
        });
      }

      node.tagName = "figure";
      node.properties = { className: ["article-figure"] };
      node.children = children;
    });
  };
}

function rehypeCodeBlocks() {
  return async (tree: HastRoot) => {
    const highlighter = await highlighterPromise;

    visit(tree, "element", (node: Element, index, parent: Parent | undefined) => {
      if (
        node.tagName !== "pre" ||
        typeof index !== "number" ||
        !parent ||
        !Array.isArray(parent.children)
      ) {
        return;
      }

      const codeElement = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );

      if (!codeElement) {
        return;
      }

      const classNames = Array.isArray(codeElement.properties.className)
        ? codeElement.properties.className.map(String)
        : [];
      const languageClass = classNames.find((name) => name.startsWith("language-"));
      const requestedLanguage = languageClass?.replace("language-", "") ?? "text";
      const loadedLanguages = highlighter.getLoadedLanguages();
      const language = loadedLanguages.includes(requestedLanguage)
        ? requestedLanguage
        : "text";
      const rawCode = textContent(codeElement).replace(/\n$/, "");
      const highlighted = highlighter.codeToHast(rawCode, {
        lang: language,
        theme: codeTheme,
      });
      const highlightedPre = highlighted.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "pre",
      );

      if (!highlightedPre) {
        return;
      }

      const inlineStyle =
        typeof highlightedPre.properties.style === "string"
          ? highlightedPre.properties.style
          : "";
      highlightedPre.properties.style = inlineStyle.replace(
        /background-color:[^;]+;?/g,
        "",
      );
      highlightedPre.properties.tabIndex = 0;
      highlightedPre.properties.className = ["code-pre"];

      const figure: Element = {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["code-block"],
          "data-language": requestedLanguage,
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-head"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-language"] },
                children: [
                  {
                    type: "text",
                    value: languageLabels[language] ?? "代码",
                  },
                ],
              },
              {
                type: "element",
                tagName: "button",
                properties: {
                  type: "button",
                  className: ["code-copy"],
                  "data-copy-code": "",
                  "aria-label": "复制代码",
                },
                children: [{ type: "text", value: "复制" }],
              },
            ],
          },
          highlightedPre,
        ],
      };

      parent.children[index] = figure;
    });
  };
}

const articleProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeArticleFigures)
  .use(rehypeCodeBlocks)
  .use(rehypeStringify);

export async function getArticle(slug: string): Promise<Article | undefined> {
  const source = loadSourceArticles().find(
    ({ meta }) => meta.slug === slug,
  );

  if (!source) {
    return undefined;
  }

  const rendered = await articleProcessor.process(source.body);

  return {
    ...source.meta,
    contentHtml: String(rendered),
  };
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}
