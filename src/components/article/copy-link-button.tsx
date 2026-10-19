"use client";

import { Check, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { copyText } from "@/lib/clipboard";

type CopyStatus = "idle" | "copied" | "error";

export function CopyLinkButton() {
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    try {
      await copyText(`${window.location.origin}${pathname}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, 2200);
  };

  return (
    <>
      <button
        type="button"
        className="copy-link-button"
        onClick={handleCopy}
        data-status={status}
        title="复制文章链接"
      >
        {status === "copied" ? (
          <Check size={15} strokeWidth={1.9} aria-hidden="true" />
        ) : (
          <Copy size={15} strokeWidth={1.7} aria-hidden="true" />
        )}
        <span>
          {status === "copied"
            ? "链接已复制"
            : status === "error"
              ? "复制失败"
              : "复制链接"}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied"
          ? "文章链接已复制到剪贴板"
          : status === "error"
            ? "未能复制文章链接"
            : ""}
      </span>
    </>
  );
}
