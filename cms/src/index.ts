import type { Core } from "@strapi/strapi";

/**
 * Grants the public role read-only access to published articles and tags,
 * so the Next.js site can fetch them without an API token. Runs
 * idempotently on every boot (including on Strapi Cloud after deploy),
 * so no manual click-through in the admin panel is required.
 */
async function grantPublicArticleReadAccess(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) return;

  const actions = [
    "api::article.article.find",
    "api::article.article.findOne",
    "api::tag.tag.find",
    "api::tag.tag.findOne",
    // Write-only: the public role can submit a lead, but reading, updating,
    // and deleting are not exposed by the route (see api/lead/routes) — this
    // permission alone can't be used to list or read other people's leads.
    "api::lead.lead.create",
  ];

  for (const action of actions) {
    const existing = await strapi
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.query("plugin::users-permissions.permission").create({
        data: { action, role: publicRole.id },
      });
    }
  }
}

const REVALIDATED_MODELS = ["api::article.article", "api::tag.tag"];
const WRITE_ACTIONS = [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "discardDraft",
];

/**
 * The site caches CMS responses for a day (so bot traffic doesn't keep the
 * Neon database awake). Whenever an article or tag changes, tell the site to
 * drop that cache so the change shows up on the next visit. Debounced
 * because one save in the admin fires several document actions (update +
 * publish, one per locale, ...). Skipped when REVALIDATE_SECRET is unset
 * (local dev).
 */
function registerSiteRevalidation(strapi: Core.Strapi) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return;

  const url = `${process.env.SITE_URL ?? "https://kevinmeneses.com"}/api/revalidate`;
  let timer: NodeJS.Timeout | undefined;

  const revalidateSite = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "x-revalidate-secret": secret },
        });
        if (!res.ok) strapi.log.warn(`Site revalidation failed: ${res.status}`);
      } catch (error) {
        strapi.log.warn(`Site revalidation failed: ${error}`);
      }
    }, 2000);
  };

  strapi.documents.use(async (context, next) => {
    const result = await next();
    if (
      REVALIDATED_MODELS.includes(context.uid) &&
      WRITE_ACTIONS.includes(context.action)
    ) {
      revalidateSite();
    }
    return result;
  });
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerSiteRevalidation(strapi);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicArticleReadAccess(strapi);
  },
};
