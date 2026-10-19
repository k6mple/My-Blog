import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";
import { topics } from "@/content/topics";
import {
  getAllArticles,
  getTopicWithPosts,
} from "@/lib/content";

const baseUrl = siteConfig.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const latestArticleDate = articles[0]?.date ?? "2026-01-01";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(`${latestArticleDate}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(`${latestArticleDate}T00:00:00Z`),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(`${latestArticleDate}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(`${latestArticleDate}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(`${latestArticleDate}T00:00:00Z`),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/posts/${article.slug}`,
    lastModified: new Date(`${article.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: article.featured ? 0.8 : 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => {
    const withPosts = getTopicWithPosts(topic.slug);
    const latestDate = withPosts?.posts[0]?.date ?? latestArticleDate;

    return {
      url: `${baseUrl}/topics/${topic.slug}`,
      lastModified: new Date(`${latestDate}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  return [...staticEntries, ...articleEntries, ...topicEntries];
}
