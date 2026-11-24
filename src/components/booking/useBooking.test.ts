import { describe, expect, it } from "vitest";
import { bookingReducer, initialState, type BookingAction, type BookingState } from "./useBooking";

const run = (actions: BookingAction[], from: BookingState = initialState) => actions.reduce(bookingReducer, from);
const now = { year: 2026, month: 11, day: 23, hour: 8, minute: 30 };
const filled: BookingAction[] = [
  { type: "clock", now },
  { type: "field", name: "firstName", value: "Ana" },
  { type: "field", name: "lastName", value: "Pérez" },
  { type: "field", name: "email", value: "ana@gmail.com" },
  { type: "field", name: "areaCode", value: "343" },
  { type: "field", name: "number", value: "412-3456" },
];

describe("pasos del pedido de turno", () => {
  it("no pasa del paso 1 con datos incompletos", () => {
    const s = run([{ type: "submitContact" }]);
    expect(s.step).toBe(1);
    expect(Object.keys(s.errors)).toHaveLength(5);
  });

  it("limpia el número y avanza con datos completos", () => {
    const s = run([...filled, { type: "submitContact" }]);
    expect(s.contact.number).toBe("4123456");
    expect(s.step).toBe(2);
  });

  it("pide día y horario antes de las preguntas", () => {
    const base = run([...filled, { type: "submitContact" }]);
    expect(run([{ type: "submitSchedule" }], base).scheduleError).toBe(true);
    const s = run([{ type: "day", day: { year: 2026, month: 11, day: 25 } }, { type: "hour", hour: 16 }, { type: "submitSchedule" }], base);
    expect(s.step).toBe(3);
  });

  it("ignora un día no disponible", () => {
    const base = run([...filled, { type: "submitContact" }]);
    expect(run([{ type: "day", day: { year: 2026, month: 11, day: 28 } }], base).day).toBeNull();
  });

  it("cambiar de día borra el horario elegido", () => {
    const base = run([...filled, { type: "submitContact" }, { type: "day", day: { year: 2026, month: 11, day: 25 } }, { type: "hour", hour: 9 }]);
    expect(run([{ type: "day", day: { year: 2026, month: 11, day: 26 } }], base).hour).toBeNull();
  });

  it("recorre las 5 preguntas y llega al resumen; Volver retrocede de a una", () => {
    let s = run([...filled, { type: "submitContact" }, { type: "day", day: { year: 2026, month: 11, day: 25 } }, { type: "hour", hour: 16 }, { type: "submitSchedule" }]);
    for (let i = 0; i < 4; i++) s = bookingReducer(s, { type: "answer", value: "No" });
    expect(s).toMatchObject({ step: 3, question: 4 });
    s = bookingReducer(s, { type: "back" });
    expect(s.question).toBe(3);
    s = run([{ type: "answer", value: "Sí" }, { type: "answer", value: "No" }], s);
    expect(s.step).toBe(4);
    expect(s.answers).toEqual(["No", "No", "No", "Sí", "No"]);
    expect(bookingReducer(s, { type: "back" })).toMatchObject({ step: 3, question: 4 });
  });
});

describe("dirección de las animaciones", () => {
  it("marca si se avanzó o se volvió", () => {
    const forward = run([...filled, { type: "submitContact" }]);
    expect(forward.direction).toBe(1);
    expect(bookingReducer(forward, { type: "back" }).direction).toBe(-1);
    expect(run([{ type: "month", delta: 1 }], forward).monthDirection).toBe(1);
    expect(run([{ type: "month", delta: -1 }], forward).monthDirection).toBe(-1);
  });
});

describe("país y reinicio", () => {
  it("cambiar de país vacía característica y número", () => {
    const s = run([...filled, { type: "field", name: "dialCode", value: "56" }]);
    expect(s.contact).toMatchObject({ dialCode: "56", areaCode: "", number: "", firstName: "Ana" });
  });

  it("reset vuelve al paso 1 con todo vacío", () => {
    const s = run([...filled, { type: "submitContact" }, { type: "day", day: { year: 2026, month: 11, day: 25 } }, { type: "hour", hour: 9 }, { type: "reset" }]);
    expect(s).toMatchObject({ step: 1, day: null, hour: null, answers: [], question: 0 });
    expect(s.contact.firstName).toBe("");
    expect(s.now).not.toBeNull();
  });
});
