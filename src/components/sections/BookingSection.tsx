import { Fragment } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { booking, site } from "@/content/site";

export function BookingSection() {
  return (
    <section className="section band band--sky" id="turnos" aria-labelledby="turnos-h">
      <div className="wrap grid grid--top">
        <div className="span-5">
          <div className="section-head">
            <h2 id="turnos-h">
              {booking.title} <span className="muted">{booking.titleMuted}</span>
            </h2>
            <p>{booking.intro}</p>
          </div>
          <dl className="hours booking__hours" data-assumed>
            {site.hours.map((h) => (
              <Fragment key={h.time}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
        <div className="span-6 start-7">
          <BookingFlow labelledBy="turnos-h" />
        </div>
      </div>
    </section>
  );
}
