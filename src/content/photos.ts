import type { StaticImageData } from "next/image";
import aldanaRetrato from "@/images/aldana-retrato.webp";
import aldanaRecibida from "@/images/aldana-recibida.webp";
import bowlYogur from "@/images/bowl-yogur.webp";
import tostadas from "@/images/tostadas-frutos-rojos.webp";
import desayunoCama from "@/images/desayuno-cama.webp";
import desayunoPerro from "@/images/desayuno-perro.webp";
import albondigas from "@/images/albondigas.webp";
import pizza from "@/images/pizza-rucula.webp";
import invernadero from "@/images/invernadero.webp";

// Todas las fotos son de Aldana. Para cambiar una: reemplazar el archivo en src/images
// (o importar otro) y ajustar el texto alternativo.

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** Punto de la foto que queda a la vista cuando se recorta (object-position). */
  focus?: string;
};

export const photos = {
  hero: { src: aldanaRetrato, alt: "Aldana Heyde, Licenciada en Nutrición, sentada con camisa blanca y sonriendo", focus: "50% 30%" },
  bowl: { src: bowlYogur, alt: "Bowl de yogur con frutillas, banana, arándanos, granola y pasta de maní", focus: "50% 45%" },
  services: { src: desayunoPerro, alt: "Desayuno con huevos revueltos, tostada, frutillas con frutos secos y café, con un perro al lado", focus: "40% 40%" },
  // en Sobre mí va la foto del invernadero grande (el retrato ya está en el inicio)
  aboutPortrait: { src: invernadero, alt: "Aldana de espaldas mirando las plantas de un invernadero", focus: "50% 55%" },
  aboutGraduation: { src: aldanaRecibida, alt: "Aldana con toga y birrete levantando el diploma el día que se recibió", focus: "50% 40%" },
  stepInitial: { src: desayunoCama, alt: "Desayuno con sándwich tostado, bowl de frutas con granola y un capuchino", focus: "50% 45%" },
  stepPlan: { src: tostadas, alt: "Tostadas con queso y frutos rojos al horno, con un café con leche", focus: "40% 50%" },
  stepSupport: { src: albondigas, alt: "Plato con albóndigas en salsa de tomate sobre masa, con queso rallado", focus: "50% 50%" },
  stepFollowUp: { src: bowlYogur, alt: "Bowl de yogur con frutillas, banana, arándanos, granola y pasta de maní", focus: "50% 45%" },
  close: { src: pizza, alt: "Pizza con rúcula y licuados sobre una mesa de madera", focus: "50% 55%" },
} satisfies Record<string, Photo>;

/** La ruleta de fotos. La primera es la que se ve primero. */
export const gallery: Photo[] = [
  photos.bowl,
  photos.services,
  photos.stepSupport,
  photos.close,
  photos.stepPlan,
  photos.stepInitial,
  photos.aboutPortrait,
];
