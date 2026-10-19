"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { copyText } from "@/lib/clipboard";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ArticleRuntime() {
  const progressRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const updateProgress = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const content = document.querySelector<HTMLElement>(
          "[data-article-content]",
        );

        if (!content) {
          return;
        }

        const rect = content.getBoundingClientRect();
        const contentTop = window.scrollY + rect.top;
        const start = contentTop - 120;
        const end = contentTop + content.offsetHeight - window.innerHeight * 0.7;
        const progress = clamp(
          (window.scrollY - start) / Math.max(end - start, 1),
          0,
          1,
        );

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }

        setShowBackToTop(window.scrollY > 1100 && progress > 0.04);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const copyButtonFeedback = (button: HTMLButtonElement, message: string) => {
      const originalLabel = button.getAttribute("aria-label") ?? "复制代码";
      button.textContent = message;
      button.dataset.copied = "true";
      button.setAttribute("aria-label", "代码已复制");
      setCopyMessage("代码已复制到剪贴板");

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        button.textContent = "复制";
        button.removeAttribute("data-copied");
        button.setAttribute("aria-label", originalLabel);
        setCopyMessage("");
      }, 2000);
    };

    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest<HTMLButtonElement>("[data-copy-code]");

      if (!button || !button.closest("[data-article-content]")) {
        return;
      }

      const figure = button.closest("figure.code-block");
      const code = figure?.querySelector("pre");

      if (!code) {
        return;
      }

      try {
        await copyText(code.innerText.replace(/\n$/, ""));
        copyButtonFeedback(button, "已复制");
      } catch {
        button.textContent = "复制失败";
        button.dataset.copied = "error";
        setCopyMessage("代码复制失败，请手动选择复制");

        window.setTimeout(() => {
          button.textContent = "复制";
          button.removeAttribute("data-copied");
        }, 2000);
      }
    };

    document.addEventListener("click", handleCopyClick);

    return () => {
      document.removeEventListener("click", handleCopyClick);

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <div ref={progressRef} className="reading-progress-bar" />
      </div>

      {showBackToTop ? (
        <button
          type="button"
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="回到文章顶部"
        >
          <ArrowUp size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>顶部</span>
        </button>
      ) : null}

      <span className="sr-only" role="status" aria-live="polite">
        {copyMessage}
      </span>
    </>
  );
}
