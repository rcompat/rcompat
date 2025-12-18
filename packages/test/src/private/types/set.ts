import equals from "#equals";
import includes from "#includes";
import type { UnknownSet } from "@rcompat/type";

const is = (x: unknown): x is UnknownSet => x instanceof Set;

const partial = <t extends unknown[]>(x: t, y: t) =>
  x.reduce<boolean>((equal, xi) =>
    equal && y.find(yj => equals(yj, xi)) !== undefined, true);

const equal = <T extends UnknownSet>(x: T, y: T) =>
  x.isSubsetOf(y) && y.isSubsetOf(x)
  || x.size === y.size
  && partial([...x], [...y])
  && partial([...y], [...x]);

const deep_compare = <T extends unknown[]>(x: T, y: T) =>
  y.reduce<boolean>((included, yi) =>
    included && x.find(xj => includes(xj, yi)) !== undefined, true);

const include = <T extends UnknownSet>(x: T, y: T) =>
  y.isSubsetOf(x) || x.size >= y.size && deep_compare([...x], [...y]);

export default { equal, include, is, partial };
