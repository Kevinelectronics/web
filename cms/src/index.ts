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

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicArticleReadAccess(strapi);
  },
};
