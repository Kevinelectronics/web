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
 * Env (optional, in scripts/.env — see .env.example):
 *   STRAPI_URL         e.g. https://your-cms.onrender.com
 *   STRAPI_API_TOKEN   API token with Article create/find/update permissions
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

// Medium wraps code blocks in <pre><code> already, and images in <figure>;
// make sure figcaptions survive as italic captions under the image.
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

async function main() {
  const html = await loadHtml();
  const $ = cheerio.load(html);

  const title =
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("h1").first().text().trim() ||
    "Untitled";

  const excerpt =
    $("meta[property='og:description']").attr("content")?.trim() || "";

  const article = $("article").first();
  if (article.length === 0) {
    throw new Error(
      "Could not find an <article> element — this doesn't look like a Medium post page.",
    );
  }

  // Drop the title (already extracted) so it isn't duplicated in the body.
  article.find("h1").first().remove();

  const bodyHtml = article.html() ?? "";
  const markdown = turndown.turndown(bodyHtml).trim();

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
  const res = await fetch(`${STRAPI_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({
      data: { title, slug, excerpt, content: markdown, sourceUrl, locale },
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
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
