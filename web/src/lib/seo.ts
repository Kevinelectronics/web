const MIN_DESCRIPTION_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 160;

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1).trimEnd()}…`;
}

// Google treats anything outside ~70-160 chars as a weak search snippet.
// Some CMS excerpts are placeholder-short (e.g. "TL;DR") and some run long —
// this pads short ones with the start of the article body and trims long
// ones at a word boundary, so every page gets a usable meta description
// without editing the excerpt field in Strapi.
export function buildMetaDescription(
  excerpt: string | undefined,
  content: string,
): string {
  const base = excerpt?.trim() ?? "";

  if (base.length > MAX_DESCRIPTION_LENGTH) {
    return truncate(base, MAX_DESCRIPTION_LENGTH);
  }
  if (base.length >= MIN_DESCRIPTION_LENGTH) {
    return base;
  }

  // The excerpt is often just the article's opening line, so strip that
  // prefix from the body before using it as filler — otherwise the
  // description repeats the same sentence twice.
  const plainContent = stripMarkdown(content);
  const remainder = plainContent.startsWith(base)
    ? plainContent.slice(base.length).trim()
    : plainContent;
  const filler = remainder.slice(0, MAX_DESCRIPTION_LENGTH - base.length);
  const combined = base ? `${base} ${filler}` : plainContent;
  return truncate(combined, MAX_DESCRIPTION_LENGTH);
}
