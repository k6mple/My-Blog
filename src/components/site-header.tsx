"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { siteConfig } from "@/content/site";
import type { SearchEntry } from "@/content/types";
import { cx } from "@/lib/format";

import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";

interface SiteHeaderProps {
  searchEntries: SearchEntry[];
}

export function SiteHeader({ searchEntries }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let frame = 0;

    const updateHeader = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 12);
      });
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  useEffect(() => {
    const closeOverlays = () => {
      setSearchOpen(false);
      setMenuOpen(false);
    };

    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("popstate", closeOverlays);
    desktopQuery.addEventListener("change", closeMenuOnDesktop);

    return () => {
      window.removeEventListener("popstate", closeOverlays);
      desktopQuery.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  useEffect(() => {
    const openSearchWithShortcut = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === "k"
      ) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", openSearchWithShortcut);

    return () => {
      document.removeEventListener("keydown", openSearchWithShortcut);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="site-header" data-scrolled={isScrolled}>
        <div className="site-container header-inner">
          <Logo />

          <nav className="desktop-nav" aria-label="主导航">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx("nav-link", isActive(item.href) && "is-active")}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="search-trigger"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-keyshortcuts="Meta+K Control+K"
              title="使用 Command 或 Control + K 打开搜索"
            >
              <Search size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className="search-trigger-label">搜索</span>
              <kbd className="search-trigger-kbd" aria-hidden="true">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              className="icon-button menu-trigger"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={20} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? <MobileNav onClose={closeMenu} /> : null}
      {searchOpen ? (
        <SearchDialog entries={searchEntries} onClose={closeSearch} />
      ) : null}
    </>
  );
}
