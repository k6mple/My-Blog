"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Search,
  SearchX,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ArticleMeta,
  Category,
  CategorySlug,
  Tag,
  TagSlug,
} from "@/content/types";
import { artworkSources } from "@/lib/artwork";
import { formatCompactDate, formatReadingTime } from "@/lib/format";

import { ArticleRow } from "../article-row";

interface PostDirectoryProps {
  articles: ArticleMeta[];
  categories: readonly Category[];
  tags: readonly Tag[];
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
}

type CategoryFilter = CategorySlug | "all";
type TagFilter = TagSlug | "all";

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN");
}

function FeaturedMiniCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="featured-mini">
      <Link href={`/posts/${article.slug}`} className="featured-mini-link">
        <div className="featured-mini-art">
          <Image
            src={artworkSources[article.artwork]}
            alt=""
            fill
            sizes="(min-width: 900px) 45vw, 100vw"
            className="featured-mini-image"
          />
        </div>
        <div className="featured-mini-copy">
          <div className="story-meta">
            <span className="featured-label">精选</span>
            <span aria-hidden="true">/</span>
            <span>{article.category.name}</span>
          </div>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <div className="featured-mini-footer">
            <span>
              {formatCompactDate(article.date)} ·{" "}
              {formatReadingTime(article.readingTime)}
            </span>
            <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PostDirectory({
  articles,
  categories,
  tags,
  initialQuery = "",
  initialCategory: initialCategoryParam,
  initialTag: initialTagParam,
}: PostDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initialCategory: CategoryFilter = categories.some(
    (category) => category.slug === initialCategoryParam,
  )
    ? (initialCategoryParam as CategorySlug)
    : "all";

  const initialTag: TagFilter = tags.some((tag) => tag.slug === initialTagParam)
    ? (initialTagParam as TagSlug)
    : "all";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [tag, setTag] = useState<TagFilter>(initialTag);
  const [visibleCount, setVisibleCount] = useState(6);
  const deferredQuery = useDeferredValue(query);

  const categoryCounts = useMemo(
    () =>
      new Map(
        categories.map((item) => [
          item.slug,
          articles.filter((article) => article.category.slug === item.slug)
            .length,
        ]),
      ),
    [articles, categories],
  );

  const hasFilters =
    deferredQuery.trim().length > 0 || category !== "all" || tag !== "all";

  const filteredArticles = useMemo(() => {
    const terms = normalize(deferredQuery).trim().split(/\s+/).filter(Boolean);
    const selectedCategory = categories.find((item) => item.slug === category);
    const selectedTag = tags.find((item) => item.slug === tag);

    return articles.filter((article) => {
      if (category !== "all" && article.category.slug !== category) {
        return false;
      }

      if (
        tag !== "all" &&
        !article.tags.some((articleTag) => articleTag.slug === tag)
      ) {
        return false;
      }

      if (terms.length === 0) {
        return true;
      }

      const haystack = normalize(
        [
          article.title,
          article.description,
          article.category.name,
          selectedCategory?.name ?? "",
          selectedTag?.name ?? "",
          ...article.tags.map((articleTag) => articleTag.name),
        ].join(" "),
      );

      return terms.every((term) => haystack.includes(term));
    });
  }, [articles, categories, category, deferredQuery, tag, tags]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      const normalizedQuery = query.trim();

      if (normalizedQuery) params.set("q", normalizedQuery);
      if (category !== "all") params.set("category", category);
      if (tag !== "all") params.set("tag", tag);

      const search = params.toString();
      const nextUrl = `${pathname}${search ? `?${search}` : ""}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 180);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, category, tag, pathname, router]);

  const featuredArticles = articles.filter((article) => article.featured);
  const regularArticles = articles.filter((article) => !article.featured);
  const sourceArticles = hasFilters ? filteredArticles : regularArticles;
  const visibleArticles = sourceArticles.slice(0, visibleCount);
  const hasMore = sourceArticles.length > visibleCount;
  const remainingCount = Math.max(sourceArticles.length - visibleCount, 0);

  const chooseCategory = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    setVisibleCount(6);
  };

  const chooseTag = (nextTag: TagFilter) => {
    setTag(nextTag);
    setVisibleCount(6);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setTag("all");
    setVisibleCount(6);
    searchInputRef.current?.focus();
  };

  const totalCount = hasFilters
    ? filteredArticles.length
    : regularArticles.length;

  return (
    <div className="post-directory">
      <section
        className="site-container archive-filters"
        aria-label="搜索与筛选文章"
      >
        <div className="filter-search">
          <Search size={19} strokeWidth={1.7} aria-hidden="true" />
          <label htmlFor="archive-search" className="sr-only">
            搜索文章
          </label>
          <input
            ref={searchInputRef}
            id="archive-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(6);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
                setVisibleCount(6);
              }
            }}
            placeholder="搜索标题、摘要或标签"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="filter-search-clear"
              onClick={() => {
                setQuery("");
                setVisibleCount(6);
                searchInputRef.current?.focus();
              }}
              aria-label="清除搜索关键词"
            >
              <X size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : (
            <span className="filter-search-hint" aria-hidden="true">
              关键词
            </span>
          )}
        </div>

        <div className="filter-row">
          <span className="filter-label">分类</span>
          <div className="filter-categories" aria-label="按分类筛选">
            <button
              type="button"
              className="filter-category"
              data-active={category === "all"}
              aria-pressed={category === "all"}
              onClick={() => chooseCategory("all")}
            >
              全部
              <span>{articles.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="filter-category"
                data-active={category === item.slug}
                aria-pressed={category === item.slug}
                onClick={() => chooseCategory(item.slug)}
              >
                {item.name}
                <span>{categoryCounts.get(item.slug) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row filter-row-tags">
          <span className="filter-label">标签</span>
          <div className="filter-tags" aria-label="按标签筛选">
            <button
              type="button"
              className="filter-tag"
              data-active={tag === "all"}
              aria-pressed={tag === "all"}
              onClick={() => chooseTag("all")}
            >
              全部
            </button>
            {tags.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="filter-tag"
                data-active={tag === item.slug}
                aria-pressed={tag === item.slug}
                onClick={() => chooseTag(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-summary" aria-live="polite">
          <p>
            {hasFilters
              ? `找到 ${filteredArticles.length} 篇文章`
              : `共 ${articles.length} 篇文章`}
            {category !== "all"
              ? ` · ${categories.find((item) => item.slug === category)?.name}`
              : ""}
            {tag !== "all"
              ? ` · ${tags.find((item) => item.slug === tag)?.name}`
              : ""}
          </p>
          {hasFilters ? (
            <button
              type="button"
              className="filter-clear-all"
              onClick={clearFilters}
            >
              清除全部条件
            </button>
          ) : null}
        </div>
      </section>

      {!hasFilters && featuredArticles.length > 0 ? (
        <section
          className="site-container archive-featured"
          aria-labelledby="featured-posts-heading"
        >
          <div className="collection-head">
            <div>
              <h2 id="featured-posts-heading">编辑精选</h2>
              <p>从最近的文章里，挑出值得慢慢读的内容。</p>
            </div>
            <span>{String(featuredArticles.length).padStart(2, "0")} 篇</span>
          </div>

          <div className="featured-mini-grid">
            {featuredArticles.map((article) => (
              <FeaturedMiniCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        className="site-container archive-results"
        aria-labelledby="archive-results-heading"
      >
        <div className="collection-head">
          <div>
            <h2 id="archive-results-heading">
              {hasFilters ? "筛选结果" : "继续阅读"}
            </h2>
            <p>
              {hasFilters
                ? deferredQuery.trim()
                  ? `与“${deferredQuery.trim()}”相关的文章`
                  : "符合当前筛选条件的文章"
                : "所有非精选文章，按发布时间排序。"}
            </p>
          </div>
          <span aria-live="polite">{String(totalCount).padStart(2, "0")} 篇</span>
        </div>

        {visibleArticles.length > 0 ? (
          <>
            <div className="article-list archive-article-list">
              {visibleArticles.map((article) => (
                <ArticleRow
                  key={article.slug}
                  article={article}
                  showFeaturedMark
                />
              ))}
            </div>

            {hasMore ? (
              <div className="load-more-wrap">
                <button
                  type="button"
                  className="button button-secondary load-more"
                  onClick={() => setVisibleCount((count) => count + 6)}
                >
                  <ArrowDown size={16} strokeWidth={1.8} aria-hidden="true" />
                  加载更多
                  <span>还有 {remainingCount} 篇</span>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="archive-empty">
            <span className="archive-empty-icon" aria-hidden="true">
              <SearchX size={24} strokeWidth={1.5} />
            </span>
            <h3>没有找到匹配的文章</h3>
            <p>
              试试缩短关键词、换一个标签，或者清除当前条件重新浏览。
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={clearFilters}
            >
              清除筛选条件
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
