import Dictionary from "@rcompat/record/Dictionary";

const scalars = ["bigint", "boolean", "number", "string", "symbol", "undefined"];
type Scalar = typeof scalars[number];

type UnknownSet = Set<unknown>;
type UnknownMap = Map<PropertyKey, unknown>;

const is = {
  primitive: (x: unknown): x is Scalar => scalars.includes(typeof x as Scalar),
  null: (x: unknown): x is null => x === null,
  object: (x: unknown): x is object => typeof x === "object",
  date: (x: unknown): x is Date => x instanceof Date,
  array: (x: unknown): x is unknown[] => Array.isArray(x),
  record: (x: unknown): x is Dictionary => typeof x === "object" && !is.null(x),
  set: (x: unknown): x is UnknownSet => x instanceof Set,
  map: (x: unknown): x is UnknownMap => x instanceof Map,
};

const equal_array = <T extends unknown[]>(left: T, right: T) =>
  left.reduce<boolean>((equal, _, i) => equal && equals(left[i], right[i]), true);
const equal_record = <T extends Dictionary>(left: T, right: T) =>
  Object.keys(left).reduce((to, key) =>
    to && equals(left[key], right[key]), true);
const equal_set = <T extends unknown[]>(left: T, right: T) =>
  left.reduce<boolean>((equal, member) =>
    equal && right.find(_ => equals(_, member)) !== undefined, true);
const equal_map = <T extends Dictionary>(left: T, right: T) =>
  equal_record(left, right) && equal_record(right, left);

const equal = {
  primitive: <T>(x: T, y: T) => x === y || Object.is(x, y),
  array: <T extends unknown[]>(x: T, y: T) => 
    equal_array(x, y) && equal_array(y, x),
  date: <T extends Date>(x: T, y: T) => x.getTime() === y.getTime(),
  record: <T extends Dictionary>(x: T, y: T) =>
    equal_record(x, y) && equal_record(y, x),
  set: <T extends UnknownSet>(x: T, y: T) =>
    x.isSubsetOf(y) && y.isSubsetOf(x)
    || x.size === y.size 
      && equal_set([...x], [...y]) 
      && equal_set([...y], [...x]),
  map: <T extends UnknownMap>(x: T, y: T) =>
    x.size === y.size && 
      equal_map(Object.fromEntries(x.entries()), Object.fromEntries(y.entries())),
};

const checks = [
  [is.primitive, <T>(x: T, y: T) => is.primitive(y) && equal.primitive(x, y)],
  [is.null, <T>(_: T, y: T) => is.null(y)],
  [is.date, <T>(x: T, y: T) => is.date(y) && equal.date(x as Date, y)],
  [is.array, <T>(x: T, y: T) => is.array(y) && equal.array(x as unknown[], y)],
  [is.set, <T>(x: T, y: T) => is.set(y) && equal.set(x as UnknownSet, y)],
  [is.map, <T>(x: T, y: T) => is.map(y) && equal.map(x as UnknownMap, y)],
  [is.record, <T>(x: T, y: T) => is.record(y) && equal.record(x as Dictionary, y)],
  [(_: unknown) => true, <T>(_: T, _1: T) => false]
] as const;

const equals = <T>(x: T, y: T): boolean => typeof x === typeof y 
  ? checks.find(([predicate]) => predicate(x))![1](x, y)
  : false;

export { equals as default };
