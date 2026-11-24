"use client";

import { Fragment, useEffect, useRef, useState, type Dispatch, type ReactNode } from "react";
import { bookingConfig as config } from "@/config/booking";
import { buildMessage, formatDay, formatPhone, formatSlot, fullName, whatsappUrl } from "@/lib/booking";
import type { BookingAction, BookingState } from "./useBooking";
import styles from "./booking.module.css";

type Props = {
  state: BookingState;
  dispatch: Dispatch<BookingAction>;
  title: ReactNode;
  /** Se llama después de abrir WhatsApp: el pedido se borra y la página vuelve arriba. */
  onSent: () => void;
};

/** Copia texto al portapapeles; si el navegador no deja, usa un textarea oculto. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function StepReview({ state, dispatch, title, onSent }: Props) {
  const { contact, day, hour, answers } = state;
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  // consentimiento: el mensaje lleva datos de salud (Ley 25.326, art. 7), así que se pide aceptar antes
  const [accepted, setAccepted] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!day || hour === null) return null;

  const rows: [string, string][] = [
    ["Nombre", fullName(contact)],
    ["Celular", formatPhone(contact)],
    ["Mail", contact.email.trim()],
    ["Día", formatDay(day)],
    ["Horario", formatSlot(hour)],
    ...config.questions.map((q, i): [string, string] => [q.text, answers[i] ?? "-"]),
  ];
  const message = buildMessage(config, { contact, day, hour, answers });
  const href = whatsappUrl(config.whatsappNumber, message);

  const copy = async () => {
    const ok = await copyText(message);
    setCopied(ok ? "ok" : "error");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied("idle"), 2500);
  };

  return (
    <div>
      {title}
      <dl className={styles.summary}>
        {rows.map(([k, v], i) => (
          <Fragment key={k}>
            <dt style={{ ["--i" as string]: i }}>{k}</dt>
            <dd style={{ ["--i" as string]: i }}>{v}</dd>
          </Fragment>
        ))}
      </dl>
      <div className={styles.privacy}>
        <p className={styles.privacyNote}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
          Tus datos no se guardan en esta página: viajan solo dentro del mensaje de WhatsApp que vos enviás a Aldana.
        </p>
        <label className={styles.consent} data-invalid={consentError || undefined}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              if (e.target.checked) setConsentError(false);
            }}
            aria-describedby={consentError ? "bk-consent-err" : undefined}
          />
          <span>
            Acepto enviar estos datos, incluidas mis respuestas sobre salud, para pedir el turno, según la{" "}
            <a className="link" href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
          </span>
        </label>
        {consentError && (
          <p className={styles.error} id="bk-consent-err" role="alert">Para agendar, aceptá el envío de tus datos.</p>
        )}
      </div>
      <div className={styles.actions}>
        <button className="btn btn--secondary" type="button" onClick={() => dispatch({ type: "back" })}>Volver</button>
        <div className={styles.sendGroup}>
          <button className={`btn btn--secondary ${styles.copy}`} type="button" onClick={copy} data-state={copied}>
            {copied === "ok" ? "¡Copiado!" : copied === "error" ? "No se pudo copiar" : "Copiar mensaje"}
          </button>
          {/* el link abre WhatsApp en otra pestaña; después el pedido se borra (onSent) */}
          <a
            className={`btn btn--primary ${styles.send}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="send-whatsapp"
            aria-disabled={!accepted}
            onClick={(e) => {
              if (!accepted) {
                e.preventDefault();
                setConsentError(true);
                return;
              }
              window.setTimeout(onSent, 120);
            }}
          >
            ¡Agendar!
          </a>
        </div>
      </div>
      <p className={`t-small muted ${styles.hint}`} aria-live="polite">
        {copied === "ok"
          ? "Mensaje copiado: si WhatsApp no se abre, pegalo en un chat con Aldana."
          : "Se abre WhatsApp en otra pestaña con tu mensaje listo. Solo tenés que enviarlo."}
      </p>
    </div>
  );
}
