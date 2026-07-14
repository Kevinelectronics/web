import { factories } from "@strapi/strapi";

// Only expose "create" — leads are write-only from the public API. Reading,
// listing, updating, or deleting them happens exclusively through the admin
// panel, never through the content API, even for authenticated tokens.
export default factories.createCoreRouter("api::lead.lead", {
  only: ["create"],
});
