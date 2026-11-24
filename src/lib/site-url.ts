/**
 * La dirección pública del sitio, para los links absolutos (Open Graph, sitemap, robots).
 * Orden: NEXT_PUBLIC_SITE_URL (cuando haya dominio propio) → el dominio de producción que
 * Vercel pone solo al hacer el build → localhost para desarrollo.
 */
export function siteUrl(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return new URL(fromEnv);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}
