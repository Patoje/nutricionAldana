// Fechas de calendario sin hora ni zona: un día es {year, month (1-12), day}.
// Toda la aritmética pasa por UTC para que no la afecte la zona del navegador.

export type CalendarDay = { year: number; month: number; day: number };
export type MonthRef = { year: number; month: number };
export type ZonedNow = CalendarDay & { hour: number; minute: number };

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** El día y la hora actuales en una zona horaria IANA. */
export function nowInZone(timeZone: string, at: Date = new Date()): ZonedNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return { year: +parts.year, month: +parts.month, day: +parts.day, hour: +parts.hour, minute: +parts.minute };
}

const toUtc = ({ year, month, day }: CalendarDay) => Date.UTC(year, month - 1, day);
const fromUtc = (t: number): CalendarDay => {
  const d = new Date(t);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
};

export const addDays = (d: CalendarDay, n: number): CalendarDay => fromUtc(toUtc(d) + n * 86_400_000);
/** 0 domingo ... 6 sábado. */
export const weekday = (d: CalendarDay): number => new Date(toUtc(d)).getUTCDay();
export const daysInMonth = ({ year, month }: MonthRef): number => new Date(Date.UTC(year, month, 0)).getUTCDate();
export const compareDays = (a: CalendarDay, b: CalendarDay): number => toUtc(a) - toUtc(b);
export const sameDay = (a: CalendarDay, b: CalendarDay): boolean => compareDays(a, b) === 0;

export function shiftMonth({ year, month }: MonthRef, n: number): MonthRef {
  const t = year * 12 + (month - 1) + n;
  return { year: Math.floor(t / 12), month: (t % 12) + 1 };
}

export const isoDate = ({ year, month, day }: CalendarDay): string =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** "miércoles 25 de noviembre" */
export const longDate = (d: CalendarDay): string => `${WEEKDAYS[weekday(d)]} ${d.day} de ${MONTHS[d.month - 1]}`;
/** "noviembre de 2026" */
export const monthLabel = ({ year, month }: MonthRef): string => `${MONTHS[month - 1]} de ${year}`;
/** 9 -> "09:00" */
export const hourLabel = (h: number): string => `${String(h).padStart(2, "0")}:00`;
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Las celdas de un mes con la semana empezando el lunes:
 * null para los huecos antes del día 1.
 */
export function monthGrid(ref: MonthRef): (CalendarDay | null)[] {
  const lead = (weekday({ ...ref, day: 1 }) + 6) % 7;
  const cells: (CalendarDay | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth(ref); day++) cells.push({ ...ref, day });
  return cells;
}
