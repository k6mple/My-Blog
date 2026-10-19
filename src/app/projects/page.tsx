import {
  ArrowUpRight,
  Clock3,
  Code2,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";

import { ProjectPreview } from "@/components/project-preview";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site";
import type { Project } from "@/content/types";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "作品",
  description:
    "陈屿的个人项目：阅读批注工具 Margin、中文排版工具 Scale，以及生成式排版实验 Afterimage。",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "作品 · 帧间",
    description:
      "陈屿的个人项目：阅读批注工具 Margin、中文排版工具 Scale，以及生成式排版实验 Afterimage。",
    url: "/projects",
    type: "website",
    images: [socialImage],
  },
};

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="project-actions">
      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          className="button button-primary project-action-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          查看演示
          <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
        </a>
      ) : (
        <span className="project-unavailable">
          <Clock3 size={15} strokeWidth={1.7} aria-hidden="true" />
          演示即将上线
        </span>
      )}

      {project.sourceUrl ? (
        <a
          href={project.sourceUrl}
          className="button button-secondary project-action-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          查看源码
          <Code2 size={15} strokeWidth={1.8} aria-hidden="true" />
        </a>
      ) : (
        <span className="project-unavailable">
          <Code2 size={15} strokeWidth={1.7} aria-hidden="true" />
          源码即将公开
        </span>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const githubLink = siteConfig.social.find(
    (link) => link.label === "GitHub",
  );

  return (
    <div className="projects-page">
      <header className="site-container page-hero projects-hero">
        <p className="page-index">
          作品 <span aria-hidden="true">/</span>{" "}
          {String(projects.length).padStart(2, "0")}
        </p>

        <div className="page-hero-grid">
          <h1>
            做出来的东西，
            <br />
            <span>比说出来的更诚实。</span>
          </h1>
          <div className="page-hero-copy">
            <p>
              我在这里放一些自己发起、自己设计、也自己实现的项目。它们规模不大，但都从一个具体的不便将开始。
            </p>
            <p>
              下面这些项目仍在打磨。演示与源码链接准备好之后，会直接出现在对应位置。
            </p>
          </div>
        </div>
      </header>

      <div className="site-container projects-list">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            id={project.slug}
            className="project-entry"
            data-reverse={index % 2 === 1}
          >
            <div className="project-entry-visual">
              <ProjectPreview variant={project.preview} />
            </div>

            <div className="project-entry-copy">
              <div className="project-entry-meta">
                <span className="status-pill" data-status={project.status}>
                  <span className="status-dot" aria-hidden="true" />
                  {project.statusLabel}
                </span>
                <span aria-hidden="true">/</span>
                <span>{project.period}</span>
              </div>

              <h2 className="project-entry-title">
                <span>{project.chineseName}</span>
                <em>{project.name}</em>
              </h2>

              <p className="project-entry-tagline">{project.tagline}</p>
              <p className="project-entry-description">
                {project.description}
              </p>

              <dl className="project-entry-facts">
                <div>
                  <dt>角色</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>技术</dt>
                  <dd>{project.stack.join(" · ")}</dd>
                </div>
              </dl>

              <ProjectActions project={project} />

              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                  `关于 ${project.name} 的交流`,
                )}`}
                className="text-link project-entry-contact"
              >
                对这个项目感兴趣？聊聊看
                <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <section className="site-container projects-note">
        <p className="projects-note-label">关于制作方式</p>
        <p>
          我先用代码做原型，再让界面在真实内容里接受检验。设计系统和动效都从项目本身长出来，而不是套用一套现成的模板。这些项目也构成了我对「安静但好用」的持续练习。
        </p>
        {githubLink ? (
          <a
            href={githubLink.href}
            className="text-link"
            target="_blank"
            rel="noreferrer noopener"
          >
            在 GitHub 上找到我
            <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
          </a>
        ) : null}
      </section>
    </div>
  );
}
