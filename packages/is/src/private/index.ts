import empty from "#empty";
import newable from "#newable";
import numbers from "#numbers";
import numeric from "#numeric";
import object from "#object";
import primitive from "#primitive";
import strings from "#strings";
import type { Dict, Nullish, UnknownFunction } from "@rcompat/type";

function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x);
}
function isArrayBuffer(x: unknown): x is ArrayBuffer {
  return x instanceof ArrayBuffer;
}
function isBigint(x: unknown): x is bigint {
  return typeof x === "bigint";
}
function isBlob(x: unknown): x is Blob {
  return x instanceof Blob;
}
function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}
function isBytes(x: unknown): x is Uint8Array {
  return x instanceof Uint8Array;
}
function isDate(x: unknown): x is Date {
  return x instanceof Date;
}
function isDefined(x: unknown) {
  return x !== undefined;
}
function isDict(x: unknown): x is Dict {
  if (typeof x !== "object" || x === null) return false;
  const prototype = Object.getPrototypeOf(x);
  return prototype === Object.prototype || prototype === null;
}
function isError(x: unknown): x is Error {
  return x instanceof Error;
}
function isFalsy(x: unknown): boolean {
  return !x;
}
function isFile(x: unknown): x is File {
  return x instanceof File;
}
function isFunction(x: unknown): x is UnknownFunction {
  return typeof x === "function";
}
function isIterable(x: unknown): x is Iterable<unknown> {
  return typeof (x as Iterable<unknown>)?.[Symbol.iterator] === "function";
}
function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}
function isNull(x: unknown): x is null {
  return x === null;
}
function isNullish(x: unknown): x is Nullish {
  return x === null || x === undefined;
}
function isNumber(x: unknown): x is number {
  return typeof x === "number";
}
function isPromise(x: unknown): x is Promise<unknown> {
  return x instanceof Promise;
}
function isRegExp(x: unknown): x is RegExp {
  return x instanceof RegExp;
}
function isRequest(x: unknown): x is Request {
  return x instanceof Request;
}
function isResponse(x: unknown): x is Response {
  return x instanceof Response;
}
function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}
function isString(x: unknown): x is string {
  return typeof x === "string";
}
function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}
function isTruthy(x: unknown) {
  return !!x;
}
function isTypedArray(x: unknown): x is ArrayBufferView {
  return ArrayBuffer.isView(x);
}
function isUndefined(x: unknown): x is undefined {
  return x === undefined;
}
function isURL(x: unknown): x is URL {
  return x instanceof URL;
}

export default {
  array: isArray,
  arraybuffer: isArrayBuffer,
  bigint: isBigint,
  blank: strings.isBlank,
  blob: isBlob,
  boolish: strings.isBoolish,
  boolean: isBoolean,
  bytes: isBytes,
  date: isDate,
  defined: isDefined,
  dict: isDict,
  empty,
  error: isError,
  falsy: isFalsy,
  file: isFile,
  finite: numbers.isFinite,
  function: isFunction,
  int: numbers.isInt,
  iterable: isIterable,
  map: isMap,
  nan: numbers.isNaN,
  nonempty: (x: unknown) => !empty(x),
  newable,
  null: isNull,
  nullish: isNullish,
  number: isNumber,
  numeric,
  object,
  primitive,
  promise: isPromise,
  request: isRequest,
  response: isResponse,
  regexp: isRegExp,
  safeint: numbers.isSafeInt,
  set: isSet,
  string: isString,
  symbol: isSymbol,
  truthy: isTruthy,
  typedarray: isTypedArray,
  uint: numbers.isUint,
  undefined: isUndefined,
  url: isURL,
};
