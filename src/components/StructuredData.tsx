import { about, services, site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

/**
 * Datos estructurados (schema.org) para que Google entienda quién es, qué ofrece y que atiende
 * online. No se ven en la página: los leen los buscadores.
 */
export function StructuredData() {
  const url = siteUrl().origin;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#aldana`,
        name: site.legal.fullName,
        jobTitle: site.legal.profession,
        alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad Adventista del Plata" },
        knowsAbout: about.specialties,
        image: `${url}/opengraph-image.jpg`,
        sameAs: [site.social.instagram],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#consultorio`,
        name: `${site.legal.fullName}, ${site.legal.profession}`,
        description: site.description,
        url,
        image: `${url}/opengraph-image.jpg`,
        founder: { "@id": `${url}/#aldana` },
        areaServed: { "@type": "Country", name: "Argentina" },
        availableLanguage: "es",
        sameAs: [site.social.instagram],
        contactPoint: { "@type": "ContactPoint", contactType: "turnos", url: site.social.whatsapp, availableLanguage: "es" },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "12:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:00", closes: "20:00" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Consultas online",
          itemListElement: services.items.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: `${s.name} (online)`, description: s.body },
          })),
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON propio (no viene del usuario); se escapa "<" para que no pueda cerrar el script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
