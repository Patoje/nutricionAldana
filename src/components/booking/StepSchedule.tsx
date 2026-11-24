"use client";

import type { Dispatch, ReactNode } from "react";
import { bookingConfig as config } from "@/config/booking";
import { formatDay, freeSlots, isBookable, lastBookableDay } from "@/lib/booking";
import { hourLabel, isoDate, longDate, monthGrid, monthLabel, sameDay } from "@/lib/dates";
import type { BookingAction, BookingState } from "./useBooking";
import styles from "./booking.module.css";

type Props = { state: BookingState; dispatch: Dispatch<BookingAction>; title: ReactNode };

const WEEK_HEAD = ["L", "M", "M", "J", "V", "S", "D"];

export function StepSchedule({ state, dispatch, title }: Props) {
  const { now, view, day, hour } = state;

  return (
    <div>
      {title}
      {!now || !view ? (
        <div className={styles.calLoading} aria-busy="true" />
      ) : (
        <Calendar state={state} dispatch={dispatch} />
      )}

      {now && day && (
        <div className={styles.slots} key={isoDate(day)}>
          <p className={styles.slotsDay}>{formatDay(day)}</p>
          <SlotGroup label="Mañana" hours={config.morningSlots} free={freeSlots(config, now, day)} selected={hour} dispatch={dispatch} />
          <SlotGroup label="Tarde" offset={config.morningSlots.length} hours={config.afternoonSlots} free={freeSlots(config, now, day)} selected={hour} dispatch={dispatch} />
        </div>
      )}

      {state.scheduleError && (
        <p className={`${styles.error} ${styles.scheduleError}`} role="alert">Elegí un día y un horario.</p>
      )}

      <div className={styles.actions}>
        <button className="btn btn--secondary" type="button" onClick={() => dispatch({ type: "back" })}>Volver</button>
        <button className="btn btn--primary" type="button" onClick={() => dispatch({ type: "submitSchedule" })}>
          Confirmar día y horario
        </button>
      </div>
    </div>
  );
}

function Calendar({ state, dispatch }: Pick<Props, "state" | "dispatch">) {
  const now = state.now!;
  const view = state.view!;
  const today = { year: now.year, month: now.month, day: now.day };
  const last = lastBookableDay(config, now);
  const atFirst = view.year === now.year && view.month === now.month;
  const atLast = view.year > last.year || (view.year === last.year && view.month >= last.month);

  return (
    <div>
      <div className={styles.calHead}>
        <button className={styles.arrow} type="button" aria-label="Mes anterior" disabled={atFirst} onClick={() => dispatch({ type: "month", delta: -1 })}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <p className={styles.month} aria-live="polite" key={monthLabel(view)}>{monthLabel(view)}</p>
        <button className={styles.arrow} type="button" aria-label="Mes siguiente" disabled={atLast} onClick={() => dispatch({ type: "month", delta: 1 })}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </div>
      <div
        key={`${view.year}-${view.month}`}
        className={styles.grid}
        data-dir={state.monthDirection === 1 ? "next" : "back"}
        role="group"
        aria-label={`Días de ${monthLabel(view)}`}
      >
        {WEEK_HEAD.map((w, i) => (
          <span key={i} className={styles.weekday} aria-hidden="true">{w}</span>
        ))}
        {monthGrid(view).map((cell, i) => {
          if (!cell) return <span key={`pad-${i}`} />;
          const open = isBookable(config, now, cell);
          const selected = !!state.day && sameDay(cell, state.day);
          const isToday = sameDay(cell, today);
          return (
            <button
              key={cell.day}
              type="button"
              className={`${styles.day} ${isToday ? styles.today : ""}`}
              disabled={!open}
              aria-pressed={selected}
              aria-label={longDate(cell)}
              onClick={() => dispatch({ type: "day", day: cell })}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SlotGroup({
  label,
  offset = 0,
  hours,
  free,
  selected,
  dispatch,
}: {
  label: string;
  offset?: number;
  hours: readonly number[];
  free: number[];
  selected: number | null;
  dispatch: Dispatch<BookingAction>;
}) {
  return (
    <div className={styles.slotGroup} style={{ ["--offset" as string]: offset }}>
      <p className="t-label muted">{label}</p>
      <div className={styles.slotRow}>
        {hours.map((h, i) => (
          <button
            key={h}
            type="button"
            className={styles.slot}
            style={{ ["--i" as string]: i }}
            disabled={!free.includes(h)}
            aria-pressed={selected === h}
            aria-label={`${hourLabel(h)} a ${hourLabel(h + 1)}`}
            onClick={() => dispatch({ type: "hour", hour: h })}
          >
            {hourLabel(h)}
          </button>
        ))}
      </div>
    </div>
  );
}
