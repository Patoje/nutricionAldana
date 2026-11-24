import Image from "next/image";
import { services, site } from "@/content/site";
import { photos } from "@/content/photos";

export function Services() {
  return (
    <section className="section band band--sage" id="servicios" aria-labelledby="servicios-h">
      <div className="wrap grid grid--top">
        <div className="span-8">
          <div className="section-head">
            <h2 id="servicios-h">
              {services.title} <span className="muted">{services.titleMuted}</span>
            </h2>
          </div>
          <div className="service-cards">
            {services.items.map((s) => (
              <article className="service-card" key={s.name}>
                <p className="service-card__duration">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" />
                    <path d="M8 4.75V8l2.25 1.5" />
                  </svg>
                  {s.duration}
                </p>
                <h3>{s.name}</h3>
                <p className="service-card__body">{s.body}</p>
                <p className="service-card__label">Incluye</p>
                <ul className="service-card__list">
                  {s.includes.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="services__note">{services.note}</p>
          <a className="link services__cta" href={site.mainAction.href}>{site.mainAction.label}</a>
        </div>
        <div className="span-3 start-10">
          <div className="frame frame--photo services__photo">
            <Image
              className="frame__img"
              src={photos.services.src}
              alt={photos.services.alt}
              sizes="(max-width: 1023px) 100vw, 25vw"
              placeholder="blur"
              style={{ objectPosition: photos.services.focus }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
