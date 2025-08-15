type AbstractNewable<I = unknown, A extends any[] = any[]> =
  abstract new (...args: A) => I;

export type { AbstractNewable as default };
