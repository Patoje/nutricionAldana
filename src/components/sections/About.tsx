import Image from "next/image";
import { about } from "@/content/site";
import { photos } from "@/content/photos";

export function About() {
  return (
    <section className="section band band--terra about" id="sobre-mi" aria-labelledby="sobre-mi-h">
      <div className="wrap">
        <figure className="about__quote">
          <blockquote>
            <p>“{about.quote}”</p>
          </blockquote>
          <figcaption>{about.quoteCaption}</figcaption>
        </figure>

        <div className="grid grid--top about__grid">
          <div className="span-6">
            <div className="section-head">
              <h2 id="sobre-mi-h">
                {about.title} <span className="muted">{about.titleMuted}</span>
              </h2>
            </div>
            <div className="stack-4 about__text">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="span-5 start-8">
            <div className="about__collage">
              <div className="about__main">
                <Image src={photos.aboutGraduation.src} alt={photos.aboutGraduation.alt} sizes="(max-width: 1023px) 90vw, 32vw" placeholder="blur" style={{ objectPosition: photos.aboutGraduation.focus }} />
              </div>
              <div className="about__second">
                <Image src={photos.aboutPortrait.src} alt={photos.aboutPortrait.alt} sizes="(max-width: 1023px) 45vw, 16vw" placeholder="blur" style={{ objectPosition: photos.aboutPortrait.focus }} />
              </div>
            </div>
          </div>
        </div>

        <div className="about__bottom">
          <div>
            <h3 className="about__subhead">{about.specialtiesTitle}</h3>
            <ul className="specialties">
              {about.specialties.map((s, i) => (
                <li key={s} style={{ ["--i" as string]: i }}>
                  <span className="specialties__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <dl className="about__facts">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  {"href" in f ? (
                    <a className="link" href={f.href} target="_blank" rel="noopener noreferrer">{f.value}</a>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
