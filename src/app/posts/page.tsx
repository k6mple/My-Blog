import type { Metadata } from "next";

import { PostDirectory } from "@/components/posts/post-directory";
import { categories, tags } from "@/content/taxonomy";
import { getAllArticles } from "@/lib/content";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "文章",
  description:
    "关于界面、前端工程、排版与工作方式的文章。按关键词、分类或标签找到想读的内容。",
  alternates: {
    canonical: "/posts",
  },
  openGraph: {
    title: "文章 · 帧间",
    description:
      "关于界面、前端工程、排版与工作方式的文章。按关键词、分类或标签找到想读的内容。",
    url: "/posts",
    type: "website",
    images: [socialImage],
  },
};

interface PostsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const articles = getAllArticles();

  return (
    <div className="archive-page">
      <header className="site-container page-hero archive-hero">
        <p className="page-index">
          文章 <span aria-hidden="true">/</span> {articles.length}
        </p>

        <div className="archive-hero-grid">
          <h1>
            写下来的，
            <br />
            <span>才算想清楚。</span>
          </h1>

          <div className="archive-hero-copy">
            <p>
              这里记录我在界面、工程与工作方式上的判断。写给未来的自己，也写给正好路过的你。
            </p>
            <p>
              可以按关键词寻找，或从分类和标签进入具体的方向。没有推荐的路径，只有你此刻感兴趣的问题。
            </p>
          </div>
        </div>
      </header>

      <PostDirectory
        articles={articles}
        categories={categories}
        tags={tags}
        initialQuery={readParam(params.q)}
        initialCategory={readParam(params.category)}
        initialTag={readParam(params.tag)}
      />
    </div>
  );
}
