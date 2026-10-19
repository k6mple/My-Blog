import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleRow } from "@/components/article-row";
import { ArticleRuntime } from "@/components/article/article-runtime";
import { CopyLinkButton } from "@/components/article/copy-link-button";
import { TableOfContents } from "@/components/article/table-of-contents";
import { SectionHeading } from "@/components/section-heading";
import { Tag } from "@/components/tag";
import { siteConfig } from "@/content/site";
import {
  getAllArticleSlugs,
  getArticle,
  getArticleMeta,
  getRelatedArticles,
} from "@/lib/content";
import { formatDate, formatReadingTime } from "@/lib/format";
import { socialImage } from "@/lib/metadata";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleMeta(slug);

  if (!article) {
    return { title: "文章未找到" };
  }

  const path = `/posts/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags.map((tag) => tag.name),
    authors: [{ name: siteConfig.name, url: "/about" }],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: path,
      siteName: `${siteConfig.siteName} · ${siteConfig.siteNameEn}`,
      locale: "zh_CN",
      publishedTime: `${article.date}T00:00:00.000Z`,
      authors: [siteConfig.name],
      tags: article.tags.map((tag) => tag.name),
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [socialImage.url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "zh-CN",
    articleSection: article.category.name,
    keywords: article.tags.map((tag) => tag.name).join(", "),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: `${siteConfig.url}/about`,
    },
    mainEntityOfPage: `${siteConfig.url}/posts/${article.slug}`,
  };

  return (
    <div className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
        }}
      />
      <ArticleRuntime />

      <article>
        <header className="article-container article-hero">
          <div className="article-hero-actions">
            <Link href="/posts" className="article-back">
              <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
              所有文章
            </Link>
            <CopyLinkButton />
          </div>

          <div className="article-meta-line">
            <Link href={`/posts?category=${article.category.slug}`}>
              {article.category.name}
            </Link>
            <span aria-hidden="true">/</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{formatReadingTime(article.readingTime)}</span>
          </div>

          <h1>{article.title}</h1>
          <p className="article-dek">{article.description}</p>

          <div className="article-byline">
            <span className="article-author-mark" aria-hidden="true">
              屿
            </span>
            <span>{siteConfig.name}</span>
            <span aria-hidden="true">/</span>
            <span>{siteConfig.role}</span>
          </div>
        </header>

        <div className="article-container article-layout">
          <aside className="article-aside">
            <TableOfContents headings={article.tableOfContents} />
          </aside>

          <div className="article-main">
            <div
              className="article-content"
              data-article-content
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            <footer className="article-end">
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <Tag key={tag.slug} href={`/posts?tag=${tag.slug}`}>
                    {tag.name}
                  </Tag>
                ))}
              </div>

              <div className="article-end-row">
                <p>
                  写于 {formatDate(article.date)}，感谢你读到这里。
                </p>
                <Link href="/posts" className="text-link">
                  继续浏览文章
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 ? (
        <section
          className="article-container related-posts"
          aria-labelledby="related-heading"
        >
          <SectionHeading
            title="接着读"
            description="从相近的主题继续往下走。"
            href="/posts"
            linkLabel="全部文章"
            headingId="related-heading"
          />
          <div className="article-list">
            {relatedArticles.map((relatedArticle) => (
              <ArticleRow
                key={relatedArticle.slug}
                article={relatedArticle}
                showSummary={false}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
