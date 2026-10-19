import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ArticleMeta } from "@/content/types";
import { cx, formatCompactDate, formatReadingTime } from "@/lib/format";

interface ArticleRowProps {
  article: ArticleMeta;
  showSummary?: boolean;
  showFeaturedMark?: boolean;
  className?: string;
}

export function ArticleRow({
  article,
  showSummary = true,
  showFeaturedMark = false,
  className,
}: ArticleRowProps) {
  return (
    <article className={cx("article-row", className)}>
      <Link href={`/posts/${article.slug}`} className="article-row-link">
        <div className="article-row-content">
          <div className="article-row-meta">
            <span className="category-label">{article.category.name}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={article.date}>{formatCompactDate(article.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{formatReadingTime(article.readingTime)}</span>
            {showFeaturedMark && article.featured ? (
              <>
                <span aria-hidden="true">/</span>
                <span className="featured-label">精选</span>
              </>
            ) : null}
          </div>

          <h3 className="article-row-title">{article.title}</h3>

          {showSummary ? (
            <p className="article-row-summary">{article.description}</p>
          ) : null}
        </div>

        <div className="article-row-side" aria-hidden="true">
          <span className="article-row-arrow">
            <ArrowUpRight size={17} strokeWidth={1.7} />
          </span>
        </div>
      </Link>
    </article>
  );
}
