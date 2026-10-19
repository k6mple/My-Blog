import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ArticleMeta } from "@/content/types";
import { artworkSources } from "@/lib/artwork";
import { formatDate, formatReadingTime } from "@/lib/format";

interface FeaturedStoryProps {
  article: ArticleMeta;
}

export function FeaturedStory({ article }: FeaturedStoryProps) {
  return (
    <article className="featured-story">
      <div className="featured-story-copy">
        <div className="story-meta">
          <span className="featured-label">编辑精选</span>
          <span aria-hidden="true">/</span>
          <span>{article.category.name}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </div>

        <h3 className="featured-story-title">
          <Link
            href={`/posts/${article.slug}`}
            className="stretched-link heading-link"
          >
            {article.title}
          </Link>
        </h3>

        <p className="featured-story-description">{article.description}</p>

        <div className="featured-story-footer">
          <span>{formatReadingTime(article.readingTime)}</span>
          <span className="story-cta">
            阅读全文
            <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="featured-story-art">
        <Image
          src={artworkSources[article.artwork]}
          alt=""
          fill
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="featured-story-image"
        />
        <span className="featured-story-art-label" aria-hidden="true">
          Visual study / {article.category.name}
        </span>
      </div>
    </article>
  );
}
