import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::article.article", {
  config: {
    find: {
      policies: ["global::block-public-drafts"],
    },
    findOne: {
      policies: ["global::block-public-drafts"],
    },
  },
});
