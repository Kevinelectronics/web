// Thin wrapper over the gtag snippet rendered in the root layout (production
// only). Safe to call anywhere on the client: it no-ops when gtag isn't
// loaded (dev, ad blockers, or the visitor opted out with ?notrack=1).

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
  }
}

export function trackEvent(eventName: string, params: GtagParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    ...params,
  });
}
