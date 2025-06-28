import type AllOptional from "#AllOptional";

type ImpliedOptional<T> = AllOptional<T> extends true
  ? T | undefined
  : T;

export type { ImpliedOptional as default };
