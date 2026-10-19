import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleRow } from "@/components/article-row";
import { topics } from "@/content/topics";
import { getTopicWithPosts, getTopicsWithPosts } from "@/lib/content";
import { socialImage } from "@/lib/metadata";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicWithPosts(slug);

  if (!topic) {
    return { title: "专题未找到" };
  }

  const description = `${topic.description} ${topic.introduction}`;

  return {
    title: topic.title,
    description,
    alternates: {
      canonical: `/topics/${topic.slug}`,
    },
    openGraph: {
      title: `${topic.title} · 帧间专题`,
      description,
      url: `/topics/${topic.slug}`,
      type: "website",
      images: [socialImage],
    },
  };
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicWithPosts(slug);

  if (!topic) {
    notFound();
  }

  const otherTopics = getTopicsWithPosts()
    .filter((item) => item.slug !== topic.slug)
    .slice(0, 2);

  return (
    <div className="topic-detail-page">
      <header className="site-container topic-detail-hero">
        <Link href="/topics" className="article-back">
          <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
          所有专题
        </Link>

        <p className="page-index topic-detail-index">
          {topic.englishTitle}
          <span aria-hidden="true">/</span>
          {String(topic.posts.length).padStart(2, "0")} 篇
        </p>

        <div className="topic-detail-grid">
          <h1>{topic.title}</h1>
          <div className="topic-detail-intro">
            <p>{topic.introduction}</p>
            <span>{topic.description}</span>
          </div>
        </div>
      </header>

      <section
        className="article-container topic-detail-list"
        aria-labelledby="topic-posts-heading"
      >
        <div className="collection-head topic-collection-head">
          <div>
            <h2 id="topic-posts-heading">专题文章</h2>
            <p>按发布时间，从新到旧。</p>
          </div>
          <span>{String(topic.posts.length).padStart(2, "0")} 篇</span>
        </div>

        {topic.posts.length > 0 ? (
          <div className="article-list">
            {topic.posts.map((article) => (
              <ArticleRow
                key={article.slug}
                article={article}
                showFeaturedMark
              />
            ))}
          </div>
        ) : (
          <div className="archive-empty">
            <h3>这个专题还在整理中</h3>
            <p>新的文章正在路上，可以先浏览其他专题。</p>
            <Link href="/topics" className="button button-primary">
              返回全部专题
            </Link>
          </div>
        )}
      </section>

      {otherTopics.length > 0 ? (
        <nav
          className="site-container topic-switcher"
          aria-label="浏览其他专题"
        >
          <p>换一条线索</p>
          <div>
            {otherTopics.map((otherTopic) => (
              <Link
                key={otherTopic.slug}
                href={`/topics/${otherTopic.slug}`}
                className="topic-switch-link"
              >
                <span>{otherTopic.title}</span>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
