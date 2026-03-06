import is from "#is";
import type MaybeError from "#MaybeError";
import type ShapeDescriptor from "#ShapeDescriptor";
import std_is from "@rcompat/is";
import type { Newable } from "@rcompat/type";

type MaybeConditions = {
  [K in Exclude<keyof typeof is, "instance" | "shape">]: <T>(x: T) => T;
} & {
  instance: <T extends Newable>(x: unknown, N: T, error?: MaybeError) =>
    InstanceType<T> | null | undefined;
  shape: <T>(x: unknown, descriptor: ShapeDescriptor, error?: MaybeError) =>
    T | null | undefined;
};

const maybe = {} as MaybeConditions;

for (const key of Object.keys(is) as (keyof typeof is)[]) {
  if (key === "instance" || key === "shape") continue;
  maybe[key] = <T>(x: T): T => {
    if (std_is.nullish(x)) return x;
    is[key](x);
    return x;
  };
}

maybe.instance = <
  T extends Newable,
>(x: unknown, N: T, error?: MaybeError): InstanceType<T> | null | undefined => {
  if (std_is.nullish(x)) return x as null | undefined;
  return is.instance(x, N, error);
};

maybe.shape = <T>(
  x: unknown,
  descriptor: ShapeDescriptor,
  error?: MaybeError): T | null | undefined => {
  if (std_is.nullish(x)) return x as null | undefined;
  return is.shape<T>(x, descriptor, error);
};

export default maybe;
