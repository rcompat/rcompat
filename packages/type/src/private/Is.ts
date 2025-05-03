import type IsAny from "#IsAny";

type IsEqual<T, U> = IsAny<T> extends true ? false :
  [T] extends [U] ? [U] extends [T] ? true : false : false;

export type { IsEqual as default };
