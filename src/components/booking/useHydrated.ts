"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false en el HTML del servidor y hasta que React hidrata; true después. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
