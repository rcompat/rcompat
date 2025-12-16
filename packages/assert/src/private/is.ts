import type Condition from "#Condition";
import errored from "#errored";
import type ErrorFunction from "#ErrorFallbackFunction";
import is from "@rcompat/is";
import type Newable from "@rcompat/type/Newable";

function assert(value: boolean, error?: ErrorFunction | string) {
  if (value === true) return true;
  errored(error);
  return false;
};

function stringify(x: unknown) {
  try {
    const stringified = JSON.stringify(x) as string | undefined;

    // symbol and function will be undefined
    if (stringified !== undefined) {
      return stringified;
    }
  } catch {
    // bigint will throw
  }

  // has a toString method
  if (x?.toString !== undefined) {
    return x!.toString();
  }

  return `${x}`;
}

function deferr(x: unknown, message: string, error?: ErrorFunction | string) {
  return error ?? `\`${stringify(x)}\` ${message}`;
}

function primitive(type: string): Condition {
  return (x, error) =>
    assert(typeof x === type, deferr(x, `must be of type ${type}`, error));
}

const defined: Condition = (x, error) =>
  assert(is.defined(x), deferr(x, "must be defined", error));

const uuid: Condition = (x, error) => {
  // crypto.randomUUID(): RFC 4122 v4, lowercase hex only
  const uuidv4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  return assert(typeof x === "string" && uuidv4.test(x),
    deferr(x, "must be a valid UUIDv4 string", error));
};

const instance = (x: unknown, N: Newable, error?: ErrorFunction | string) =>
  assert(x instanceof N, deferr(x, `must be instance of ${N.name}`, error));

function condition(pred: (y: unknown) => boolean, errmsg: string): Condition {
  return (x, error) => assert(pred(x), deferr(x, errmsg, error));
}

export default {
  bigint: primitive("bigint"),
  boolean: primitive("boolean"),
  function: primitive("function"),
  number: primitive("number"),
  string: primitive("string"),
  symbol: primitive("symbol"),
  undefined: primitive("undefined"),

  array: condition(is.array, "must be array"),
  date: condition(is.date, "must be Date"),
  dict: condition(is.dict, "must be a plain object (dictionary)"),
  error: condition(is.error, "must be Error"),
  false: condition(x => x === false, "must be false"),
  finite: condition(is.finite, "must be finite number"),
  int: condition(is.int, "must be integer"),
  map: condition(is.map, "must be Map"),
  nan: condition(is.nan, "must be NaN"),
  newable: condition(is.newable, "must be newable"),
  null: condition(x => x === null, "must be null"),
  nullish: condition(is.nullish, "must be null or undefined"),
  object: condition(is.object, "must be object"),
  promise: condition(is.promise, "must be Promise"),
  regexp: condition(is.regexp, "must be RegExp"),
  safeint: condition(is.safeint, "must be safe integer"),
  set: condition(is.set, "must be Set"),
  true: condition(x => x === true, "must be true"),
  uint: condition(is.uint, "must be unsigned integer"),
  url: condition(is.url, "must be URL"),

  defined,
  instance,
  uuid,
};
