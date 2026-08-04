"use client";

import { useEffect, useRef, type ReactNode } from "react";

const TARGET_HOSTNAMES = new Set(["massive.com", "www.massive.com"]);

// Massive (a referral partner) needs their attribution params forwarded
// on click-throughs from the article body. Only touch links to their
// domain — other outbound links (LinkedIn, GitHub, etc.) don't need
// tracking params appended.
export default function OutboundLinkParams({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const incomingParams = new URLSearchParams(window.location.search);
    if ([...incomingParams].length === 0) return;

    const container = ref.current;
    if (!container) return;

    container.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (!TARGET_HOSTNAMES.has(url.hostname)) return;

      incomingParams.forEach((value, key) => {
        if (!url.searchParams.has(key)) {
          url.searchParams.append(key, value);
        }
      });
      anchor.setAttribute("href", url.toString());
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
