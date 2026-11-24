import Link from "next/link";
import { ArrowIcon, Logo } from "@/components/icons";
import { closing, site } from "@/content/site";

// cierre con el botón principal + footer en columnas
export function SiteFooter() {
  return (
    <footer className="footer closing" id="contact" aria-labelledby="close-h">
      <div className="wrap">
        <div className="closing__cta">
          <div className="section-head--split">
            <div>
              <h2 id="close-h">{closing.title}</h2>
              <p className="t-lead">{closing.lead}</p>
            </div>
            <a className="btn btn--primary" href={site.mainAction.href}>
              {site.mainAction.label}
              <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <Logo name={site.brand} />
              <p className="footer__lede">{site.lede}</p>
            </div>
            <div className="span-2 start-7 footer__col">
              <h3>Consultorio</h3>
              <ul>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#sobre-mi">Sobre mí</a></li>
                <li><a href="#fotos">Fotos</a></li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Turnos</h3>
              <ul>
                <li><a href="#proceso">Proceso</a></li>
                <li><a href="#turnos">Días y horarios</a></li>
              </ul>
            </div>
            <div className="span-2 footer__col">
              <h3>Contacto</h3>
              <ul className="footer__social">
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG oficial, sin optimizar */}
                    <img src="/icons/instagram.svg" alt="" width={20} height={20} />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG oficial, sin optimizar */}
                    <img src="/icons/whatsapp.svg" alt="" width={20} height={20} />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <p className="footer__id">
              &copy; {new Date().getFullYear()} {site.legal.fullName} · {site.legal.profession}
              {site.legal.matricula && <> · {site.legal.matricula}</>} · Consultas online
            </p>
            <nav className="footer__legal-links" aria-label="Legal">
              <Link href="/privacidad">Política de privacidad</Link>
              <Link href="/aviso-legal">Aviso legal</Link>
            </nav>
            <p className="footer__disclaimer">
              La información de este sitio es general y no reemplaza una consulta profesional. No es un servicio de
              urgencias: ante una emergencia, comunicate con el servicio de emergencias de tu zona.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
