import type Dict from "#Dict";
import type HasSpecificKeys from "#HasSpecificKeys";
import type IsAny from "#IsAny";
import type IsArray from "#IsArray";
import type IsClass from "#IsClass";
import type IsEqual from "#IsEqual";
import type IsNever from "#IsNever";
import type IsTuple from "#IsTuple";
import type IsUnion from "#IsUnion";
import type IsUnknown from "#IsUnknown";
import type IsVoid from "#IsVoid";
import type Mutable from "#Mutable";
import type PrintArray from "#PrintArray";
import type PrintClass from "#PrintClass";
import type PrintDict from "#PrintDict";
import type PrintTuple from "#PrintTuple";
import type PrintUnion from "#PrintUnion";

type Print<T> =
  IsVoid<T> extends true ? "void" :
  IsUnknown<T> extends true ? "unknown" :
  IsNever<T> extends true ? "never" :
  IsAny<T> extends true ? "any" :
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
  IsUnion<T> extends true ? PrintUnion<T> :
  T extends string ? string extends T ? "string" : `'${T}'` :
  T extends number ? number extends T ? "number" : `${T}` :
  T extends bigint ? bigint extends T ? "bigint" : `${T}n` :
  T extends symbol ? "symbol" :
  T extends null ? "null" :
  T extends undefined ? "undefined" :
  IsTuple<T> extends true ? PrintTuple<T> :
  IsArray<T> extends true ?
  T extends (infer E)[] ? `${PrintArray<E>}[]` :
  T extends ReadonlyArray<infer E> ? `readonly ${Print<E>}[]` : "array" :
  T extends Dict ?
  // If T is a fully readonly, concrete object (like Readonly<{ ok: boolean }>),
  // print it wrapped as Readonly<...>. Otherwise print the dictionary normally.
  IsEqual<T, Readonly<T>> extends true ?
  HasSpecificKeys<T> extends true ?
  `Readonly<${PrintDict<Mutable<T>>}>` :
  PrintDict<T> :
  PrintDict<T> :
  IsClass<T> extends true ? PrintClass<T> :
  never
  ;

export type { Print as default };
