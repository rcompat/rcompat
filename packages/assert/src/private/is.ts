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
  defined,
  dict: condition(is.dict, "must be a plain object (dictionary)"),
  string: primitive("string"),
  number: primitive("number"),
  bigint: primitive("bigint"),
  boolean: primitive("boolean"),
  symbol: primitive("symbol"),
  function: primitive("function"),
  undefined: primitive("undefined"),
  null: condition(x => x === null, "must be null"),
  array: condition(is.array, "must be array"),
  object: condition(is.object, "must be object"),
  newable: condition(is.newable, "must be newable"),
  int: condition(is.int, "must be integer"),
  uint: condition(is.uint, "must be unsigned integer"),
  true: condition(x => x === true, "must be true"),
  false: condition(x => x === false, "must be false"),
  uuid,
  instance,
};
