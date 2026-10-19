"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { siteConfig } from "@/content/site";
import { useBackgroundInert } from "@/hooks/use-background-inert";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";

import { Logo } from "./logo";

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const hasCapturedFocusRef = useRef(false);

  useBodyScrollLock(true);
  useBackgroundInert(true);
  useFocusTrap(panelRef, true);

  const closeMenu = useCallback(() => {
    const returnTarget = returnFocusRef.current;
    onClose();

    window.requestAnimationFrame(() => {
      returnTarget?.focus({ preventScroll: true });
    });
  }, [onClose]);

  useEffect(() => {
    if (!hasCapturedFocusRef.current) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      hasCapturedFocusRef.current = true;
    }

    closeButtonRef.current?.focus();

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeMenu]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return createPortal(
    <div
      ref={panelRef}
      id="mobile-navigation"
      className="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="站点导航"
    >
      <div className="mobile-nav-head">
        <Logo onClick={closeMenu} />
        <button
          ref={closeButtonRef}
          type="button"
          className="icon-button mobile-nav-close"
          onClick={closeMenu}
          aria-label="关闭菜单"
        >
          <X size={21} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      <nav className="mobile-nav-links" aria-label="移动端主导航">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mobile-nav-link"
            data-active={isActive(item.href)}
            onClick={closeMenu}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <span>{item.label}</span>
            <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <div className="mobile-nav-foot">
        <p className="mobile-nav-status">
          <span className="status-dot" aria-hidden="true" />
          {siteConfig.availability}
        </p>
        <div className="mobile-nav-contact">
          <span>{siteConfig.location}</span>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
