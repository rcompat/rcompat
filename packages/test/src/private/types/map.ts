import to_object from "#to-object";
import record from "#types/record";
import type { UnknownMap } from "@rcompat/type";

const is = (x: unknown): x is UnknownMap => x instanceof Map;

const include = <T extends UnknownMap>(x: T, y: T) =>
  record.include(to_object(x), to_object(y));

const equal = <T extends UnknownMap>(x: T, y: T) =>
  record.equal(to_object(x), to_object(y));

const partial = equal;

export default { equal, include, is, partial };
