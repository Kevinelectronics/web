type LeadLifecycleEvent = {
  result: {
    documentId: string;
    name: string;
    company?: string;
    email: string;
    projectType?: string;
    budget?: string;
    message: string;
  };
};

export default {
  async afterCreate(event: LeadLifecycleEvent) {
    const { result } = event;
    const adminUrl =
      process.env.RENDER_EXTERNAL_URL || 'https://kevin-personal-website-cms.onrender.com';
    const editLink = `${adminUrl}/admin/content-manager/collection-types/api::lead.lead/${result.documentId}`;

    // Fire-and-forget: don't await this. The submitter is waiting on this
    // request to complete, and a slow/hanging SMTP connection would hang
    // their form submission along with it — the email arriving a few
    // seconds late (or, on failure, in the server log instead) is fine,
    // but a stuck "Sending..." button on the site is not.
    strapi
      .plugin('email')
      .service('email')
      .send({
        to: 'kevinmenesesgonzalez@gmail.com',
        subject: `New lead: ${result.name}${result.company ? ` (${result.company})` : ''}`,
        text: `New contact form submission on kevinmeneses.com.

Name: ${result.name}
Company: ${result.company || '—'}
Email: ${result.email}
Project type: ${result.projectType || '—'}
Budget: ${result.budget || '—'}

Message:
${result.message}

View in Strapi: ${editLink}`,
      })
      .catch((err: unknown) => {
        strapi.log.error('Failed to send lead notification email', err);
      });
  },
};
