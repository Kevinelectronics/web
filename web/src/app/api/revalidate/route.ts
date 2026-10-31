import { revalidateTag } from "next/cache";
import { STRAPI_CACHE_TAG } from "@/lib/strapi";

// Called by the CMS whenever an article or tag changes, so content can be
// cached for a day without new posts waiting that long to show up.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  // { expire: 0 } expires the cache immediately instead of serving stale
  // content once more — the next visit gets the freshly published article.
  revalidateTag(STRAPI_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
