"use client";

import {
  ArrowUpRight,
  CornerDownLeft,
  Search,
  SearchX,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import type { SearchEntry } from "@/content/types";
import { useBackgroundInert } from "@/hooks/use-background-inert";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { formatCompactDate } from "@/lib/format";

interface SearchDialogProps {
  entries: SearchEntry[];
  onClose: () => void;
}

interface ScoredEntry {
  entry: SearchEntry;
  score: number;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN").trim();
}

function getSearchTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

function scoreEntry(entry: SearchEntry, terms: string[]): number | null {
  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const tags = normalize(entry.tags.join(" "));
  const category = normalize(entry.categoryName);
  const haystack = `${title} ${description} ${tags} ${category}`;

  if (!terms.every((term) => haystack.includes(term))) {
    return null;
  }

  return terms.reduce((score, term) => {
    let nextScore = score;

    if (title.includes(term)) nextScore += 8;
    if (tags.includes(term)) nextScore += 5;
    if (category.includes(term)) nextScore += 3;
    if (description.includes(term)) nextScore += 2;

    return nextScore;
  }, 0);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const terms = getSearchTerms(query);

  if (terms.length === 0) {
    return text;
  }

  const expression = new RegExp(
    `(${terms.map(escapeRegExp).join("|")})`,
    "gi",
  );
  const parts = text.split(expression);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={`${part}-${index}`} className="search-mark">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export function SearchDialog({ entries, onClose }: SearchDialogProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const hasCapturedFocusRef = useRef(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useBodyScrollLock(true);
  useBackgroundInert(true);
  useFocusTrap(panelRef, true);

  const closeDialog = useCallback(() => {
    const capturedTarget = returnFocusRef.current;
    const fallbackTarget = document.querySelector<HTMLElement>(".search-trigger");
    const returnTarget =
      capturedTarget?.isConnected ? capturedTarget : fallbackTarget;

    onClose();

    window.requestAnimationFrame(() => {
      returnTarget?.focus({ preventScroll: true });
    });
  }, [onClose]);

  const results = useMemo<ScoredEntry[]>(() => {
    const terms = getSearchTerms(query);

    if (terms.length === 0) {
      return entries.slice(0, 5).map((entry, index) => ({
        entry,
        score: entries.length - index,
      }));
    }

    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
      .filter((result): result is ScoredEntry => result.score !== null)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return Date.parse(b.entry.date) - Date.parse(a.entry.date);
      });
  }, [entries, query]);

  useEffect(() => {
    if (!hasCapturedFocusRef.current) {
      const activeElement = document.activeElement;
      const fallback = document.querySelector<HTMLElement>(".search-trigger");
      returnFocusRef.current =
        activeElement instanceof HTMLElement &&
        activeElement !== document.body
          ? activeElement
          : fallback;
      hasCapturedFocusRef.current = true;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeDialog]);

  const openResult = (entry: SearchEntry) => {
    closeDialog();
    router.push(`/posts/${entry.slug}`);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (results.length > 0) {
        setActiveIndex((current) => (current + 1) % results.length);
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (results.length > 0) {
        setActiveIndex(
          (current) => (current - 1 + results.length) % results.length,
        );
      }
    }

    if (event.key === "Home" && results.length > 0) {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End" && results.length > 0) {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    }

    if (event.key === "Enter") {
      const result = results[activeIndex];

      if (result) {
        event.preventDefault();
        openResult(result.entry);
      }
    }
  };

  const activeId =
    results[activeIndex] !== undefined
      ? `search-result-${results[activeIndex].entry.slug}`
      : undefined;

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const activeResult = document.getElementById(activeId);
    const resultsWrap = resultsWrapRef.current;

    if (!activeResult || !resultsWrap) {
      return;
    }

    const resultRect = activeResult.getBoundingClientRect();
    const wrapRect = resultsWrap.getBoundingClientRect();

    if (resultRect.top < wrapRect.top) {
      resultsWrap.scrollTop -= wrapRect.top - resultRect.top + 8;
    } else if (resultRect.bottom > wrapRect.bottom) {
      resultsWrap.scrollTop += resultRect.bottom - wrapRect.bottom + 8;
    }
  }, [activeId]);

  return createPortal(
    <div
      className="search-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      <div
        ref={panelRef}
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
      >
        <h2 id="search-dialog-title" className="sr-only">
          搜索文章
        </h2>

        <div className="search-field">
          <Search size={20} strokeWidth={1.7} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
            placeholder="搜索文章、摘要或标签"
            aria-label="搜索文章、摘要或标签"
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery("");
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
            >
              清除
            </button>
          ) : null}
          <kbd className="search-escape">Esc</kbd>
          <button
            type="button"
            className="icon-button search-close"
            onClick={closeDialog}
            aria-label="关闭搜索"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={resultsWrapRef}
          className="search-results-wrap"
          tabIndex={0}
          role="region"
          aria-label={query ? "搜索结果" : "最近更新"}
          onKeyDown={handleSearchKeyDown}
        >
          <div className="search-results-label" aria-live="polite">
            <span>{query ? "搜索结果" : "最近更新"}</span>
            {query ? <span>{results.length} 篇</span> : null}
          </div>

          {results.length > 0 ? (
            <ul
              id="global-search-results"
              role="listbox"
              aria-label={query ? "搜索结果" : "最近更新的文章"}
              className="search-results"
            >
              {results.map(({ entry }, index) => (
                <li
                  key={entry.slug}
                  id={`search-result-${entry.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="search-result"
                  data-active={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => openResult(entry)}
                >
                  <div className="search-result-main">
                    <div className="search-result-meta">
                      <span>{entry.categoryName}</span>
                      <span aria-hidden="true">/</span>
                      <time dateTime={entry.date}>
                        {formatCompactDate(entry.date)}
                      </time>
                    </div>
                    <p className="search-result-title">
                      <HighlightedText text={entry.title} query={query} />
                    </p>
                    <p className="search-result-description">
                      <HighlightedText
                        text={entry.description}
                        query={query}
                      />
                    </p>
                    <div className="search-result-tags">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight
                    className="search-result-arrow"
                    size={18}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty">
              <SearchX size={24} strokeWidth={1.5} aria-hidden="true" />
              <p>没有找到与“{query.trim()}”相关的文章。</p>
              <span>试一个更短的关键词，或者换一个标签。</span>
            </div>
          )}
        </div>

        <div className="search-footer">
          <div className="search-shortcuts" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              选择
            </span>
            <span>
              <kbd>
                <CornerDownLeft size={12} strokeWidth={1.8} />
              </kbd>
              打开
            </span>
            <span>
              <kbd>Esc</kbd>
              关闭
            </span>
          </div>
          <span className="search-footer-note">按标题、摘要与标签检索</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
