import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getLatestArticles } from "@/lib/content";
import { formatCompactDate } from "@/lib/format";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "页面未找到",
  description: "你访问的页面不存在，可以回到首页或浏览文章。",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "页面未找到 · 帧间",
    description: "你访问的页面不存在，可以回到首页或浏览文章。",
    type: "website",
    images: [socialImage],
  },
};

export default function NotFound() {
  const recentArticles = getLatestArticles(3);

  return (
    <div className="not-found-page">
      <section className="site-container not-found-hero">
        <div className="not-found-code" aria-hidden="true">
          404
        </div>

        <div className="not-found-copy">
          <p className="page-index">
            404 <span aria-hidden="true">/</span> 页面不存在
          </p>
          <h1>
            这条路径没有内容，
            <br />
            但还有文字可以读。
          </h1>
          <p>
            页面可能被移动过，或者链接少了一个字符。你可以回到首页，也可以从最近的文章继续。
          </p>

          <div className="not-found-actions">
            <Link href="/" className="button button-primary">
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
              回到首页
            </Link>
            <Link href="/posts" className="button button-secondary">
              浏览全部文章
            </Link>
          </div>
        </div>
      </section>

      <section
        className="site-container not-found-recent"
        aria-labelledby="recent-not-found"
      >
        <div className="collection-head">
          <div>
            <h2 id="recent-not-found">最近更新</h2>
            <p>也许你想找的内容在这里。</p>
          </div>
          <span>{String(recentArticles.length).padStart(2, "0")} 篇</span>
        </div>

        <div className="article-list">
          {recentArticles.map((article) => (
            <article key={article.slug} className="not-found-article">
              <Link href={`/posts/${article.slug}`}>
                <span className="not-found-article-meta">
                  {article.category.name}
                  <span aria-hidden="true"> / </span>
                  {formatCompactDate(article.date)}
                </span>
                <span className="not-found-article-title">{article.title}</span>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            </article>
          ))}
        </div>

        <Link href="/posts" className="text-link not-found-more">
          查看全部文章
          <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
