import Image from "next/image";
import { process } from "@/content/site";
import { photos } from "@/content/photos";

/**
 * El proceso como tarjetas que se apilan: cada paso es una tarjeta que se queda pegada arriba
 * y la siguiente se le sube encima. Aunque se baje rápido no se pierde ningún paso, porque las
 * anteriores quedan asomando. Es solo CSS (position: sticky), sin JavaScript.
 */
export function Process({ id = "proceso" }: { id?: string }) {
  return (
    <section className="section pstack" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="section-head">
          <p className="process__kicker">{process.kicker}</p>
          <h2 id={`${id}-h`}>{process.title}</h2>
        </div>
        <ol className="pstack__list" style={{ ["--n" as string]: process.steps.length }}>
          {process.steps.map((step, i) => {
            const photo = photos[step.photo];
            return (
              <li className="pstack__card" key={step.title} style={{ ["--i" as string]: i }}>
                <div className="pstack__text">
                  <p className="process__label">
                    <span className="process__num">{String(i + 1).padStart(2, "0")}</span>
                    {step.label}
                  </p>
                  <h3>{step.title}</h3>
                  <p className="process__body">{step.body}</p>
                  <p className="process__meta">{step.meta}</p>
                </div>
                <div className="pstack__photo">
                  <Image src={photo.src} alt={photo.alt} sizes="(max-width: 1023px) 100vw, 40vw" placeholder="blur" style={{ objectPosition: photo.focus }} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
