"use client";

import { useState } from "react";

/** Pausa y reanuda la ruleta de fotos (todo lo que se mueve solo más de 5 s lleva pausa). */
export function GalleryPause() {
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.querySelector("[data-gallery]")?.classList.toggle("is-paused", next);
  };
  return (
    <button className="gallery__pause" type="button" onClick={toggle} aria-pressed={paused}>
      {paused ? (
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      )}
      {paused ? "Reanudar fotos" : "Pausar fotos"}
    </button>
  );
}
