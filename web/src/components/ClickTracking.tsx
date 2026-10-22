"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { socials } from "@/content/site";

// Kevin's own profile URLs → network name (not every link to these sites,
// e.g. a Medium article linked from a blog post isn't a profile visit).
const normalize = (url: string) =>
  url.split("?")[0].replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "").toLowerCase();
const PROFILES = new Map(
  Object.entries(socials).map(([network, url]) => [normalize(url), network]),
);

/**
 * One delegated click listener for the conversion-ish clicks GA4's enhanced
 * measurement doesn't name for us: email links, "contact" CTAs (every link to
 * #contact) and visits to Kevin's social profiles.
 */
export default function ClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const text = (anchor.textContent ?? "").trim().slice(0, 80);

      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { link_text: text });
      } else if (href.endsWith("#contact")) {
        trackEvent("cta_click", { cta_text: text, cta_target: "contact" });
      } else {
        const network = PROFILES.get(normalize(href));
        if (network) trackEvent("social_click", { social_network: network });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
