import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/content/site";

import { Logo } from "./logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-intro">
            <Logo />
            <p>{siteConfig.footerNote}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="footer-email text-link"
            >
              {siteConfig.email}
              <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>

          <div className="footer-column">
            <p className="footer-label">浏览</p>
            <nav aria-label="页脚导航" className="footer-links">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-column">
            <p className="footer-label">联系</p>
            <div className="footer-links">
              {siteConfig.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  {link.label}
                  <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-column footer-location">
            <p className="footer-label">位置</p>
            <p>{siteConfig.location}</p>
            <p>独立工作 · 自 2024 年记录</p>
          </div>
        </div>

        <div className="footer-base">
          <p>
            © {siteConfig.copyrightStartYear}–{year} {siteConfig.name}
          </p>
          <p>以耐心和手写 CSS 制作</p>
          <a href="#main" className="footer-top-link">
            回到顶部 ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
