import Image from "next/image";
import { ArrowIcon } from "@/components/icons";
import { HeroLeaves } from "@/components/HeroLeaves";
import { hero, site } from "@/content/site";
import { photos } from "@/content/photos";

// Hero "split": texto a la izquierda, foto de Aldana a la derecha.
export function Hero() {
  return (
    <section className="hero hero--split hero--color" aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <p className="hero__badge">
              {hero.badge}
            </p>
            <h1 id="hero-h">
              {hero.titleStart} <span className="accent-word">{hero.titleAccent}</span>
            </h1>
            <p className="hero__lead">{hero.lead}</p>
            <div className="btn-row">
              <a className="btn btn--primary" href={site.mainAction.href}>
                {site.mainAction.label}
                <ArrowIcon />
              </a>
              <a className="btn btn--secondary" href={hero.secondaryAction.href}>{hero.secondaryAction.label}</a>
            </div>
            <HeroLeaves />
          </div>
          <div className="hero__media span-6 start-7">
            <Image
              src={photos.hero.src}
              alt={photos.hero.alt}
              sizes="(max-width: 1023px) 100vw, 45vw"
              priority
              placeholder="blur"
              style={{ ["--ly-pos" as string]: photos.hero.focus }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
