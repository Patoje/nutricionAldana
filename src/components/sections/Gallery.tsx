import Image from "next/image";
import { GalleryPause } from "@/components/GalleryPause";
import { gallery as copy } from "@/content/site";
import { gallery } from "@/content/photos";

/**
 * Ruleta de fotos: una fila que se desliza sola y sin fin (CSS). Se frena al pasar el mouse,
 * con el botón de pausa y si el sistema pide menos movimiento.
 * La fila se repite dos veces para que el loop no tenga corte; la copia queda oculta a lectores de pantalla.
 */
export function Gallery() {
  // con pocas fotos se repite la tanda para que la fila siempre sea más ancha que la pantalla
  const set = gallery.length < 6 ? [...gallery, ...gallery] : gallery;
  return (
    <section className="section band band--ink gallery" id="fotos" aria-labelledby="fotos-h">
      <div className="wrap gallery__head">
        <h2 id="fotos-h">
          {copy.title} <span className="muted">{copy.titleMuted}</span>
        </h2>
        <GalleryPause />
      </div>
      <div className="gallery__viewport" data-gallery>
        <div className="gallery__track">
          {[0, 1].map((copyIndex) => (
            <ul className="gallery__set" key={copyIndex} aria-hidden={copyIndex === 1 ? true : undefined}>
              {set.map((p, i) => (
                <li className="gallery__item" key={`${copyIndex}-${i}`}>
                  <Image src={p.src} alt={copyIndex === 1 || i >= gallery.length ? "" : p.alt} sizes="320px" placeholder="blur" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
