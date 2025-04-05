import array from "#types/array";
import date from "#types/date";
import map, { type UnknownMap } from "#types/map";
import nul from "#types/null";
import record from "#types/record";
import scalar from "#types/scalar";
import set, { type UnknownSet } from "#types/set";
import Dictionary from "@rcompat/record/Dictionary";

const checks = [
  [scalar.is, <T>(x: T, y: T) => scalar.is(y) && scalar.equal(x, y)],
  [nul.is, <T>(_: T, y: T) => nul.is(y)],
  [date.is, <T>(x: T, y: T) => date.is(y) && date.equal(x as Date, y)],
  [array.is, <T>(x: T, y: T) => array.is(y) && array.equal(x as unknown[], y)],
  [set.is, <T>(x: T, y: T) => set.is(y) && set.equal(x as UnknownSet, y)],
  [map.is, <T>(x: T, y: T) => map.is(y) && map.equal(x as UnknownMap, y)],
  [record.is, <T>(x: T, y: T) => record.is(y) && record.equal(x as Dictionary, y)],
  [(_: unknown) => true, <T>(_: T, _1: T) => false]
] as const;

const equals = <T>(x: T, y: T): boolean => typeof x === typeof y 
  ? checks.find(([predicate]) => predicate(x))![1](x, y)
  : false;

export { equals as default };
