#!/usr/bin/env node
/**
 * One-time Medium -> Markdown importer.
 *
 * Fetches a public Medium article (or reads a locally saved HTML copy, useful
 * when Medium blocks the fetch) and converts it to a Markdown file with
 * frontmatter, ready to copy/paste into the Strapi admin (Article content
 * type: title, slug, excerpt, content, sourceUrl).
 *
 * Usage:
 *   node import-medium.mjs https://medium.com/@you/your-post-slug-abc123
 *   node import-medium.mjs ./saved-medium-page.html https://medium.com/@you/original-url
 *
 * Output: ./imports/<slug>.md
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

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
  console.log(
    "Review/edit the file, then copy title / slug / excerpt / content / sourceUrl into the Strapi admin (Content Manager -> Article -> Create new entry).",
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
