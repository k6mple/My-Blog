import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ArticleRow } from "@/components/article-row";
import { FeaturedStory } from "@/components/featured-story";
import { FrameStudy } from "@/components/frame-study";
import { ProjectPreview } from "@/components/project-preview";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site";
import {
  getFeaturedArticles,
  getLatestArticles,
  getTopicsWithPosts,
} from "@/lib/content";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute: "帧间 · 陈屿的个人博客",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "帧间 · 陈屿的个人博客",
    description: siteConfig.description,
    url: "/",
    type: "website",
    images: [socialImage],
  },
};

export default function HomePage() {
  const allLatest = getLatestArticles();
  const featured = getFeaturedArticles()[0] ?? allLatest[0];

  if (!featured) {
    return null;
  }

  const latestArticle = allLatest[0];
  const recentArticles = allLatest
    .filter((article) => article.slug !== featured.slug)
    .slice(0, 4);
  const topics = getTopicsWithPosts();
  const spotlight = projects[0];

  return (
    <div className="home">
      <section className="site-container home-hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <p>
            <span className="status-dot" aria-hidden="true" />
            {siteConfig.name}，{siteConfig.role}
          </p>
          <p>{siteConfig.location}</p>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              <span className="hero-line">界面是代码</span>
              <span className="hero-line">与人之间</span>
              <span className="hero-line">
                最短的距离<span className="hero-period">。</span>
              </span>
            </h1>

            <div className="hero-below">
              <div className="hero-lede-wrap">
                <p className="hero-lede">{siteConfig.intro}</p>
                <p className="hero-availability">
                  <span className="status-dot" aria-hidden="true" />
                  {siteConfig.availability}
                </p>
              </div>

              <div className="hero-actions">
                {latestArticle ? (
                  <Link
                    href={`/posts/${latestArticle.slug}`}
                    className="button button-primary"
                  >
                    读最新文章
                    <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
                  </Link>
                ) : null}
                <Link href="/posts" className="button button-secondary">
                  浏览全部文章
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <FrameStudy />
          </div>
        </div>
      </section>

      <section className="site-container home-section" aria-labelledby="featured-title">
        <SectionHeading
          title="编辑精选"
          description="把注意力留给一篇值得慢读的文章。"
          href="/posts"
          linkLabel="全部文章"
          headingId="featured-title"
        />
        <FeaturedStory article={featured} />
      </section>

      <section className="site-container home-section home-recent" aria-labelledby="recent-title">
        <SectionHeading
          title="最近写下的"
          description="关于界面、工程，以及工作里的判断。"
          href="/posts"
          linkLabel="查看文章归档"
          headingId="recent-title"
        />
        <div className="article-list">
          {recentArticles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="site-container home-section" aria-labelledby="topics-title">
        <SectionHeading
          title="按线索阅读"
          description={`${topics.length} 个持续更新的问题，把零散的文章串在一起。`}
          href="/topics"
          linkLabel="浏览全部专题"
          headingId="topics-title"
        />
        <div className="topic-grid">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="topic-card"
            >
              <div className="topic-card-top">
                <span>{String(topic.posts.length).padStart(2, "0")} 篇</span>
                <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span className="topic-card-en">{topic.englishTitle}</span>
            </Link>
          ))}
        </div>
      </section>

      {spotlight ? (
        <section
          className="site-container home-section home-project-section"
          aria-labelledby="project-title"
        >
          <SectionHeading
            title="正在做的东西"
            description="设计不只发生在画板上，也发生在实现它的过程中。"
            href="/projects"
            linkLabel="查看全部作品"
            headingId="project-title"
          />

          <div className="project-spotlight">
            <div className="project-spotlight-visual">
              <ProjectPreview variant={spotlight.preview} />
            </div>

            <div className="project-spotlight-copy">
              <div className="story-meta">
                <span className="status-pill" data-status={spotlight.status}>
                  <span className="status-dot" aria-hidden="true" />
                  {spotlight.statusLabel}
                </span>
                <span aria-hidden="true">/</span>
                <span>{spotlight.period}</span>
              </div>

              <h3>
                {spotlight.chineseName}
                <span>{spotlight.name}</span>
              </h3>
              <p className="project-spotlight-tagline">{spotlight.tagline}</p>
              <p className="project-spotlight-description">
                {spotlight.description}
              </p>

              <dl className="project-facts">
                <div>
                  <dt>角色</dt>
                  <dd>{spotlight.role}</dd>
                </div>
                <div>
                  <dt>技术</dt>
                  <dd>{spotlight.stack.join(" / ")}</dd>
                </div>
              </dl>

              <Link
                href={`/projects#${spotlight.slug}`}
                className="text-link project-spotlight-link"
              >
                了解这个项目
                <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
