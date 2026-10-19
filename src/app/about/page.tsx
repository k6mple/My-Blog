import { ArrowUpRight, Code2, Mail } from "lucide-react";
import type { Metadata } from "next";

import { siteConfig } from "@/content/site";
import { socialImage } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "关于",
  description:
    "关于陈屿：前端工程师与界面设计者，关注中文排版、界面系统与设计工程。",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "关于 · 帧间",
    description:
      "关于陈屿：前端工程师与界面设计者，关注中文排版、界面系统与设计工程。",
    url: "/about",
    type: "profile",
    images: [socialImage],
  },
};

const focusAreas = [
  {
    title: "界面系统",
    description:
      "让视觉判断变成团队可以使用的规则，而不是留在最后一张设计稿里。",
  },
  {
    title: "中文排版",
    description:
      "在汉字、西文与屏幕之间，寻找一段真正好读的节奏。",
  },
  {
    title: "设计工程",
    description:
      "设计与实现不是接力，而是同一件事的两个段落。",
  },
  {
    title: "可访问性",
    description:
      "焦点、语义与对比度不是加分项，它们决定界面是否诚实。",
  },
];

const timeline = [
  {
    period: "2025 — 现在",
    title: "独立实践",
    place: "杭州",
    description:
      "以独立身份参与产品设计与前端开发，开始做一个本地优先的阅读工具。有意识地减少项目数量，把更多时间留给写作和真正完整的实现。",
  },
  {
    period: "2022 — 2025",
    title: "设计工程师",
    place: "上海",
    description:
      "加入一个小型设计咨询团队，在品牌站、工具产品与内容平台之间工作。第一次认真把设计系统当作产品来维护，也开始写中文排版相关的内部文章。",
  },
  {
    period: "2019 — 2022",
    title: "前端工程师",
    place: "杭州",
    description:
      "在一家 SaaS 公司做前端，从业务页面写到组件库。那几年最大的收获不是掌握了多少框架，而是学会在交付压力里辨认哪些妥协是暂时的，哪些会变成结构的债务。",
  },
];

export default function AboutPage() {
  const githubLink = siteConfig.social.find(
    (link) => link.label === "GitHub",
  );

  return (
    <div className="about-page">
      <header className="site-container page-hero about-hero">
        <p className="page-index">
          关于 <span aria-hidden="true">/</span> {siteConfig.name}
        </p>

        <div className="about-hero-grid">
          <h1>
            让复杂，
            <br />
            <span>看起来本该如此。</span>
          </h1>

          <div className="about-hero-side">
            <p>
              我是陈屿，一名前端工程师与界面设计者。过去六年，我在产品团队里做设计系统、阅读体验和前端架构；现在以独立身份，继续做这些事。
            </p>
            <p>
              我关心的不是界面看起来有多特别，而是它能否让人少想一步、多读一会儿。
            </p>
            <p className="about-hero-location">
              {siteConfig.location}
              <span aria-hidden="true">/</span>
              独立工作
            </p>
          </div>
        </div>
      </header>

      <section
        className="site-container about-story"
        aria-labelledby="about-story-heading"
      >
        <div className="about-portrait-column">
          <figure
            className="about-portrait"
            role="img"
            aria-label="以汉字「屿」和一条蓝色轴线构成的个人标记"
          >
            <span className="about-portrait-glyph" aria-hidden="true">
              屿
            </span>
            <span className="about-portrait-axis" aria-hidden="true" />
            <span className="about-portrait-corner" aria-hidden="true" />
            <span className="about-portrait-caption" aria-hidden="true">
              CHEN YU
              <br />
              HANGZHOU
            </span>
          </figure>
          <p className="about-portrait-note">
            不是头像，也是一种自我介绍。
          </p>
        </div>

        <div className="about-prose">
          <h2 id="about-story-heading" className="sr-only">
            个人介绍
          </h2>
          <p className="about-lead">
            我做设计，也写代码。准确地说，我做那些发生在两者交界处的决定。
          </p>
          <p>
            在很多团队里，设计和开发被安排成一条流水线：前者负责想象，后者负责还原。但真正影响体验的问题，常常出现在两者之间——一个动效应该持续多久，一条错误信息如何措辞，一个组件应该知道多少业务。这些问题没有单独的归属，它们需要一个愿意同时理解两端的人。
          </p>
          <p>
            我喜欢这样的工作。它需要审美，也需要约束；需要写出可以被维护的代码，也需要接受一张设计稿并不足以解释所有状态。我的判断标准很朴素：这个东西在真实内容、真实设备和真实的人面前，是否还站得住。
          </p>
          <p>
            这个博客是我的工作底稿。写下做过的决定、改过的想法和还没想清楚的问题。更新不快，因为大多数文章都要等一个项目结束、或者一种困惑被消化之后才会动笔。
          </p>
        </div>
      </section>

      <section
        className="site-container about-focus"
        aria-labelledby="focus-heading"
      >
        <div className="section-heading">
          <div className="section-heading-copy">
            <h2 id="focus-heading">我关注的事</h2>
            <p>不是标签，是反复回到的几个问题。</p>
          </div>
        </div>

        <div className="focus-grid">
          {focusAreas.map((area) => (
            <article key={area.title} className="focus-item">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="site-container about-experience"
        aria-labelledby="experience-heading"
      >
        <div className="about-section-head">
          <div>
            <h2 id="experience-heading">从哪里来</h2>
            <p>不是一份完整履历，只是几个改变了工作方式的节点。</p>
          </div>
        </div>

        <ol className="timeline">
          {timeline.map((item) => (
            <li key={item.period} className="timeline-item">
              <div className="timeline-period">{item.period}</div>
              <div className="timeline-marker" aria-hidden="true">
                <span />
              </div>
              <div className="timeline-content">
                <h3>
                  {item.title}
                  <span>{item.place}</span>
                </h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="site-container about-now"
        aria-labelledby="now-heading"
      >
        <div className="about-now-intro">
          <p className="page-index">现在</p>
          <h2 id="now-heading">
            在做东西，
            <br />
            也给思考留一点空。
          </h2>
          <p className="about-availability">
            <span className="status-dot" aria-hidden="true" />
            {siteConfig.availability}
          </p>
        </div>

        <div className="now-list">
          <div className="now-item">
            <span>在做</span>
            <p>
              Margin 的批注体验，以及一套能同时服务阅读和写作的中文排版工具。
            </p>
          </div>
          <div className="now-item">
            <span>在学</span>
            <p>
              用更少的元素建立更清楚的结构。也在重新练习用纸和笔记录界面，而不是先打开设计工具。
            </p>
          </div>
          <div className="now-item">
            <span>在读</span>
            <p>
              关于城市、公共空间和日常物件的书。它们和界面没有直接关系，但经常在别处给我答案。
            </p>
          </div>
        </div>
      </section>

      <section
        className="site-container about-contact"
        aria-labelledby="contact-heading"
      >
        <div className="about-contact-inner">
          <p className="page-index">联系</p>
          <h2 id="contact-heading">
            有想做的事，
            <br />
            或者只是想聊聊？
          </h2>
          <p>
            我接受有限数量的长期产品合作，也愿意回复一封写得具体的来信。请告诉我你正在解决什么问题，而不只是需要一个人手。
          </p>

          <div className="about-contact-links">
            <a
              href={`mailto:${siteConfig.email}`}
              className="about-contact-email"
            >
              {siteConfig.email}
              <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>

          <div className="about-socials">
            {githubLink ? (
              <a
                href={githubLink.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Code2 size={16} strokeWidth={1.7} aria-hidden="true" />
                GitHub
                <span>{githubLink.handle}</span>
              </a>
            ) : null}
            <a href={`mailto:${siteConfig.email}`}>
              <Mail size={16} strokeWidth={1.7} aria-hidden="true" />
              邮箱
              <span>{siteConfig.email}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
