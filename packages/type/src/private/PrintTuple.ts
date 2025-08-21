import type Join from "#Join";
import type Print from "#Print";

type TupleToString<T> =
  T extends readonly unknown[]
  ? { [K in keyof T]: `${Print<T[K]>}` } extends infer Mapped extends string[]
  ? `[${Join<Mapped>}]`
  : never
  : never
  ;

export type { TupleToString as default };
