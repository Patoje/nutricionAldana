// Configuración del pedido de turno. Lo que se cambia seguido está acá.

export type Question = {
  /** Texto de la pregunta, tal como se ve y como va en el mensaje. */
  text: string;
  options: readonly string[];
};

/**
 * Un país del selector de teléfono. `digits` es el largo del número nacional del celular
 * (sin el código de país, sin 0 ni 15). Si el país usa código de área, el formulario muestra
 * dos campos y `area` dice su largo; el número es lo que queda hasta completar `digits`.
 */
export type Country = {
  name: string;
  dialCode: string;
  digits: readonly [min: number, max: number];
  area?: { label: string; digits: readonly [min: number, max: number]; example: string };
  /** Ejemplo para el campo del número (sin el código de área si lo hay). */
  example: string;
  /** Ayuda corta debajo de los campos. */
  hint: string;
};

export type BookingConfig = {
  /** Número de WhatsApp con código de país, solo dígitos. Argentina celular: 54 9 + característica + número. */
  whatsappNumber: string;
  /** Zona horaria del consultorio: decide qué día es "hoy" y qué horarios ya pasaron. */
  timeZone: string;
  /** Días de atención: 0 domingo ... 6 sábado. */
  workDays: readonly number[];
  /** Hora de inicio de cada turno de una hora. */
  morningSlots: readonly number[];
  afternoonSlots: readonly number[];
  /** Hasta cuántos días para adelante se puede pedir turno. */
  daysAhead: number;
  /** Anticipación mínima, en horas, para un turno del mismo día. */
  minNoticeHours: number;
  /** Días sin atención (feriados, vacaciones), AAAA-MM-DD. */
  closedDates: readonly string[];
  questions: readonly Question[];
  countries: readonly Country[];
};

export const bookingConfig: BookingConfig = {
  // 351 228-3170 (celular de Córdoba): 54 + 9 + 351 + 2283170
  whatsappNumber: "5493512283170",
  timeZone: "America/Argentina/Buenos_Aires",
  // PROVISORIO: lunes a viernes.
  workDays: [1, 2, 3, 4, 5],
  morningSlots: [9, 10, 11], // 9 a 12 h
  afternoonSlots: [15, 16, 17, 18, 19], // 15 a 20 h
  daysAhead: 60,
  minNoticeHours: 2,
  closedDates: ["2026-12-08", "2026-12-25", "2027-01-01"],
  // BORRADOR: las preguntas las define ella.
  questions: [
    { text: "¿Tenés o tuviste diabetes?", options: ["Sí", "No", "No sé"] },
    { text: "¿Tenés alguna alergia o intolerancia a algún alimento?", options: ["Sí", "No", "No sé"] },
    { text: "¿Tomás alguna medicación todos los días?", options: ["Sí", "No"] },
    { text: "¿Hacés actividad física?", options: ["No", "1 o 2 veces por semana", "3 veces o más"] },
    { text: "¿Es tu primera consulta con una nutricionista?", options: ["Sí", "No"] },
  ],
  countries: [
    {
      name: "Argentina", dialCode: "54", digits: [10, 10],
      area: { label: "Característica", digits: [2, 4], example: "351" },
      example: "1234567",
      hint: "Sin el 0 ni el 15. Característica y número suman 10 dígitos (por ejemplo 351 y 1234567).",
    },
    { name: "Uruguay", dialCode: "598", digits: [8, 8], example: "91234567", hint: "Celular sin el 0: 8 dígitos." },
    { name: "Paraguay", dialCode: "595", digits: [9, 9], example: "981234567", hint: "Celular sin el 0: 9 dígitos." },
    { name: "Chile", dialCode: "56", digits: [9, 9], example: "912345678", hint: "Celular: 9 dígitos, empieza con 9." },
    { name: "Bolivia", dialCode: "591", digits: [8, 8], example: "71234567", hint: "Celular: 8 dígitos." },
    {
      name: "Brasil", dialCode: "55", digits: [11, 11],
      area: { label: "DDD", digits: [2, 2], example: "11" },
      example: "912345678",
      hint: "DDD de 2 dígitos y celular de 9.",
    },
    { name: "Perú", dialCode: "51", digits: [9, 9], example: "912345678", hint: "Celular: 9 dígitos." },
    { name: "Colombia", dialCode: "57", digits: [10, 10], example: "3001234567", hint: "Celular: 10 dígitos." },
    { name: "Venezuela", dialCode: "58", digits: [10, 10], example: "4121234567", hint: "Celular sin el 0: 10 dígitos." },
    { name: "Ecuador", dialCode: "593", digits: [9, 9], example: "991234567", hint: "Celular sin el 0: 9 dígitos." },
    { name: "México", dialCode: "52", digits: [10, 10], example: "5512345678", hint: "Celular: 10 dígitos." },
    { name: "España", dialCode: "34", digits: [9, 9], example: "612345678", hint: "Móvil: 9 dígitos." },
    {
      name: "Estados Unidos", dialCode: "1", digits: [10, 10],
      area: { label: "Código de área", digits: [3, 3], example: "305" },
      example: "5551234",
      hint: "Código de área de 3 dígitos y número de 7.",
    },
    { name: "Italia", dialCode: "39", digits: [9, 10], example: "3123456789", hint: "Celular: 9 o 10 dígitos." },
  ],
};
