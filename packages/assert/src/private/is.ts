import errors from "#errors";
import type ShapeDescriptor from "#ShapeDescriptor";
import type TypesOfTypeMap from "#TypesOfTypeMap";
import is from "@rcompat/is";
import type { Dict, Newable } from "@rcompat/type";

function assert(value: boolean, error: Error) {
  if (value === true) return;
  throw error;
}

function primitive<K extends keyof TypesOfTypeMap>(type: K) {
  return (x: unknown, error?: Error): TypesOfTypeMap[K] => {
    assert(typeof x === type, error ?? errors[`invalid_${type}`](x));
    return x as TypesOfTypeMap[K];
  };
}

function condition<T>(pred: (y: unknown) => y is T, err: (x: unknown) => Error) {
  return (x: unknown, error?: Error): T => {
    assert(pred(x), error ?? err(x));
    return x as T;
  };
}

function untyped(pred: (y: unknown) => boolean, err: (x: unknown) => Error) {
  return <T>(x: T, error?: Error): T => {
    assert(pred(x), error ?? err(x));
    return x;
  };
}

function narrowed<T>(pred: (y: unknown) => y is T, err: (x: unknown) => Error) {
  return <U>(x: U, error?: Error): U extends T ? U : T => {
    assert(pred(x), error ?? err(x));
    return x as any;
  };
}

const defined = <T>(x: T, error?: Error): NonNullable<T> => {
  assert(is.defined(x), error ?? errors.invalid_defined(x));
  return x as NonNullable<T>;
};

function uuid(x: unknown, error?: Error): string {
  const uuidv4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  assert(typeof x === "string" && uuidv4.test(x), error ?? errors.invalid_uuid(x));
  return x as string;
};

function instance<T extends Newable>(
  x: unknown,
  N: T,
  error?: Error,
): InstanceType<T> {
  assert(x instanceof N, error ?? errors.invalid_instance(x, N.name));
  return x as InstanceType<T>;
};

function shape<T>(x: unknown, descriptor: ShapeDescriptor, error?: Error): T {
  assert(is.dict(x), error ?? errors.invalid_shape_dict(x));
  for (const [key, type] of Object.entries(descriptor)) {
    const optional = type.endsWith("?");
    const base_type = type.replace("?", "") as keyof TypesOfTypeMap;
    const value = (x as Dict)[key];
    if (optional && value === undefined) continue;
    assert(typeof value === base_type,
      error ?? errors.invalid_shape_property(key, base_type, value));
  }
  return x as T;
}

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
  array: condition(is.array, errors.invalid_array),
  date: condition(is.date, errors.invalid_date),
  dict: narrowed(is.dict, errors.invalid_dict),
  error: condition(is.error, errors.invalid_error),
  false: condition(x => x === false, errors.invalid_false),
  finite: condition(is.finite, errors.invalid_finite),
  int: condition(is.int, errors.invalid_int),
  map: condition(is.map, errors.invalid_map),
  nan: condition(is.nan, errors.invalid_nan),
  newable: condition(is.newable, errors.invalid_newable),
  null: condition(x => x === null, errors.invalid_null),
  nullish: condition(is.nullish, errors.invalid_nullish),
  object: condition(is.object, errors.invalid_object),
  promise: condition(is.promise, errors.invalid_promise),
  regexp: condition(is.regexp, errors.invalid_regexp),
  safeint: condition(is.safeint, errors.invalid_safeint),
  set: condition(is.set, errors.invalid_set),
  true: condition(x => x === true, errors.invalid_true),
  uint: condition(is.uint, errors.invalid_uint),
  url: condition(is.url, errors.invalid_url),
  empty: untyped(is.empty, errors.invalid_empty),
  nonempty: untyped(is.nonempty, errors.invalid_nonempty),
  shape,

  defined,
  instance,
  uuid,
};
