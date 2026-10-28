import type { Metadata } from "next";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import { contactEmail } from "@/content/site";

type Params = Promise<{ locale: string }>;

type Section = { heading: string; body: ReactNode[] };
type Copy = { title: string; description: string; updated: string; sections: Section[] };

const externalLink = (href: string, label = href) => (
  <a href={href} className="text-accent underline-offset-4 hover:underline" rel="noopener noreferrer">
    {label}
  </a>
);

const mail = <a href={`mailto:${contactEmail}`} className="text-accent underline-offset-4 hover:underline">{contactEmail}</a>;

// Legal copy lives here rather than in messages/*.json: it's long-form,
// rarely edited, and has inline links that don't fit the flat message shape.
const copy: Record<"es" | "en", Copy> = {
  es: {
    title: "Política de privacidad",
    description: "Qué datos recoge kevinmeneses.com y la app PythonIA Automation, para qué y cómo eliminarlos.",
    updated: "Última actualización: 28 de octubre de 2026",
    sections: [
      {
        heading: "Responsable",
        body: [<>Kevin Meneses González. Contacto: {mail}.</>],
      },
      {
        heading: "Formulario de contacto",
        body: [
          "Si me escribes desde el formulario, guardo tu nombre, empresa, email, tipo de proyecto, presupuesto y mensaje. Los uso solo para responderte y, si trabajamos juntos, para gestionar el proyecto. No los vendo ni los cedo a terceros.",
          "Se almacenan en mi CMS (Strapi, alojado en Render, con base de datos en Neon) hasta que me pidas borrarlos.",
        ],
      },
      {
        heading: "Analítica",
        body: [
          <>Uso Google Analytics 4 para medir visitas de forma agregada (páginas vistas, país, dispositivo). Google Analytics usa cookies; más información en la {externalLink("https://policies.google.com/privacy?hl=es", "política de privacidad de Google")}.</>,
          "La web está alojada en Vercel, que registra datos técnicos de las peticiones (IP, navegador) por seguridad y rendimiento.",
        ],
      },
      {
        heading: "App «PythonIA Automation» (APIs de Google y YouTube)",
        body: [
          "PythonIA Automation es una herramienta interna que uso para gestionar mi propio canal de YouTube (PythonIA). No está disponible para el público ni recoge datos de otros usuarios.",
          "Con mi autorización, accede mediante las APIs de YouTube Data, YouTube Analytics y YouTube Reporting a los datos de los canales que yo administro: metadatos de vídeos (títulos, descripciones, etiquetas, miniaturas), estadísticas y analítica del canal. La usa para leer esas métricas y actualizar títulos, descripciones, miniaturas y listas de reproducción de mis propios vídeos.",
          "Los tokens de acceso y los datos descargados se guardan solo en mi ordenador. No se comparten, no se venden, no se usan para publicidad ni para entrenar modelos de IA, y no se transfieren a terceros.",
          <>El uso de la información recibida de las APIs de Google cumple la {externalLink("https://developers.google.com/terms/api-services-user-data-policy", "Política de Datos de Usuario de los Servicios de API de Google")}, incluidos los requisitos de Uso Limitado.</>,
          <>Al usar esta app se aplican también los {externalLink("https://www.youtube.com/t/terms", "Términos del Servicio de YouTube")} y la {externalLink("https://policies.google.com/privacy", "Política de Privacidad de Google")}. Puedes revocar el acceso en cualquier momento desde {externalLink("https://myaccount.google.com/permissions", "myaccount.google.com/permissions")}.</>,
        ],
      },
      {
        heading: "Tus derechos",
        body: [<>Puedes pedir acceso, rectificación o supresión de tus datos escribiendo a {mail}. Respondo en un plazo máximo de 30 días.</>],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    description: "What data kevinmeneses.com and the PythonIA Automation app collect, why, and how to delete it.",
    updated: "Last updated: October 28, 2026",
    sections: [
      {
        heading: "Controller",
        body: [<>Kevin Meneses González. Contact: {mail}.</>],
      },
      {
        heading: "Contact form",
        body: [
          "If you write to me through the contact form, I store your name, company, email, project type, budget and message. I only use them to reply and, if we work together, to manage the project. I don't sell or share them with third parties.",
          "They are stored in my CMS (Strapi, hosted on Render, database on Neon) until you ask me to delete them.",
        ],
      },
      {
        heading: "Analytics",
        body: [
          <>I use Google Analytics 4 to measure visits in aggregate (page views, country, device). Google Analytics uses cookies; see {externalLink("https://policies.google.com/privacy", "Google's privacy policy")}.</>,
          "The site is hosted on Vercel, which logs technical request data (IP, browser) for security and performance.",
        ],
      },
      {
        heading: "“PythonIA Automation” app (Google and YouTube APIs)",
        body: [
          "PythonIA Automation is an internal tool I use to manage my own YouTube channel (PythonIA). It is not available to the public and does not collect data from other users.",
          "With my authorization, it uses the YouTube Data, YouTube Analytics and YouTube Reporting APIs to access data from channels I manage: video metadata (titles, descriptions, tags, thumbnails), statistics and channel analytics. It reads those metrics and updates titles, descriptions, thumbnails and playlists of my own videos.",
          "Access tokens and downloaded data are stored only on my computer. They are not shared, sold, used for advertising or to train AI models, or transferred to third parties.",
          <>Use of information received from Google APIs adheres to the {externalLink("https://developers.google.com/terms/api-services-user-data-policy", "Google API Services User Data Policy")}, including the Limited Use requirements.</>,
          <>Using this app is also subject to the {externalLink("https://www.youtube.com/t/terms", "YouTube Terms of Service")} and the {externalLink("https://policies.google.com/privacy", "Google Privacy Policy")}. You can revoke access at any time at {externalLink("https://myaccount.google.com/permissions", "myaccount.google.com/permissions")}.</>,
        ],
      },
      {
        heading: "Your rights",
        body: [<>You can request access to, correction or deletion of your data by writing to {mail}. I reply within 30 days.</>],
      },
    ],
  },
};

function copyFor(locale: string) {
  return copy[locale === "en" ? "en" : "es"];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const c = copyFor(locale);
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { es: "/es/privacy", en: "/en/privacy", "x-default": "/es/privacy" },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Params }) {
  const { locale } = await params;
  const c = copyFor(locale);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">{c.title}</h1>
        <p className="mt-2 text-sm text-ink-soft">{c.updated}</p>

        {c.sections.map((section) => (
          <div key={section.heading} className="mt-10">
            <h2 className="font-display text-lg font-medium text-ink">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </Container>
    </section>
  );
}
