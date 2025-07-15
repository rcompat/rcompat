import type Dict from "#Dict";

type DeepMutable<T> =
  T extends readonly [...infer E extends readonly unknown[]]
    ? { -readonly [K in keyof E]: DeepMutable<E[K]> }
    : T extends Dict
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T;

export type { DeepMutable as default };
