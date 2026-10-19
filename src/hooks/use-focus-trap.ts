"use client";

import { useEffect, type RefObject } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter(
        (element) =>
          !element.hasAttribute("hidden") &&
          element.getAttribute("aria-hidden") !== "true",
      );

      const first = focusableElements[0];
      const last = focusableElements.at(-1);

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || !container.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === last || !container.contains(activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, containerRef]);
}
