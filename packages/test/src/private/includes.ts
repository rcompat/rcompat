import equals from "#equals";
import array from "#types/array";
import date from "#types/date";
import map, { type UnknownMap } from "#types/map";
import record from "#types/record";
import set, { type UnknownSet } from "#types/set";
import string from "#types/string";
import Dictionary from "@rcompat/record/Dictionary";

const includes = <T>(x: T, y: T): boolean => typeof x === typeof y
  ? equals(x, y)
    ? true
    : ([
      [string.is, <T>(x: T, y: T) => string.is(y) && string.include(x as string, y)],
      [date.is, <T>(x: T, y: T) => date.is(y) && date.include(x as Date, y)],
      [array.is, <T>(x: T, y: T) => array.is(y) && array.include(x as unknown[], y)],
      [set.is, <T>(x: T, y: T) => set.is(y) && set.include(x as UnknownSet, y)],
      [map.is, <T>(x: T, y: T) => map.is(y) && map.include(x as UnknownMap, y)],
      [record.is, <T>(x: T, y: T) => record.is(y) && record.include(x as Dictionary, y)],
      [() => true, () => false],
    ] as const).find(([predicate]) => predicate(x))![1](x, y)
  : false;

export { includes as default };
