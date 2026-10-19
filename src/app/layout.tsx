import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/content/site";
import { getSearchIndex } from "@/lib/content";
import { socialImage } from "@/lib/metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.siteName} · ${siteConfig.name}的个人博客`,
    template: `%s · ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  authors: [{ name: siteConfig.name, url: "/about" }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "个人博客",
    "前端工程",
    "界面设计",
    "中文排版",
    "CSS",
    "React",
    "陈屿",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.siteName} · ${siteConfig.name}的个人博客`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.siteName,
    locale: "zh_CN",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName} · ${siteConfig.name}的个人博客`,
    description: siteConfig.description,
    images: [socialImage.url],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchEntries = getSearchIndex();

  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">
          跳到主要内容
        </a>
        <SiteHeader searchEntries={searchEntries} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
