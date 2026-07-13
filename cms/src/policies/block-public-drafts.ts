import type { Core } from "@strapi/strapi";

/**
 * Strapi's REST API honors `?status=draft` for any role with find/findOne
 * permission, regardless of publication state — so the public role (which
 * only needs read access to published content) can otherwise be used to
 * read unpublished drafts by anyone who knows the query param. Block that
 * for unauthenticated / public-role requests; API tokens and admin users
 * (used by the content review tooling) are unaffected.
 */
const policy: Core.Policy = (policyContext, _config, { strapi }) => {
  // Strapi's PolicyContext type doesn't declare `request`/`state` (they're
  // only present on the runtime Koa context), hence the cast.
  const ctx = policyContext as unknown as {
    request: { query?: { status?: string }; ip?: string };
    state?: { auth?: { strategy?: { name?: string } } };
  };

  if (ctx.request.query?.status !== "draft") {
    return true;
  }

  // Real Strapi API tokens authenticate with the "content-api-token"
  // strategy (not "api-token" — that name belongs to a different, internal
  // auth layer). Admin JWTs aren't valid credentials on /api/* at all.
  if (ctx.state?.auth?.strategy?.name === "content-api-token") {
    return true;
  }

  strapi.log.warn(
    `Blocked anonymous request for draft content from ${ctx.request.ip}`,
  );
  return false;
};

export default policy;
