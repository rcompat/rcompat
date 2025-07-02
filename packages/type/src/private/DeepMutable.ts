import type Dictionary from "#Dictionary";

type DeepMutable<T> =
  T extends readonly [...infer E extends readonly unknown[]]
    ? { -readonly [K in keyof E]: DeepMutable<E[K]> }
    : T extends Dictionary
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T;

export type { DeepMutable as default };
