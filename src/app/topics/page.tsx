import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getTopicsWithPosts } from "@/lib/content";
import { formatCompactDate } from "@/lib/format";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "专题",
  description:
    "按线索整理的文章专题：界面工程、阅读的形状，以及慢一点做东西。",
  alternates: {
    canonical: "/topics",
  },
  openGraph: {
    title: "专题 · 帧间",
    description:
      "按线索整理的文章专题：界面工程、阅读的形状，以及慢一点做东西。",
    url: "/topics",
    type: "website",
    images: [socialImage],
  },
};

export default function TopicsPage() {
  const topics = getTopicsWithPosts();
  const totalArticles = new Set(
    topics.flatMap((topic) => topic.posts.map((post) => post.slug)),
  ).size;

  return (
    <div className="topics-page">
      <header className="site-container page-hero topics-hero">
        <p className="page-index">
          专题 <span aria-hidden="true">/</span> {String(topics.length).padStart(2, "0")}
        </p>

        <div className="page-hero-grid">
          <h1>
            沿着一条线索，
            <br />
            <span>把零散的想法读完。</span>
          </h1>
          <div className="page-hero-copy">
            <p>
              文章按时间排列，专题按问题排列。每个专题是一条持续的线索，会随着新的写作慢慢变长。
            </p>
            <p>
              {topics.length} 个专题，共涉及 {totalArticles} 篇文章。它们不是课程，也没有先后顺序。
            </p>
          </div>
        </div>
      </header>

      <div className="site-container topic-list">
        {topics.map((topic) => {
          const latestPosts = topic.posts.slice(0, 3);

          return (
            <section
              key={topic.slug}
              className="topic-row"
              aria-labelledby={`topic-${topic.slug}`}
            >
              <div className="topic-row-intro">
                <div className="topic-row-meta">
                  <span>{topic.englishTitle}</span>
                  <span>{String(topic.posts.length).padStart(2, "0")} 篇</span>
                </div>
                <h2 id={`topic-${topic.slug}`}>
                  <Link href={`/topics/${topic.slug}`} className="heading-link">
                    {topic.title}
                  </Link>
                </h2>
                <p>{topic.description}</p>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="text-link topic-row-link"
                >
                  进入专题
                  <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
                </Link>
              </div>

              <div className="topic-row-posts">
                <p className="topic-posts-label">最近更新</p>
                <ol>
                  {latestPosts.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/posts/${post.slug}`}>
                        <span className="topic-post-main">
                          <span className="topic-post-title">{post.title}</span>
                          <span className="topic-post-meta">
                            {formatCompactDate(post.date)}
                            <span aria-hidden="true"> / </span>
                            {post.category.name}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
