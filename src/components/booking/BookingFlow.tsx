"use client";

import { useEffect, useRef, useState } from "react";
import { bookingConfig as config } from "@/config/booking";
import { nowInZone } from "@/lib/dates";
import { useBooking, type Step } from "./useBooking";
import { StepContact } from "./StepContact";
import { StepSchedule } from "./StepSchedule";
import { StepQuestions } from "./StepQuestions";
import { StepReview } from "./StepReview";
import styles from "./booking.module.css";

const STEP_NAMES: Record<Step, string> = { 1: "Tus datos", 2: "Día y horario", 3: "Preguntas", 4: "Confirmar" };

/**
 * Pedido de turno en 4 pasos: datos -> día y horario -> preguntas -> resumen.
 * No guarda ni envía nada a un servidor: al final arma un link de WhatsApp con el mensaje.
 */
export function BookingFlow({ labelledBy }: { labelledBy: string }) {
  const [state, dispatch] = useBooking();
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  // después de agendar se vuelve arriba de todo: ese cambio de paso no debe mover la página al panel
  const skipScroll = useRef(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // "ahora" en la zona del consultorio; se recalcula cada minuto
  useEffect(() => {
    const tick = () => dispatch({ type: "clock", now: nowInZone(config.timeZone) });
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [dispatch]);

  // al cambiar de paso: el título toma el foco y el panel queda a la vista
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    const root = rootRef.current;
    // si el panel quedó tapado por el header fijo, se lo trae a la vista
    if (root && root.getBoundingClientRect().top < 80) root.scrollIntoView({ block: "start", behavior: "smooth" });
    titleRef.current?.focus({ preventScroll: true });
  }, [state.step]);

  // ¡Agendar! ya abrió WhatsApp: se borra todo, se vuelve arriba y aparece un aviso
  const onSent = () => {
    skipScroll.current = true;
    dispatch({ type: "reset" });
    // instantáneo: WhatsApp quedó adelante en otra pestaña, y en una pestaña de fondo
    // el navegador puede pausar el scroll suave. Al volver, la página ya está arriba.
    window.scrollTo({ top: 0, behavior: "instant" });
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 5000);
  };

  const title = (
    <h3 className={styles.title} ref={titleRef} tabIndex={-1}>
      {state.step === 3 ? "Antes de la consulta" : state.step === 4 ? "Revisá tu pedido" : STEP_NAMES[state.step]}
    </h3>
  );

  return (
    <div className={styles.flow} ref={rootRef} role="region" aria-labelledby={labelledBy} id="pedido-de-turno">
      <ol className={styles.steps} aria-label="Pasos" style={{ ["--progress" as string]: (state.step - 1) / 3 }}>
        {([1, 2, 3, 4] as const).map((n) => (
          <li key={n} aria-current={n === state.step ? "step" : undefined} className={n < state.step ? styles.done : undefined}>
            <span className={styles.stepNum}>
              {n < state.step ? (
                <svg viewBox="0 0 16 16" aria-label={`${n}, listo`} role="img"><path d="M3.5 8.5l3 3 6-7" /></svg>
              ) : (
                n
              )}
            </span>
            {STEP_NAMES[n]}
          </li>
        ))}
      </ol>

      {/* key = paso: cada cambio vuelve a montar el panel y dispara la animación de entrada,
          hacia la izquierda al avanzar y hacia la derecha al volver */}
      <div key={state.step} className={styles.panel} data-dir={state.direction === 1 ? "next" : "back"}>
        {state.step === 1 && <StepContact state={state} dispatch={dispatch} title={title} />}
        {state.step === 2 && <StepSchedule state={state} dispatch={dispatch} title={title} />}
        {state.step === 3 && <StepQuestions state={state} dispatch={dispatch} title={title} />}
        {state.step === 4 && <StepReview state={state} dispatch={dispatch} title={title} onSent={onSent} />}
      </div>

      <div className={styles.toast} role="status" aria-live="polite" data-open={toast || undefined}>
        {toast && (
          <>
            <strong>Listo, se abrió WhatsApp.</strong> Enviá el mensaje y Aldana te confirma el turno.
          </>
        )}
      </div>
    </div>
  );
}
