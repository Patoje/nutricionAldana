"use client";

import { useEffect, useRef } from "react";

/**
 * Una barrita bajo el link del menú de la sección que estás viendo. Se desliza de un link
 * al otro mientras scrolleás o cuando tocás un link (el scroll suave lo pone el CSS).
 * También marca la sección de destino para que su título entre con una animación.
 */
export function NavIndicator() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const nav = bar?.closest<HTMLElement>("[data-nav-links]");
    if (!bar || !nav) return;

    const links = [...nav.querySelectorAll<HTMLAnchorElement>(":scope > .nav__item > .nav__link")];
    const targets = links
      .map((a) => ({ a, section: document.querySelector<HTMLElement>(a.hash) }))
      .filter((t): t is { a: HTMLAnchorElement; section: HTMLElement } => !!t.section);

    const place = (link: HTMLAnchorElement | null) => {
      if (!link) {
        bar.style.opacity = "0";
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const box = link.getBoundingClientRect();
      bar.style.opacity = "1";
      bar.style.width = `${box.width}px`;
      bar.style.transform = `translateX(${box.left - navBox.left}px)`;
      links.forEach((l) => l.classList.toggle("is-active", l === link));
    };

    // la sección activa es la que cruza una línea un poco debajo del header
    const update = () => {
      const line = window.innerHeight * 0.35;
      const hit = targets.find(({ section }) => {
        const r = section.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      place(hit?.a ?? null);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // al tocar un link: el título de la sección destino "aterriza" con una animación
    const onClick = (e: Event) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const section = a?.hash ? document.querySelector<HTMLElement>(a.hash) : null;
      if (!section) return;
      section.classList.remove("is-arriving");
      void section.offsetWidth; // reinicia la animación si se toca dos veces
      section.classList.add("is-arriving");
      window.setTimeout(() => section.classList.remove("is-arriving"), 1400);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return <span className="nav__indicator" ref={barRef} aria-hidden="true" />;
}
