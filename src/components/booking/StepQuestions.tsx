"use client";

import { useEffect, useRef, useState, type Dispatch, type ReactNode } from "react";
import { bookingConfig as config } from "@/config/booking";
import type { BookingAction, BookingState } from "./useBooking";
import styles from "./booking.module.css";

type Props = { state: BookingState; dispatch: Dispatch<BookingAction>; title: ReactNode };

/** Pausa para ver marcada la opción elegida antes de pasar a la siguiente pregunta. */
const ADVANCE_MS = 260;

export function StepQuestions({ state, dispatch, title }: Props) {
  const total = config.questions.length;
  const item = config.questions[state.question];
  // la opción tocada en esta pregunta, mientras espera para avanzar
  const [picked, setPicked] = useState<{ question: number; value: string } | null>(null);
  const pending = picked?.question === state.question ? picked.value : null;
  const firstOption = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // nueva pregunta: el foco va a la primera opción
  useEffect(() => {
    if (state.question > 0) firstOption.current?.focus();
  }, [state.question]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (value: string) => {
    if (pending !== null) return;
    setPicked({ question: state.question, value });
    timer.current = window.setTimeout(() => dispatch({ type: "answer", value }), ADVANCE_MS);
  };

  const current = pending ?? state.answers[state.question] ?? null;

  return (
    <div>
      {title}
      <div className={styles.quiz}>
        <div className={styles.progress} aria-hidden="true">
          {config.questions.map((q, i) => (
            <span key={q.text} className={i <= state.question ? styles.done : undefined} />
          ))}
        </div>
        <p className={`t-label muted ${styles.count}`} aria-live="polite">
          Pregunta {state.question + 1} de {total}
        </p>
        {/* key = pregunta: cada una entra deslizándose y sus opciones aparecen de a una */}
        <div key={state.question} className={styles.questionBlock} data-dir={state.direction === 1 ? "next" : "back"}>
        <p className={styles.question} id="bk-question">{item.text}</p>
        <div className={styles.options} role="group" aria-labelledby="bk-question">
          {item.options.map((opt, i) => (
            <button
              style={{ ["--i" as string]: i }}
              key={opt}
              ref={i === 0 ? firstOption : undefined}
              type="button"
              className={styles.option}
              aria-pressed={current === opt}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className="btn btn--secondary" type="button" onClick={() => dispatch({ type: "back" })}>Volver</button>
      </div>
    </div>
  );
}
