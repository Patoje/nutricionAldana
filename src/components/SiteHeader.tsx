"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/icons";
import { NavIndicator } from "@/components/NavIndicator";
import { nav, site } from "@/content/site";

/**
 * Menú: en la compu, links que bajan a cada sección (NavIndicator marca dónde estás).
 * En el celular, un botón abre el menú a pantalla completa (los estilos de .nav.is-open son del kit).
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // si se agranda la ventana a tamaño compu con el menú abierto, se cierra
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.body.classList.remove("nav-locked");
    };
  }, [open]);

  // tocar cualquier link del menú abierto lo cierra
  const close = () => setOpen(false);

  return (
    <header className={`nav ${open ? "is-open" : ""}`}>
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">Ir al contenido</a>
        <Logo name={site.brand} />
        <nav className="nav__links" id="menu-principal" aria-label="Principal" data-nav-links>
          {nav.map((item) => (
            <div className="nav__item" key={item.href}>
              <a className="nav__link" href={item.href} onClick={close}>{item.label}</a>
            </div>
          ))}
          <NavIndicator />
        </nav>
        <div className="nav__actions">
          <a className="btn btn--primary" href={site.mainAction.href} onClick={close}>{site.mainAction.label}</a>
        </div>
        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 13h14"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
