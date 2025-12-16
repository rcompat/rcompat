import empty from "#empty";
import newable from "#newable";
import numbers from "#numbers";
import numeric from "#numeric";
import object from "#object";
import primitive from "#primitive";
import strings from "#strings";
import type Dict from "@rcompat/type/Dict";
import type Nullish from "@rcompat/type/Nullish";

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

function isNullish(x: unknown): x is Nullish {
  return x === null || x === undefined;
}

function isPromise(x: unknown): x is Promise<unknown> {
  return x instanceof Promise;
}

function isRegExp(x: unknown): x is RegExp {
  return x instanceof RegExp;
}

function isTruthy(x: unknown) {
  return !!x;
}

function isURL(x: unknown): x is URL {
  return x instanceof URL;
}

function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}

function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}

export default {
  array: Array.isArray,
  blank: strings.isBlank,
  boolish: strings.isBoolish,
  date: isDate,
  defined: isDefined,
  dict: isDict,
  empty,
  error: isError,
  falsy: isFalsy,
  finite: numbers.isFinite,
  int: numbers.isInt,
  map: isMap,
  nan: numbers.isNaN,
  newable,
  nullish: isNullish,
  numeric,
  object,
  primitive,
  promise: isPromise,
  regexp: isRegExp,
  safeint: numbers.isSafeint,
  set: isSet,
  truthy: isTruthy,
  uint: numbers.isUint,
  url: isURL,
};
