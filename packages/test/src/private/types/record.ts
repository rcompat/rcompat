import equals from "#equals";
import includes from "#includes";
import Dictionary from "@rcompat/record/Dictionary";

const is_null = (x: unknown): x is null => x === null;

const is = (x: unknown): x is Dictionary => typeof x === "object" && !is_null(x);

const partial = <t extends Dictionary>(x: t, y: t) =>
  Object.keys(x).reduce((equal, key) =>
    equal && equals(x[key], y[key]), true);

const equal = <T extends Dictionary>(x: T, y: T) =>
  Object.keys(x).length === Object.keys(y).length && partial(x, y);

const include = <T extends Dictionary>(x: T, y: T) =>
  Object.keys(x).length >= Object.keys(y).length && 
    Object.keys(y).reduce((included, key) =>
      included && includes(x[key], y[key]), true);

export default { equal, include, is, partial };
