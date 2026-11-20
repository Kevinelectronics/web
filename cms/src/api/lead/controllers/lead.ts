import { factories } from "@strapi/strapi";

// In-memory rate limit. The CMS runs as a single Render instance, so a
// process-local map is enough; it resets on deploy, which is fine.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5; // per IP per window
const MAX_GLOBAL = 40; // across everyone per window — caps the email quota
const hitsByIp = new Map<string, number[]>();
let globalHits: number[] = [];

function clientIp(ctx: { request: { ip: string; headers: Record<string, string | string[] | undefined> } }) {
  // Render sits behind Cloudflare, which overwrites cf-connecting-ip with
  // the real client address (a client-supplied value doesn't survive).
  const cf = ctx.request.headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf;
  const xff = ctx.request.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff) return xff.split(",")[0].trim();
  return ctx.request.ip;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hitsByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  globalHits = globalHits.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_IP || globalHits.length >= MAX_GLOBAL) {
    hitsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  globalHits.push(now);
  hitsByIp.set(ip, recent);
  // Keep the map from growing without bound.
  if (hitsByIp.size > 5000) {
    for (const [key, times] of hitsByIp) {
      if (!times.some((t) => now - t < WINDOW_MS)) hitsByIp.delete(key);
    }
  }
  return false;
}

export default factories.createCoreController("api::lead.lead", ({ strapi }) => ({
  async create(ctx) {
    // Simple honeypot: the form includes a field named "website" that's
    // hidden from real visitors via CSS. Bots that fill every input tip
    // themselves off — pretend success without writing anything.
    const honeypot = ctx.request.body?.data?.website;
    if (honeypot) {
      ctx.body = { data: null };
      return;
    }

    const ip = clientIp(ctx);
    if (isRateLimited(ip)) {
      strapi.log.warn(`Lead rate limit hit from ${ip}`);
      return ctx.tooManyRequests("Too many submissions. Please try again later.");
    }

    delete ctx.request.body?.data?.website;
    const response = await super.create(ctx);
    return response;
  },
}));
