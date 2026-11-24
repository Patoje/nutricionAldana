# Aldana Heyde · Nutricionista online

Sitio de Aldana Heyde, Licenciada en Nutrición: presentación, tipos de consulta, proceso,
sobre mí, fotos y pedido de turno que arma el mensaje de WhatsApp.

Next.js 16 (App Router) · React 19 · TypeScript · Vitest · Vercel.

## Correr

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests de la lógica del turno (fechas, teléfonos, mensaje)
npm run lint
npm run build && npm start
```

Necesita Node 20.9 o más nuevo.

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| WhatsApp, días y horarios, feriados, preguntas, países y largos de teléfono | `src/config/booking.ts` |
| Todos los textos, Instagram, matrícula, mail de contacto | `src/content/site.ts` |
| Fotos (y qué foto va en cada lugar) | `src/images/`, `src/content/photos.ts` |
| Imagen al compartir el link (1200 × 630) | `src/app/opengraph-image.jpg` y `twitter-image.jpg` |
| Política de privacidad y aviso legal | `src/app/privacidad/`, `src/app/aviso-legal/` |
| Colores y estilos propios | `src/app/globals.css` |

## Cómo está armado

```
src/
  app/           página principal, páginas legales, robots.txt, sitemap.xml, imagen para compartir
  components/
    sections/    una sección de la página por archivo
    booking/     pedido de turno en 4 pasos (reducer + un componente por paso)
  config/        configuración del turno
  content/       textos y fotos
  lib/           lógica pura con tests: fechas, disponibilidad, validación, mensaje
  styles/kit/    base visual de la skill design-taste-frontend (no se edita)
```

- **Pedido de turno:** datos (con largo de celular según el país y mail), calendario de lunes a
  viernes con turnos de una hora (9 a 12 y 15 a 20 h), cinco preguntas y resumen. Para agendar hay que
  aceptar el envío de los datos; se abre WhatsApp con el mensaje y el formulario se vacía.
  **No hay backend:** nada se guarda en el sitio.
- **SEO:** metadatos, `robots.txt`, `sitemap.xml`, imagen Open Graph y datos estructurados de
  schema.org (`src/components/StructuredData.tsx`).
- **Medición:** Vercel Analytics (visitas anónimas, sin cookies). Solo se carga cuando el sitio corre
  en Vercel; hay que activarlo en el panel del proyecto, pestaña *Analytics*.

## Deploy y dominio

Vercel detecta el proyecto solo: importar el repo en vercel.com y cada push a `main` publica.
Cuando haya dominio propio, cargar la variable `NEXT_PUBLIC_SITE_URL=https://dominio` en Vercel
para que el sitemap y las imágenes para compartir usen esa dirección.

## Pendiente

- Número de matrícula y mail de contacto en `src/content/site.ts` (`legal`).
- Las cinco preguntas del turno las confirma Aldana.
