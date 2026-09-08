#!/usr/bin/env node
/**
 * Push a translated Markdown file as a new locale of an existing Strapi
 * Article document (i18n localization), instead of creating a separate
 * document. Used to keep the ES and EN versions of an article linked as
 * one document with a locale switcher in the Strapi admin.
 *
 * Usage:
 *   node push-translation.mjs <documentId> <locale> <path-to-translated.md>
 *
 * The Markdown file needs frontmatter: title, slug, excerpt, sourceUrl.
 * tags and coverImage aren't marked as localized in the Article schema, but
 * — unlike coverImage — Strapi does NOT actually carry the tags relation
 * over to a freshly-created locale automatically, so this script copies the
 * source locale's tags across explicitly to avoid a silently untagged
 * translation.
 */
import { readFile } from "node:fs/promises";

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
    // No .env file.
  }
}
await loadDotEnv();

const [, , documentId, locale, filePath, sourceLocale] = process.argv;
if (!documentId || !locale || !filePath) {
  console.error(
    "Usage: node push-translation.mjs <documentId> <locale> <path-to-translated.md> [source-locale=en]",
  );
  process.exit(1);
}

const raw = await readFile(filePath, "utf-8");
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
if (!fmMatch) throw new Error("No frontmatter found in translated file");
const [, fmBlock, content] = fmMatch;

const fm = {};
for (const line of fmBlock.split("\n")) {
  const m = line.match(/^(\w+):\s*"(.*)"\s*$/);
  if (m) fm[m[1]] = m[2];
}
for (const key of ["title", "slug"]) {
  if (!fm[key]) throw new Error(`Frontmatter is missing required "${key}"`);
}

const { STRAPI_URL, STRAPI_API_TOKEN } = process.env;
if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  throw new Error("STRAPI_URL / STRAPI_API_TOKEN not set in scripts/.env");
}
const authHeaders = { Authorization: `Bearer ${STRAPI_API_TOKEN}` };

const sourceRes = await fetch(
  `${STRAPI_URL}/api/articles/${documentId}?locale=${sourceLocale || "en"}&populate=tags&status=draft`,
  { headers: authHeaders },
);
const tagIds = sourceRes.ok
  ? (await sourceRes.json()).data?.tags?.map((t) => t.id) ?? []
  : [];

const res = await fetch(`${STRAPI_URL}/api/articles/${documentId}?locale=${locale}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", ...authHeaders },
  body: JSON.stringify({
    data: {
      title: fm.title,
      slug: fm.slug,
      excerpt: fm.excerpt || "",
      content: content.trim(),
      tags: tagIds,
      ...(fm.sourceUrl ? { sourceUrl: fm.sourceUrl } : {}),
    },
  }),
});

if (!res.ok) {
  const body = await res.text();
  throw new Error(`Strapi rejected the localization (HTTP ${res.status}): ${body}`);
}

const { data } = await res.json();
console.log(
  `Pushed locale "${locale}" for Article documentId ${documentId}. Review and hit Publish at:\n${STRAPI_URL}/admin/content-manager/collection-types/api::article.article/${data.documentId}?status=draft&plugins[i18n][locale]=${locale}`,
);
