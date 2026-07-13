# Sitio personal

Sitio personal bilingüe (ES/EN) con sección de servicios (content writer / technical
writer), logos de empresas, banner de redes sociales y un blog de artículos gestionado
desde Strapi (CMS headless), con importación puntual de artículos desde Medium.

## Estructura del repositorio

```
personal-website/
├── web/       # Frontend: Next.js 16 (App Router) + Tailwind v4 + next-intl
├── cms/       # Backend: Strapi 5 (TypeScript) — content type "Article"
└── scripts/   # Utilidad de importación Medium -> Markdown
```

- **web** se despliega en **Vercel**.
- **cms** se despliega en **Strapi Cloud**.
- Son dos despliegues independientes que se comunican vía la API REST de Strapi.

## 1. Requisitos

- Node.js 20.9+ (usa la misma versión en local que en producción)
- Cuentas: [Vercel](https://vercel.com), [Strapi Cloud](https://cloud.strapi.io), GitHub

## 2. Desarrollo local

### 2.1 Backend (Strapi)

```bash
cd cms
npm install
npm run develop
```

- Abre http://localhost:1337/admin y crea tu usuario administrador (solo la primera vez).
- Los permisos públicos de lectura sobre `Article` (`find` / `findOne`) se configuran
  **automáticamente** al arrancar (ver `cms/src/index.ts`), así que no hace falta
  activar nada a mano en *Settings → Roles → Public*.
- El locale español (`es`) se añade a mano una única vez: *Settings → Internationalization
  → Add locale* (código `es`). El inglés (`en`) ya viene por defecto.
- Por defecto usa SQLite (`cms/.env`, `DATABASE_CLIENT=sqlite`) — no necesitas instalar
  nada más para desarrollar en local. Strapi Cloud gestiona Postgres en producción.

### 2.2 Frontend (Next.js)

```bash
cd web
npm install
cp .env.example .env.local   # ya apunta a http://localhost:1337
npm run dev
```

Abre http://localhost:3000 (redirige automáticamente a `/es`).

## 3. Personalizar el contenido

Todo el contenido de marcador de posición está centralizado en dos sitios, para que no
tengas que tocar componentes:

| Qué | Dónde |
|---|---|
| Nombre, rol, bio, textos de servicios, textos de UI | `web/messages/es.json` y `web/messages/en.json` |
| Redes sociales (LinkedIn, Medium, YouTube, GitHub), email de contacto, empresas/logos | `web/src/content/site.ts` |
| Logos de empresas como imagen (opcional) | coloca el archivo en `web/public/logos/` y referencia `logoUrl: "/logos/acme.svg"` en `site.ts` |

Los artículos del blog se gestionan **desde el panel de Strapi** (`/admin` → Content
Manager → Article), no desde archivos del repo.

## 4. Añadir un artículo nuevo

1. Entra a Strapi admin → Content Manager → Article → **Create new entry**.
2. Rellena `title`, `slug` (se autogenera desde el título), `excerpt`, `content`
   (Markdown) y opcionalmente `coverImage`.
3. Arriba a la derecha, cambia el selector de locale para escribir la versión en el
   otro idioma (o deja solo un idioma si aún no tienes la traducción).
4. Pulsa **Publish**. El artículo aparece en el sitio en <60s (revalidación ISR).

## 5. Importar un artículo de Medium (pasando una URL)

```bash
cd scripts
npm install
cp .env.example .env   # rellena STRAPI_URL y STRAPI_API_TOKEN (opcional, ver abajo)
node import-medium.mjs https://medium.com/@tu-usuario/tu-articulo-abc123
```

Siempre genera `scripts/imports/<slug>.md` (Markdown + frontmatter) como copia local.

Si `scripts/.env` tiene `STRAPI_URL` y `STRAPI_API_TOKEN` (un API token de Strapi con
permisos `Article: create / find / findOne / update` — Settings → API Tokens → Create
new API Token), el script además crea el artículo directamente en Strapi **como
borrador** (no se publica solo): revísalo en el admin y pulsa **Publish** cuando esté
listo. Sin esas variables, el script se comporta como antes: solo genera el `.md` para
copiar/pegar a mano en el formulario de Strapi (paso 4).

Guarda la URL original en el campo `sourceUrl` del artículo para dar crédito/canonical
a Medium si lo republicas (el script ya lo rellena solo).

> Si Medium bloquea la petición automática (403), guarda la página desde el navegador
> (Ctrl/Cmd+S, "Página web completa") y pasa la ruta del archivo local en vez de la URL:
> `node import-medium.mjs ./pagina-guardada.html https://medium.com/@tu-usuario/...`

## 6. Despliegue

### 6.1 Backend en Strapi Cloud

1. Sube el repo a GitHub (ver sección 7).
2. En [Strapi Cloud](https://cloud.strapi.io), crea un proyecto nuevo conectado a este
   repo, apuntando al **subdirectorio `cms`**.
3. Strapi Cloud provisiona Postgres automáticamente — no toques `DATABASE_CLIENT`.
4. Añade la variable de entorno `FRONTEND_URL` con la URL final de Vercel (para CORS),
   por ejemplo `https://tu-sitio.vercel.app`.
5. Tras el primer deploy, crea tu admin en `https://tu-proyecto.strapiapp.com/admin` y
   añade el locale `es` (igual que en local, paso 2.1).

### 6.2 Frontend en Vercel

1. En [Vercel](https://vercel.com), importa el repo y selecciona el **directorio raíz
   `web`** como *Root Directory*.
2. Añade la variable de entorno `NEXT_PUBLIC_STRAPI_URL` con la URL de tu proyecto de
   Strapi Cloud, por ejemplo `https://tu-proyecto.strapiapp.com`.
3. Deploy. Vercel detecta Next.js automáticamente.
4. (Opcional) añade tu dominio propio en *Project Settings → Domains* cuando lo tengas.

## 7. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial site: Next.js + Strapi personal site"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

Con un único repo monorepo, tanto Vercel como Strapi Cloud pueden desplegar desde el
mismo origin apuntando cada uno a su subcarpeta (`web` / `cms`).
