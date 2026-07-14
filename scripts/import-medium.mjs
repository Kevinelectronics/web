#!/usr/bin/env node
/**
 * Medium -> Strapi importer.
 *
 * Fetches a public Medium article (or reads a locally saved HTML copy, useful
 * when Medium blocks the fetch), converts it to Markdown, saves a local copy
 * under ./imports/, and — when STRAPI_URL + STRAPI_API_TOKEN are set — creates
 * it as a draft Article in Strapi so it just needs a review + Publish click.
 *
 * Usage:
 *   node import-medium.mjs https://medium.com/@you/your-post-slug-abc123
 *   node import-medium.mjs ./saved-medium-page.html https://medium.com/@you/original-url
 *
 * Also pulls Medium's own topic tags (e.g. "Langchain", "AI Agent") and the
 * post's cover image, creating/reusing matching Tag entries and uploading
 * the image as the Article's coverImage.
 *
 * Env (optional, in scripts/.env — see .env.example):
 *   STRAPI_URL         e.g. https://your-cms.onrender.com
 *   STRAPI_API_TOKEN   API token with Article/Tag create/find/update permissions
 *   STRAPI_LOCALE      defaults to "en"
 *
 * Output: ./imports/<slug>.md (always) + a draft Article in Strapi (if configured)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

async function loadDotEnv() {
  try {
    const text = await readFile(new URL("./.env", import.meta.url), "utf-8");
    for (const line of text.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const [, key, rawValue = ""] = match;
      if (process.env[key] === undefined) {
        process.env[key] = rawValue.replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // No .env file — fine, Strapi push is optional.
  }
}
await loadDotEnv();

const [, , input, secondArg] = process.argv;

if (!input) {
  console.error(
    "Usage: node import-medium.mjs <medium-url-or-local-html-file> [source-url-if-local]",
  );
  process.exit(1);
}

const isUrl = input.startsWith("http");
const sourceUrl = isUrl ? input : (secondArg ?? "");

async function loadHtml() {
  if (isUrl) {
    const res = await fetch(input, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      throw new Error(
        `Fetch failed with status ${res.status}. Medium may be blocking automated requests — save the page as HTML from your browser (Ctrl/Cmd+S) and re-run with the local file path instead.`,
      );
    }
    return res.text();
  }
  return readFile(input, "utf-8");
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Medium's images live in <figure>; keep figcaptions as italic captions.
turndown.addRule("mediumFigure", {
  filter: "figure",
  replacement: (content, node) => {
    const img = node.querySelector("img");
    const figcaption = node.querySelector("figcaption");
    if (!img) return content;
    const src = img.getAttribute("src") || "";
    const alt = img.getAttribute("alt") || "";
    const caption = figcaption ? figcaption.textContent.trim() : "";
    return `\n\n![${alt}](${src})${caption ? `\n*${caption}*` : ""}\n\n`;
  },
});

// Medium doesn't nest a <code> element inside <pre> — it's a <span> with
// <br> tags for line breaks — so Turndown's default fenced-code-block rule
// (which only fires for pre > code) never matches and the code gets escaped
// as plain prose instead. Handle <pre> directly and rebuild real newlines.
turndown.addRule("mediumCodeBlock", {
  filter: "pre",
  replacement: (_content, node) => {
    const text = (node.innerHTML || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
    return `\n\n\`\`\`\n${text.trim()}\n\`\`\`\n\n`;
  },
});

async function main() {
  const html = await loadHtml();
  const $ = cheerio.load(html);

  const title =
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("h1").first().text().trim() ||
    "Untitled";

  const excerpt =
    $("meta[property='og:description']").attr("content")?.trim() || "";

  const coverImageUrl = $("meta[property='og:image']").attr("content")?.trim();

  // Medium's topic tags render either inside or outside <article> depending
  // on the page's DOM shape (varies between requests) — search the whole
  // document so they're picked up either way.
  const topics = [
    ...new Set(
      $('[aria-label^="Topic:"]')
        .map((_, el) => $(el).attr("aria-label").replace(/^Topic:\s*/, "").trim())
        .get()
        .filter(Boolean),
    ),
  ];

  const article = $("article").first();
  if (article.length === 0) {
    throw new Error(
      "Could not find an <article> element — this doesn't look like a Medium post page.",
    );
  }

  // Medium's class names are hashed/unstable, but it keeps a handful of
  // data-testid markers on the chrome around the actual post body (title,
  // avatar, byline, read time, clap/bookmark/audio/share buttons). The whole
  // header block lives in storyTitle's parent — drop it in one shot instead
  // of the title alone, otherwise the byline/actions leak into the body.
  const storyTitle = article.find('[data-testid="storyTitle"]').first();
  if (storyTitle.length > 0) {
    storyTitle.parent().remove();
  } else {
    article.find("h1").first().remove();
  }
  article.find('[data-testid="og"]').remove();

  // Topic tags ("Langchain", "AI Agent", ...) and sign-in prompts for
  // claps/bookmarks/highlights sometimes render inside <article> too.
  article.find('[aria-label^="Topic:"]').remove();
  article.find('a[href^="/m/signin"]').remove();

  // The "Press enter or click to view image in full size" a11y caption
  // Medium injects next to every zoomable image.
  article
    .find("span")
    .filter(
      (_, el) => $(el).text().trim() === "Press enter or click to view image in full size",
    )
    .remove();

  const bodyHtml = article.html() ?? "";
  let markdown = turndown.turndown(bodyHtml).trim();

  // Medium sprinkles non-breaking spaces (U+00A0) through its text nodes —
  // invisible in a diff/preview, but they defeat plain-space text matching
  // (and look identical to normal spaces if they ever cause odd wrapping).
  markdown = markdown.replace(/ /g, " ");

  // Medium sometimes injects a "subscribe to this author" interstitial
  // mid-article. Its DOM shape is as unstable as the topic tags (doesn't
  // show up on every fetch of the same URL), so selector-based removal
  // can't reliably catch it — strip it from the rendered markdown instead,
  // matching on its fixed wording regardless of author name.
  markdown = markdown.replace(
    /## Get [^\n]+['’]s stories in your inbox\s*\n+Join Medium for free to get updates from this writer\.\s*\n+Subscribe\s*\n+Subscribe\s*\n+Remember me for faster sign in\s*\n*/g,
    "",
  );

  // Collapse the extra blank lines left behind by removed elements, without
  // touching content inside fenced code blocks (blank-line meaning differs
  // there — e.g. a lone "--" could be real SQL, not leftover chrome).
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  const slug = slugify(title);
  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `sourceUrl: "${sourceUrl}"`,
    "---",
    "",
  ].join("\n");

  await mkdir("./imports", { recursive: true });
  const outPath = `./imports/${slug}.md`;
  await writeFile(outPath, frontmatter + markdown, "utf-8");
  console.log(`Saved ${outPath}`);

  const { STRAPI_URL, STRAPI_API_TOKEN, STRAPI_LOCALE } = process.env;
  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    console.log(
      "STRAPI_URL / STRAPI_API_TOKEN not set — skipping Strapi push. Copy the file above into the admin manually, or set those env vars to automate this.",
    );
    return;
  }

  const locale = STRAPI_LOCALE || "en";
  const authHeaders = { Authorization: `Bearer ${STRAPI_API_TOKEN}` };

  const tagIds = [];
  for (const name of topics) {
    try {
      tagIds.push(await upsertTag(STRAPI_URL, authHeaders, name));
    } catch (err) {
      console.error(`Skipping tag "${name}": ${err.message}`);
    }
  }

  let coverImageId;
  if (coverImageUrl) {
    try {
      coverImageId = await uploadCoverImage(
        STRAPI_URL,
        authHeaders,
        coverImageUrl,
        slug,
      );
    } catch (err) {
      console.error(`Skipping cover image: ${err.message}`);
    }
  }

  const res = await fetch(`${STRAPI_URL}/api/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({
      data: {
        title,
        slug,
        excerpt,
        content: markdown,
        sourceUrl,
        locale,
        tags: tagIds,
        ...(coverImageId ? { coverImage: coverImageId } : {}),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Strapi rejected the article (HTTP ${res.status}): ${body}`,
    );
  }

  const { data } = await res.json();
  console.log(
    `Created draft Article #${data.id} in Strapi (locale: ${locale}). Review and hit Publish at:\n${STRAPI_URL}/admin/content-manager/collection-types/api::article.article/${data.documentId}?status=draft`,
  );
  if (tagIds.length > 0) {
    console.log(`Tags: ${topics.join(", ")}`);
  }
}

async function upsertTag(strapiUrl, authHeaders, name) {
  const found = await fetch(
    `${strapiUrl}/api/tags?filters[name][$eq]=${encodeURIComponent(name)}`,
    { headers: authHeaders },
  );
  if (!found.ok) {
    throw new Error(`lookup failed (HTTP ${found.status})`);
  }
  const { data: existing } = await found.json();
  if (existing.length > 0) return existing[0].id;

  // The `uid` field only auto-generates from targetField in the admin UI —
  // the content API needs it passed explicitly.
  const created = await fetch(`${strapiUrl}/api/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ data: { name, slug: slugify(name) } }),
  });
  if (!created.ok) {
    throw new Error(`create failed (HTTP ${created.status})`);
  }
  const { data } = await created.json();
  return data.id;
}

async function uploadCoverImage(strapiUrl, authHeaders, imageUrl, slug) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`fetch failed (HTTP ${imageRes.status})`);
  }
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const ext = contentType.split("/")[1]?.split("+")[0] || "jpg";
  const blob = await imageRes.blob();

  const form = new FormData();
  form.append("files", blob, `${slug}-cover.${ext}`);

  const uploadRes = await fetch(`${strapiUrl}/api/upload`, {
    method: "POST",
    headers: authHeaders,
    body: form,
  });
  if (!uploadRes.ok) {
    throw new Error(`upload failed (HTTP ${uploadRes.status})`);
  }
  const [uploaded] = await uploadRes.json();
  return uploaded.id;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
