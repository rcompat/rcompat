import type IsUnion from "#IsUnion";
import type Print from "#Print";

type PrintArray<T> =
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
    IsUnion<T> extends true ? `(${Print<T>})` : `${Print<T>}`;

export type { PrintArray as default };
