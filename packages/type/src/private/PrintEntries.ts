import type Print from "#Print";
import type UnionToTuple from "#UnionToTuple";

type PrintEntries<T, Keys extends unknown[] = UnionToTuple<keyof T>> =
  Keys extends [infer K, ...infer Rest] ?
    K extends keyof T & (number | string) ?
      Rest extends []
        ? `${K}: ${Print<T[K]>}`
        : `${K}: ${Print<T[K]>}, ${PrintEntries<T, Rest>}`
      : never
    : "";

export type { PrintEntries as default };
