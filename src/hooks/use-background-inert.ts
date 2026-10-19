"use client";

import { useEffect } from "react";

/**
 * Keeps the page behind an open dialog out of the tab order and the
 * accessibility tree. `aria-modal` alone does not hide background content
 * from screen-reader virtual cursors.
 */
export function useBackgroundInert(active = true) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, .site-header, .site-footer, .skip-link",
      ),
    );
    const hadInert = targets.map((element) => element.hasAttribute("inert"));

    targets.forEach((element) => {
      element.setAttribute("inert", "");
    });

    return () => {
      targets.forEach((element, index) => {
        if (!hadInert[index]) {
          element.removeAttribute("inert");
        }
      });
    };
  }, [active]);
}
