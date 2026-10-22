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

// Affiliate/referral links in articles: tracking params the partners use
// (EODHD ?via=&ref1=, ZenRows ?fpr=, …) or dedicated affiliate hosts.
const AFFILIATE_PARAMS = ["via", "ref", "ref1", "fpr", "aff", "affiliate", "referral", "ref_id"];
const AFFILIATE_HOSTS: Record<string, string> = {
  "zernio.link": "zernio",
  "try.elevenlabs.io": "elevenlabs",
};

function partnerName(hostname: string) {
  const host = hostname.replace(/^www\./, "");
  if (AFFILIATE_HOSTS[host]) return AFFILIATE_HOSTS[host];
  // "docs.eodhd.com" → "eodhd", "snowball-analytics.com" → "snowball-analytics"
  const parts = host.split(".");
  return parts.length >= 2 ? parts[parts.length - 2] : host;
}

/**
 * One delegated click listener for the clicks GA4's enhanced measurement
 * doesn't name for us: email links, "contact" CTAs (every link to #contact,
 * with the content package when it's a package button), Kevin's social
 * profiles, affiliate/partner links, and which FAQ questions get opened.
 */
export default function ClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;

      // FAQ: <summary> of a <details class="faq-item">. Capture phase runs
      // before the toggle, so `open` is still the pre-click state.
      const summary = target?.closest?.("details.faq-item > summary");
      if (summary) {
        const details = summary.parentElement as HTMLDetailsElement;
        if (!details.open) {
          trackEvent("faq_open", { question: (summary.textContent ?? "").trim().slice(0, 100) });
        }
        return;
      }

      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const text = (anchor.textContent ?? "").trim().slice(0, 80);

      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { link_text: text });
        return;
      }

      if (href.endsWith("#contact")) {
        trackEvent("cta_click", {
          cta_text: text,
          cta_target: "contact",
          package_name: anchor.dataset.package,
        });
        return;
      }

      const network = PROFILES.get(normalize(href));
      if (network) {
        trackEvent("social_click", { social_network: network });
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.hostname === window.location.hostname || !url.protocol.startsWith("http")) return;

      const host = url.hostname.replace(/^www\./, "");
      const isAffiliate =
        Boolean(AFFILIATE_HOSTS[host]) || AFFILIATE_PARAMS.some((p) => url.searchParams.has(p));
      // Links Kevin tagged with his own UTMs point at partners/clients too.
      const isPartner = isAffiliate || url.searchParams.has("utm_source");
      if (isPartner) {
        trackEvent("affiliate_click", {
          partner: partnerName(url.hostname),
          link_type: isAffiliate ? "affiliate" : "partner",
          link_text: text,
        });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
