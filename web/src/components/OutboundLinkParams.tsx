"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Referral/affiliate links (Massive, EODHD, etc.) lose any UTM/campaign
// params a visitor arrived with, since the article body is static markdown
// with hardcoded hrefs. Forward the current page's query string onto every
// outbound link so click-throughs keep that attribution.
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

      const isOutbound = url.hostname !== window.location.hostname;
      const isHttp = url.protocol === "http:" || url.protocol === "https:";
      if (!isOutbound || !isHttp) return;

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
