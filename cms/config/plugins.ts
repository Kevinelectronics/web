import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  email: {
    config: {
      // Strapi's default "sendmail" provider needs a local sendmail binary
      // that doesn't exist on Render — use Resend's SMTP relay instead.
      // Resend's shared sandbox address (no domain verification needed) can
      // only deliver to the account's own signup address, which is exactly
      // the lead-notification target, so that's fine for this use case.
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: env('RESEND_API_KEY'),
        },
      },
      settings: {
        defaultFrom: 'onboarding@resend.dev',
        defaultReplyTo: 'onboarding@resend.dev',
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
      // Render's free web services have no persistent disk — anything
      // written to the local filesystem (the default upload provider)
      // disappears on the next deploy. Cloudinary keeps uploads outside
      // the app server entirely. Falls back to local storage (fine for
      // local dev, where the filesystem does persist) when unset.
      ...(env('CLOUDINARY_NAME')
        ? {
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
          }
        : {}),
    },
  },
});

export default config;
