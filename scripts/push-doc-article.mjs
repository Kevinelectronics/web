#!/usr/bin/env node
// One-off: push a locally-authored markdown article (with frontmatter) into
// Strapi as a draft, reusing the same tag-upsert logic as import-medium.mjs.
import { readFile } from "node:fs/promises";

async function loadDotEnv() {
  const text = await readFile(new URL("./.env", import.meta.url), "utf-8");
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const [, key, rawValue = ""] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}
await loadDotEnv();

const filePath = process.argv[2];
const tagNames = (process.argv[3] || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!filePath) {
  console.error("Usage: node push-doc-article.mjs <path-to-md> [tag1,tag2,...]");
  process.exit(1);
}

const raw = await readFile(filePath, "utf-8");
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
if (!fmMatch) throw new Error("No frontmatter found");
const [, fmBlock, content] = fmMatch;

const fm = {};
for (const line of fmBlock.split("\n")) {
  const m = line.match(/^(\w+):\s*"(.*)"\s*$/);
  if (m) fm[m[1]] = m[2];
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const { STRAPI_URL, STRAPI_API_TOKEN, STRAPI_LOCALE } = process.env;
if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  throw new Error("STRAPI_URL / STRAPI_API_TOKEN not set");
}
const locale = STRAPI_LOCALE || "en";
const authHeaders = { Authorization: `Bearer ${STRAPI_API_TOKEN}` };

async function upsertTag(name) {
  const found = await fetch(
    `${STRAPI_URL}/api/tags?filters[name][$eq]=${encodeURIComponent(name)}`,
    { headers: authHeaders },
  );
  if (!found.ok) throw new Error(`lookup failed (HTTP ${found.status})`);
  const { data: existing } = await found.json();
  if (existing.length > 0) return existing[0].id;

  const created = await fetch(`${STRAPI_URL}/api/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ data: { name, slug: slugify(name) } }),
  });
  if (!created.ok) throw new Error(`create failed (HTTP ${created.status})`);
  const { data } = await created.json();
  return data.id;
}

const tagIds = [];
for (const name of tagNames) {
  try {
    tagIds.push(await upsertTag(name));
  } catch (err) {
    console.error(`Skipping tag "${name}": ${err.message}`);
  }
}

const res = await fetch(`${STRAPI_URL}/api/articles`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...authHeaders },
  body: JSON.stringify({
    data: {
      title: fm.title,
      slug: fm.slug || slugify(fm.title),
      excerpt: fm.excerpt || "",
      content,
      sourceUrl: fm.sourceUrl || "",
      locale,
      tags: tagIds,
    },
  }),
});

if (!res.ok) {
  const body = await res.text();
  throw new Error(`Strapi rejected the article (HTTP ${res.status}): ${body}`);
}

const { data } = await res.json();
console.log(
  `Created draft Article #${data.id} in Strapi (locale: ${locale}). Review and hit Publish at:\n${STRAPI_URL}/admin/content-manager/collection-types/api::article.article/${data.documentId}?status=draft`,
);
if (tagIds.length > 0) console.log(`Tags: ${tagNames.join(", ")}`);
