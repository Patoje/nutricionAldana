import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { BookingSection } from "@/components/sections/BookingSection";
import { StructuredData } from "@/components/StructuredData";

// Base visual de la skill design-taste-frontend (hero split, paleta linen-harbour, tipografía Red Hat),
// con los cambios de la clienta: menú simple, bandas de color, proceso en tarjetas apiladas y ruleta de fotos.
export default function Home() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main id="top">
        <Hero />
        <Services />
        <Process />
        <About />
        <Gallery />
        <BookingSection />
      </main>
      <SiteFooter />
    </>
  );
}
