import type Dictionary from "#Dictionary";
import type IndexedKeys from "#IndexedKeys";
import type IsAny from "#IsAny";
import type IsArray from "#IsArray";
import type IsClass from "#IsClass";
import type IsNever from "#IsNever";
import type IsTuple from "#IsTuple";
import type IsUnion from "#IsUnion";
import type IsUnknown from "#IsUnknown";
import type IsVoid from "#IsVoid";
import type Join from "#Join";
import type Printable from "#Printable";
import type PrintableGeneric from "#PrintableGeneric";
import type UnionToTuple from "#UnionToTuple";

type TupleToString<T> =
  T extends readonly unknown[]
    ? { [K in keyof T]: `${Print<T[K]>}` } extends infer Mapped extends string[]
        ? `[${Join<Mapped>}]`
        : never
    : never;

type ObjectEntriesToString<T, Keys extends unknown[] = UnionToTuple<keyof T>> =
  Keys extends [infer K, ...infer Rest] ?
    K extends keyof T & (string | number) ?
      Rest extends []
        ? `${K}: ${Print<T[K]>}`
        : `${K}: ${Print<T[K]>}, ${ObjectEntriesToString<T, Rest>}`
    : never
  : "";

type ObjectToString<T extends Dictionary> = IndexedKeys<T> extends true
  ? `{ ${ObjectEntriesToString<T>} }`
  : "{}"
;

type NormalizePrint<T> = T extends "true" | "false" ? "boolean" : T;

type Unique<T extends readonly string[], Acc extends string[] = []> =
  T extends [infer Head extends string, ...infer Rest extends string[]]
    ? Head extends Acc[number]
      ? Unique<Rest, Acc>
      : Unique<Rest, [...Acc, Head]>
    : Acc;

type FormatUnion<T> =
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
  UnionToTuple<T> extends infer Tup extends unknown[]
    ? { [K in keyof Tup]: NormalizePrint<Print<Tup[K]>> } extends infer Printed extends string[]
      ? Join<Unique<Printed>, " |">
      : never
    : never;

type ArrayToString<T> =
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
  IsUnion<T> extends true ? `(${Print<T>})` : `${Print<T>}`;

type ClassToString<T> =
  T extends Printable<infer N extends string>
    ? T extends PrintableGeneric<infer _, infer P>
      ? `${N}<${Print<P>}>` : `${N}` :
  T extends String ? "String" :
  T extends Boolean ? "Boolean" :
  T extends BigInt ? "BigInt" :
  T extends Number ? "Number" :
  T extends Symbol ? "Symbol" :
  T extends RegExp ? "RegExp" :
  T extends Error ? "Error" :
  T extends Function ? "Function" :
  T extends FormData ? "FormData" :
  T extends Date ? "Date" :
  T extends URL ? "URL" :
  // needs to come before Blob, as File is a Blob
  T extends File ? "File" :
  T extends Blob ? "Blob" :
  T extends ReadableStream ? "ReadableStream" :
  T extends WritableStream ? "WritableStream" :
  T extends Promise<infer E> ? `Promise<${Print<E>}>` :
  "Object";

type Print<T> =
  IsVoid<T> extends true ? "void" :
  IsUnknown<T> extends true ? "unknown" :
  IsNever<T> extends true ? "never" :
  IsAny<T> extends true ? "any" :
  [T] extends [boolean] ? [boolean] extends [T] ? "boolean" : `${T}` :
  IsUnion<T> extends true ? FormatUnion<T> :
  T extends string ? string extends T ? "string" : `'${T}'` :
  T extends number ? number extends T ? "number" : `${T}` :
  T extends bigint ? bigint extends T ? "bigint" : `${T}n` :
  T extends symbol ? `symbol` :
  T extends null ? `null` :
  T extends undefined ? `undefined` :
  IsTuple<T> extends true ? TupleToString<T> :
  IsArray<T> extends true ?
     T extends (infer E)[] ? `${ArrayToString<E>}[]` :
     T extends ReadonlyArray<infer E> ? `ReadonlyArray<${Print<E>}>` :
     "array" :
  T extends Dictionary ? ObjectToString<T> :
  IsClass<T> extends true ? ClassToString<T> :
  never;

export type { Print as default };
