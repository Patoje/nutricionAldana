"use client";

import { useEffect, useRef, type Dispatch, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { bookingConfig as config } from "@/config/booking";
import { countryFor, numberMaxLength, type Contact } from "@/lib/booking";
import type { BookingAction, BookingState } from "./useBooking";
import { useHydrated } from "./useHydrated";
import styles from "./booking.module.css";

type Props = { state: BookingState; dispatch: Dispatch<BookingAction>; title: ReactNode };

const ORDER: (keyof Contact)[] = ["firstName", "lastName", "email", "areaCode", "number"];

export function StepContact({ state, dispatch, title }: Props) {
  const { contact, errors } = state;
  const country = countryFor(config, contact.dialCode);
  const refs = useRef<Partial<Record<keyof Contact, HTMLInputElement | null>>>({});
  const submitted = useRef(false);
  // hasta que React hidrata, el botón queda deshabilitado: así el formulario nunca se envía
  // por la vía nativa (pondría los datos en la URL). Con el botón deshabilitado, Enter tampoco envía.
  const hydrated = useHydrated();

  // después de un intento fallido, el foco va al primer campo con error
  useEffect(() => {
    if (!submitted.current) return;
    submitted.current = false;
    const first = ORDER.find((k) => errors[k]);
    if (first) refs.current[first]?.focus();
  }, [errors]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitted.current = true;
    dispatch({ type: "submitContact" });
  };

  const input = (
    name: keyof Contact,
    label: string,
    props: Partial<InputHTMLAttributes<HTMLInputElement>>,
    options: { inlineError?: boolean; describedBy?: string } = {},
  ) => {
    const id = `bk-${name}`;
    const errId = `${id}-err`;
    const describedBy = [errors[name] ? errId : null, options.describedBy].filter(Boolean).join(" ") || undefined;
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          ref={(el) => {
            refs.current[name] = el;
          }}
          name={name}
          type="text"
          value={contact[name]}
          onChange={(e) => dispatch({ type: "field", name, value: e.target.value })}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={describedBy}
          required
          {...props}
        />
        {options.inlineError !== false && errors[name] && (
          <p className={styles.error} id={errId}>{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} method="post" noValidate>
      {title}
      <div className={styles.fields}>
        {input("firstName", "Nombre", { autoComplete: "given-name" })}
        {input("lastName", "Apellido", { autoComplete: "family-name" })}
        <div className={styles.full}>
          {input("email", "Mail", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "nombre@gmail.com" })}
        </div>
        <div className={`${styles.full} field`} role="group" aria-labelledby="bk-phone-label">
          <p className={styles.groupLabel} id="bk-phone-label">Celular</p>
          {/* key = país: al cambiarlo, los campos entran de nuevo con su largo y su ejemplo */}
          <div className={`${styles.phone} ${country.area ? "" : styles.phoneSingle}`} key={country.dialCode}>
            <div className="field">
              <label htmlFor="bk-dialCode">País</label>
              <select
                id="bk-dialCode"
                className={styles.select}
                value={contact.dialCode}
                onChange={(e) => dispatch({ type: "field", name: "dialCode", value: e.target.value })}
                autoComplete="tel-country-code"
              >
                {config.countries.map((c) => (
                  <option key={c.dialCode + c.name} value={c.dialCode}>{`${c.name} (+${c.dialCode})`}</option>
                ))}
              </select>
            </div>
            {country.area &&
              input(
                "areaCode",
                country.area.label,
                { inputMode: "numeric", autoComplete: "tel-area-code", maxLength: country.area.digits[1], placeholder: country.area.example },
                { inlineError: false, describedBy: "bk-phone-hint" },
              )}
            {input(
              "number",
              "Número",
              { inputMode: "numeric", autoComplete: country.area ? "tel-local" : "tel-national", maxLength: numberMaxLength(country), placeholder: country.example },
              { inlineError: false, describedBy: "bk-phone-hint" },
            )}
          </div>
          {errors.areaCode && <p className={styles.error} id="bk-areaCode-err">{errors.areaCode}</p>}
          {errors.number && <p className={styles.error} id="bk-number-err">{errors.number}</p>}
          <p className={`t-small muted ${styles.phoneHint}`} id="bk-phone-hint">{country.hint}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button className="btn btn--primary" type="submit" disabled={!hydrated}>
          Elegir día y horario
        </button>
      </div>
    </form>
  );
}
