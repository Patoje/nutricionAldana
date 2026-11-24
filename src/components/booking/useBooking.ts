"use client";

import { useReducer } from "react";
import { bookingConfig as config } from "@/config/booking";
import {
  countryFor,
  digitsOnly,
  isBookable,
  monthHasBookableDay,
  validateContact,
  type Contact,
  type ContactErrors,
} from "@/lib/booking";
import { shiftMonth, type CalendarDay, type MonthRef, type ZonedNow } from "@/lib/dates";

export type Step = 1 | 2 | 3 | 4;

export type BookingState = {
  step: Step;
  contact: Contact;
  errors: ContactErrors;
  /** null hasta que el navegador calcula "ahora" (evita diferencias entre servidor y cliente). */
  now: ZonedNow | null;
  view: MonthRef | null;
  day: CalendarDay | null;
  hour: number | null;
  scheduleError: boolean;
  question: number;
  answers: string[];
  /** Para las animaciones: 1 si se avanzó (paso, pregunta o mes), -1 si se volvió. */
  direction: 1 | -1;
  monthDirection: 1 | -1;
};

export type BookingAction =
  | { type: "clock"; now: ZonedNow }
  | { type: "field"; name: keyof Contact; value: string }
  | { type: "submitContact" }
  | { type: "month"; delta: 1 | -1 }
  | { type: "day"; day: CalendarDay }
  | { type: "hour"; hour: number }
  | { type: "submitSchedule" }
  | { type: "answer"; value: string }
  | { type: "back" }
  /** Después de agendar: todo vuelve a empezar (se conserva la hora para el calendario). */
  | { type: "reset" };

export const initialState: BookingState = {
  step: 1,
  contact: { firstName: "", lastName: "", email: "", dialCode: config.countries[0].dialCode, areaCode: "", number: "" },
  errors: {},
  now: null,
  view: null,
  day: null,
  hour: null,
  scheduleError: false,
  question: 0,
  answers: [],
  direction: 1,
  monthDirection: 1,
};

const NUMERIC: ReadonlySet<keyof Contact> = new Set(["areaCode", "number"]);

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  const next = reduce(state, action);
  if (next === state || action.type === "clock" || action.type === "field") return next;
  const moved = next.step !== state.step || next.question !== state.question;
  return moved ? { ...next, direction: action.type === "back" ? -1 : 1 } : next;
}

function reduce(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "clock": {
      const current: MonthRef = { year: action.now.year, month: action.now.month };
      // si este mes ya no tiene días libres, el calendario abre en el siguiente
      const view = monthHasBookableDay(config, action.now, current) ? current : shiftMonth(current, 1);
      return { ...state, now: action.now, view: state.view ?? view };
    }
    case "field": {
      const value = NUMERIC.has(action.name) ? digitsOnly(action.value) : action.value;
      const errors = { ...state.errors };
      delete errors[action.name];
      // al cambiar de país cambian los largos: se vacían característica y número
      if (action.name === "dialCode") {
        delete errors.areaCode;
        delete errors.number;
        return { ...state, contact: { ...state.contact, dialCode: value, areaCode: "", number: "" }, errors };
      }
      return { ...state, contact: { ...state.contact, [action.name]: value }, errors };
    }
    case "submitContact": {
      const errors = validateContact(state.contact, countryFor(config, state.contact.dialCode));
      return Object.keys(errors).length ? { ...state, errors } : { ...state, errors: {}, step: 2 };
    }
    case "month":
      return state.view ? { ...state, view: shiftMonth(state.view, action.delta), monthDirection: action.delta } : state;
    case "day":
      if (!state.now || !isBookable(config, state.now, action.day)) return state;
      return { ...state, day: action.day, hour: null, scheduleError: false };
    case "hour":
      return { ...state, hour: action.hour, scheduleError: false };
    case "submitSchedule":
      return state.day && state.hour !== null ? { ...state, step: 3, question: 0 } : { ...state, scheduleError: true };
    case "answer": {
      const answers = [...state.answers];
      answers[state.question] = action.value;
      const last = state.question >= config.questions.length - 1;
      return last ? { ...state, answers, step: 4 } : { ...state, answers, question: state.question + 1 };
    }
    case "reset":
      return { ...initialState, now: state.now, view: state.now ? { year: state.now.year, month: state.now.month } : null, direction: -1 };
    case "back":
      if (state.step === 4) return { ...state, step: 3, question: config.questions.length - 1 };
      if (state.step === 3) return state.question > 0 ? { ...state, question: state.question - 1 } : { ...state, step: 2 };
      if (state.step === 2) return { ...state, step: 1 };
      return state;
  }
}

export function useBooking() {
  return useReducer(bookingReducer, initialState);
}
