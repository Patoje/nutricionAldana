import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";

/** Marco común de las páginas legales: encabezado simple, texto en una columna y fecha. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="legal-bar">
        <div className="wrap legal-bar__inner">
          <Link className="nav__logo" href="/">
            <span className="mark" data-mark="dots" aria-hidden="true" />
            {site.brand}
          </Link>
          <Link className="link" href="/">Volver al inicio</Link>
        </div>
      </header>
      <main className="legal" id="top">
        <article className="wrap legal__body">
          <h1>{title}</h1>
          <p className="legal__updated">Última actualización: {updated}</p>
          {children}
        </article>
      </main>
    </>
  );
}
