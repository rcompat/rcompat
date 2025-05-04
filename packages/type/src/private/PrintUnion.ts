import type Join from "#Join";
import type Print from "#Print";
import type UnionToTuple from "#UnionToTuple";
import type Unique from "#Unique";
import type PrintBoolean from "#PrintBoolean";

type PrintUnion<T> =
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
  UnionToTuple<T> extends infer Tuple extends unknown[] ?
    {
      [K in keyof Tuple]: PrintBoolean<Print<Tuple[K]>>
    } extends infer Printed extends string[]
      ? Join<Unique<Printed>, " |">
      : never
    : never;

export type { PrintUnion as default };
