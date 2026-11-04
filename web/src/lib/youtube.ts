/** Video ID from a youtu.be/<id>, youtube.com/watch?v=<id>, /shorts/<id> or /embed/<id> URL, or null. */
export function youtubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m)\./, "");
  const id =
    host === "youtu.be"
      ? parsed.pathname.slice(1)
      : host === "youtube.com"
        ? parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1]
        : null;
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}
