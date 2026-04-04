import type Join from "#Join";
import type Print from "#Print";
import type PrintBoolean from "#PrintBoolean";
import type UnionToTuple from "#UnionToTuple";
import type Unique from "#Unique";

type PrintUnionMembers<T> =
  UnionToTuple<T> extends infer Tuple extends unknown[]
  ? { [K in keyof Tuple]: PrintBoolean<Print<Tuple[K]>> } extends infer Printed extends string[]
  ? Join<Unique<Printed>, " |">
  : never
  : never;

type HasUndefined<T> =
  [Extract<T, undefined>] extends [never] ? false : true;

type HasVoid<T> =
  [Extract<T, void>] extends [never] ? false : true;

type PrintUnion<T> =
  [T] extends [boolean]
  ? [boolean] extends [T]
  ? "boolean"
  : `${T}`
  : HasUndefined<T> extends true
  ? Exclude<T, undefined> extends never
  ? "undefined"
  : `${PrintUnion<Exclude<T, undefined>>} | undefined`
  : HasVoid<T> extends true
  ? Exclude<T, void> extends never
  ? "void"
  : `${PrintUnion<Exclude<T, void>>} | void`
  : PrintUnionMembers<T>;

export type { PrintUnion as default };;
