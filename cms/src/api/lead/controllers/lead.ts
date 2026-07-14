import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::lead.lead", ({ strapi }) => ({
  async create(ctx) {
    // Simple honeypot: the form includes a field named "website" that's
    // hidden from real visitors via CSS. Bots that fill every input tip
    // themselves off — pretend success without writing anything.
    const honeypot = ctx.request.body?.data?.website;
    if (honeypot) {
      ctx.body = { data: null };
      return;
    }

    delete ctx.request.body?.data?.website;
    const response = await super.create(ctx);
    return response;
  },
}));
