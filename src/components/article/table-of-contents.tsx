"use client";

import { ChevronDown, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { TableOfContentsItem } from "@/content/types";

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const updateActiveHeading = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const offset = 160;
        let currentId = headings[0]?.id ?? "";

        for (const heading of headings) {
          const element = document.getElementById(heading.id);

          if (element && element.getBoundingClientRect().top <= offset) {
            currentId = heading.id;
          }
        }

        setActiveId((current) =>
          current === currentId ? current : currentId,
        );
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const closeMobileToc = () => {
    if (window.innerWidth < 1160) {
      mobileDetailsRef.current?.removeAttribute("open");
    }
  };

  return (
    <>
      <details ref={mobileDetailsRef} className="toc-mobile">
        <summary>
          <span className="toc-mobile-title">
            <List size={17} strokeWidth={1.7} aria-hidden="true" />
            本文目录
          </span>
          <span className="toc-mobile-count">
            {headings.length} 节
            <ChevronDown
              size={16}
              strokeWidth={1.7}
              aria-hidden="true"
              className="toc-chevron"
            />
          </span>
        </summary>
        <nav aria-label="文章目录">
          <ol>
            {headings.map((heading) => (
              <li key={heading.id} data-depth={heading.depth}>
                <a
                  href={`#${heading.id}`}
                  onClick={closeMobileToc}
                  aria-current={activeId === heading.id ? "location" : undefined}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>

      <nav className="toc-desktop" aria-label="文章目录">
        <p className="toc-title">本文目录</p>
        <ol>
          {headings.map((heading) => (
            <li key={heading.id} data-depth={heading.depth}>
              <a
                href={`#${heading.id}`}
                data-active={activeId === heading.id}
                aria-current={activeId === heading.id ? "location" : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
