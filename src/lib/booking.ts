import type { BookingConfig, Country } from "@/config/booking";
import {
  addDays,
  capitalize,
  compareDays,
  daysInMonth,
  hourLabel,
  isoDate,
  longDate,
  sameDay,
  weekday,
  type CalendarDay,
  type MonthRef,
  type ZonedNow,
} from "@/lib/dates";

export type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  dialCode: string;
  areaCode: string;
  number: string;
};

export type ContactErrors = Partial<Record<keyof Contact, string>>;

export type BookingRequest = {
  contact: Contact;
  day: CalendarDay;
  hour: number;
  answers: readonly string[];
};

const today = (now: ZonedNow): CalendarDay => ({ year: now.year, month: now.month, day: now.day });

/** Horarios libres de un día: todos, salvo los de hoy que ya no llegan con la anticipación mínima. */
export function freeSlots(config: BookingConfig, now: ZonedNow, day: CalendarDay): number[] {
  const all = [...config.morningSlots, ...config.afternoonSlots];
  if (!sameDay(day, today(now))) return all;
  const earliest = now.hour + now.minute / 60 + config.minNoticeHours;
  return all.filter((h) => h >= earliest);
}

export function lastBookableDay(config: BookingConfig, now: ZonedNow): CalendarDay {
  return addDays(today(now), config.daysAhead);
}

export function isBookable(config: BookingConfig, now: ZonedNow, day: CalendarDay): boolean {
  if (compareDays(day, today(now)) < 0) return false;
  if (compareDays(day, lastBookableDay(config, now)) > 0) return false;
  if (!config.workDays.includes(weekday(day))) return false;
  if (config.closedDates.includes(isoDate(day))) return false;
  return freeSlots(config, now, day).length > 0;
}

export function monthHasBookableDay(config: BookingConfig, now: ZonedNow, ref: MonthRef): boolean {
  for (let day = 1; day <= daysInMonth(ref); day++) {
    if (isBookable(config, now, { ...ref, day })) return true;
  }
  return false;
}

/** Solo dígitos: se puede pegar "412-3456" o "412 3456". */
export const digitsOnly = (s: string): string => s.replace(/\D/g, "");

export const countryFor = (config: BookingConfig, dialCode: string): Country =>
  config.countries.find((c) => c.dialCode === dialCode) ?? config.countries[0];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Máximo de dígitos que admite el campo del número (sin el código de área). */
export function numberMaxLength(country: Country): number {
  return country.area ? country.digits[1] - country.area.digits[0] : country.digits[1];
}

const digitCount = ([min, max]: readonly [number, number]) => (min === max ? `${min}` : `${min} o ${max}`);

export function validateContact(c: Contact, country: Country): ContactErrors {
  const errors: ContactErrors = {};
  if (c.firstName.trim().length < 2) errors.firstName = "Escribí tu nombre.";
  if (c.lastName.trim().length < 2) errors.lastName = "Escribí tu apellido.";
  if (!EMAIL.test(c.email.trim())) errors.email = "Escribí un mail válido, por ejemplo nombre@gmail.com.";

  if (country.area) {
    const [amin, amax] = country.area.digits;
    const areaOk = c.areaCode.length >= amin && c.areaCode.length <= amax && !c.areaCode.startsWith("0");
    if (!areaOk) {
      const size = amin === amax ? `${amin} dígitos` : `entre ${amin} y ${amax} dígitos`;
      errors.areaCode = `${country.area.label}: ${size}, sin el 0.`;
    }
    const total = c.areaCode.length + c.number.length;
    const [min, max] = country.digits;
    if (!c.number) errors.number = "Escribí el número.";
    else if (areaOk && (total < min || total > max)) {
      const missing = min - total;
      errors.number =
        missing > 0
          ? `${country.area.label} y número suman ${digitCount(country.digits)} dígitos: te falta${missing > 1 ? "n" : ""} ${missing}.`
          : `${country.area.label} y número suman ${digitCount(country.digits)} dígitos: sobra${-missing > 1 ? "n" : ""} ${-missing}.`;
    }
  } else {
    const [min, max] = country.digits;
    if (c.number.length < min || c.number.length > max) {
      errors.number = `En ${country.name} el celular tiene ${digitCount(country.digits)} dígitos${c.number ? ` (escribiste ${c.number.length})` : ""}.`;
    }
  }
  return errors;
}

export const fullName = (c: Contact): string => `${c.firstName.trim()} ${c.lastName.trim()}`;
export const formatPhone = (c: Contact): string =>
  c.areaCode ? `+${c.dialCode} ${c.areaCode} ${c.number}` : `+${c.dialCode} ${c.number}`;
export const formatDay = (d: CalendarDay): string => capitalize(longDate(d));
export const formatSlot = (h: number): string => `${hourLabel(h)} a ${hourLabel(h + 1)} h`;

/**
 * El texto que llega por WhatsApp: un saludo, los datos del turno en un bloque
 * y las respuestas numeradas en otro, separados por una línea en blanco.
 */
export function buildMessage(config: BookingConfig, req: BookingRequest): string {
  return [
    "¡Hola! Quiero pedir un turno.",
    "",
    `Nombre: ${fullName(req.contact)}`,
    `Teléfono: ${formatPhone(req.contact)}`,
    `Email: ${req.contact.email.trim()}`,
    `Día: ${formatDay(req.day)}`,
    `Horario: ${formatSlot(req.hour)}`,
    "",
    "Antes de la consulta",
    ...config.questions.map((q, i) => `${i + 1}. ${q.text} ${req.answers[i] ?? "-"}`),
  ].join("\n");
}

export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(text)}`;
}
