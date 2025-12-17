import errored from "#errored";
import type TypesOfTypeMap from "#TypesOfTypeMap";
import is from "@rcompat/is";
import type Newable from "@rcompat/type/Newable";

function assert(value: boolean, error?: Error | string) {
  if (value === true) return;
  errored(error);
}

function stringify(x: unknown) {
  try {
    const stringified = JSON.stringify(x) as string | undefined;
    if (stringified !== undefined) {
      return stringified;
    }
  } catch {
    // bigint will throw
  }
  if (x?.toString !== undefined) {
    return x!.toString();
  }
  return `${x}`;
}

function deferr(x: unknown, message: string, error?: Error | string) {
  return error ?? `\`${stringify(x)}\` ${message}`;
}

function primitive<K extends keyof TypesOfTypeMap>(type: K) {
  return (x: unknown, error?: Error | string): TypesOfTypeMap[K] => {
    assert(typeof x === type, deferr(x, `must be of type ${type}`, error));
    return x as TypesOfTypeMap[K];
  };
}

function condition<T>(pred: (y: unknown) => y is T, errmsg: string) {
  return (x: unknown, error?: Error | string): T => {
    assert(pred(x), deferr(x, errmsg, error));
    return x as T;
  };
}

function conditionUntyped(pred: (y: unknown) => boolean, errmsg: string) {
  return <T>(x: T, error?: Error | string): T => {
    assert(pred(x), deferr(x, errmsg, error));
    return x;
  };
}

const defined = <T>(x: T, error?: Error | string): NonNullable<T> => {
  assert(is.defined(x), deferr(x, "must be defined", error));
  return x as NonNullable<T>;
};

const uuid = (x: unknown, error?: Error | string): string => {
  const uuidv4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  assert(typeof x === "string" && uuidv4.test(x),
    deferr(x, "must be a valid UUIDv4 string", error));
  return x as string;
};

const instance = <T extends Newable>(x: unknown, N: T, error?: Error | string): InstanceType<T> => {
  assert(x instanceof N, deferr(x, `must be instance of ${N.name}`, error));
  return x as InstanceType<T>;
};

export default {
  // primitives
  bigint: primitive("bigint"),
  boolean: primitive("boolean"),
  function: primitive("function"),
  number: primitive("number"),
  string: primitive("string"),
  symbol: primitive("symbol"),
  undefined: primitive("undefined"),

  // conditions
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
  nonempty: conditionUntyped(is.nonempty, "must not be empty"),

  defined,
  instance,
  uuid,
};
