import { describe, expect, it } from "vitest";
import { bookingConfig, type BookingConfig } from "@/config/booking";
import {
  buildMessage,
  countryFor,
  numberMaxLength,
  digitsOnly,
  freeSlots,
  isBookable,
  monthHasBookableDay,
  validateContact,
  whatsappUrl,
  type Contact,
} from "@/lib/booking";
import { monthGrid, nowInZone, shiftMonth, type ZonedNow } from "@/lib/dates";

const config: BookingConfig = { ...bookingConfig, closedDates: ["2026-12-08"] };
// lunes 23 de noviembre de 2026, 08:30
const monday830: ZonedNow = { year: 2026, month: 11, day: 23, hour: 8, minute: 30 };

const contact: Contact = { firstName: "Ana", lastName: "Pérez", email: "ana@gmail.com", dialCode: "54", areaCode: "343", number: "4123456" };
const ar = countryFor(config, "54");
const cl = countryFor(config, "56");
const br = countryFor(config, "55");

describe("dates", () => {
  it("lee el día y la hora en la zona del consultorio, no la del navegador", () => {
    // 02:30 UTC del 24 es 23:30 del 23 en Argentina
    expect(nowInZone("America/Argentina/Buenos_Aires", new Date("2026-11-24T02:30:00Z"))).toEqual({
      year: 2026, month: 11, day: 23, hour: 23, minute: 30,
    });
  });

  it("arma el mes empezando el lunes", () => {
    // 1 de noviembre de 2026 es domingo: seis huecos antes
    const cells = monthGrid({ year: 2026, month: 11 });
    expect(cells.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(cells[6]).toEqual({ year: 2026, month: 11, day: 1 });
    expect(cells.filter(Boolean)).toHaveLength(30);
  });

  it("pasa de diciembre a enero", () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth({ year: 2027, month: 1 }, -1)).toEqual({ year: 2026, month: 12 });
  });
});

describe("disponibilidad", () => {
  it("ofrece turnos de 9 a 12 y de 15 a 20, de a una hora", () => {
    expect(freeSlots(config, monday830, { year: 2026, month: 11, day: 24 })).toEqual([9, 10, 11, 15, 16, 17, 18, 19]);
  });

  it("hoy saca los horarios sin la anticipación mínima", () => {
    // 08:30 + 2 h = 10:30: quedan 11 y la tarde
    expect(freeSlots(config, monday830, { year: 2026, month: 11, day: 23 })).toEqual([11, 15, 16, 17, 18, 19]);
  });

  it("no ofrece fines de semana, días pasados, feriados ni días fuera del rango", () => {
    expect(isBookable(config, monday830, { year: 2026, month: 11, day: 28 })).toBe(false); // sábado
    expect(isBookable(config, monday830, { year: 2026, month: 11, day: 20 })).toBe(false); // pasado
    expect(isBookable(config, monday830, { year: 2026, month: 12, day: 8 })).toBe(false); // feriado
    expect(isBookable(config, monday830, { year: 2027, month: 2, day: 1 })).toBe(false); // más de 60 días
    expect(isBookable(config, monday830, { year: 2026, month: 11, day: 25 })).toBe(true);
  });

  it("hoy a la noche ya no se puede", () => {
    const night: ZonedNow = { ...monday830, hour: 19, minute: 10 };
    expect(isBookable(config, night, { year: 2026, month: 11, day: 23 })).toBe(false);
  });

  it("detecta un mes sin días libres", () => {
    expect(monthHasBookableDay(config, monday830, { year: 2026, month: 11 })).toBe(true);
    expect(monthHasBookableDay(config, monday830, { year: 2027, month: 3 })).toBe(false);
  });
});

describe("datos de contacto", () => {
  it("acepta datos completos", () => {
    expect(validateContact(contact, ar)).toEqual({});
  });

  it("marca cada campo que falta", () => {
    const errors = validateContact({ firstName: "", lastName: " ", email: "ana@", dialCode: "54", areaCode: "0343", number: "" }, ar);
    expect(Object.keys(errors).sort()).toEqual(["areaCode", "email", "firstName", "lastName", "number"]);
  });

  it("limpia guiones y espacios pegados", () => {
    expect(digitsOnly("412-34 56")).toBe("4123456");
  });
});

describe("teléfono según el país", () => {
  it("Argentina: característica de 2 a 4 dígitos y 10 en total", () => {
    expect(validateContact({ ...contact, areaCode: "11", number: "12345678" }, ar)).toEqual({});
    expect(validateContact({ ...contact, areaCode: "3543", number: "123456" }, ar)).toEqual({});
    expect(validateContact({ ...contact, areaCode: "351", number: "123456" }, ar).number).toMatch(/te falta 1/);
    expect(validateContact({ ...contact, areaCode: "351", number: "12345678" }, ar).number).toMatch(/sobra 1/);
    expect(validateContact({ ...contact, areaCode: "35123" }, ar).areaCode).toBeDefined();
    expect(numberMaxLength(ar)).toBe(8);
  });

  it("países sin código de área: un solo número con su largo", () => {
    const chile = { ...contact, dialCode: "56", areaCode: "" };
    expect(validateContact({ ...chile, number: "912345678" }, cl)).toEqual({});
    expect(validateContact({ ...chile, number: "91234567" }, cl).number).toBe("En Chile el celular tiene 9 dígitos (escribiste 8).");
    expect(numberMaxLength(cl)).toBe(9);
  });

  it("Brasil: DDD de 2 y celular de 9", () => {
    expect(validateContact({ ...contact, dialCode: "55", areaCode: "11", number: "912345678" }, br)).toEqual({});
    expect(validateContact({ ...contact, dialCode: "55", areaCode: "11", number: "12345678" }, br).number).toMatch(/te falta 1/);
  });

  it("cada país del selector tiene datos coherentes", () => {
    for (const c of config.countries) {
      expect(c.digits[0]).toBeLessThanOrEqual(c.digits[1]);
      expect(c.example.length + (c.area?.example.length ?? 0)).toBeGreaterThanOrEqual(c.digits[0]);
      expect(c.example.length + (c.area?.example.length ?? 0)).toBeLessThanOrEqual(c.digits[1]);
    }
  });
});

describe("mensaje de WhatsApp", () => {
  const answers = ["No", "Sí", "No", "3 veces o más", "Sí"];
  const text = buildMessage(config, { contact, day: { year: 2026, month: 11, day: 25 }, hour: 16, answers });

  it("lleva los datos, el turno y las cinco respuestas", () => {
    expect(text).toBe(
      [
        "¡Hola! Quiero pedir un turno.",
        "",
        "Nombre: Ana Pérez",
        "Teléfono: +54 343 4123456",
        "Email: ana@gmail.com",
        "Día: Miércoles 25 de noviembre",
        "Horario: 16:00 a 17:00 h",
        "",
        "Antes de la consulta",
        "1. ¿Tenés o tuviste diabetes? No",
        "2. ¿Tenés alguna alergia o intolerancia a algún alimento? Sí",
        "3. ¿Tomás alguna medicación todos los días? No",
        "4. ¿Hacés actividad física? 3 veces o más",
        "5. ¿Es tu primera consulta con una nutricionista? Sí",
      ].join("\n"),
    );
  });

  it("arma el link de wa.me con el texto codificado", () => {
    const url = new URL(whatsappUrl("+54 9 343 000-0000", text));
    expect(url.origin + url.pathname).toBe("https://wa.me/5493430000000");
    expect(url.searchParams.get("text")).toBe(text);
  });
});
