import is from "#is";
import std_is from "@rcompat/is";
import type Newable from "@rcompat/type/Newable";

type MaybeConditions = {
  [K in Exclude<keyof typeof is, "instance">]: <T>(x: T) => T;
} & {
  instance: <T extends Newable>(x: unknown, N: T, error?: Error | string) =>
    InstanceType<T> | null | undefined;
};

const maybe = {} as MaybeConditions;

for (const key of Object.keys(is) as (keyof typeof is)[]) {
  if (key === "instance") continue;
  maybe[key] = <T>(x: T): T => {
    if (std_is.nullish(x)) return x;
    is[key](x);
    return x;
  };
}

maybe.instance = <
  T extends Newable,
>(x: unknown, N: T, error?: Error | string): InstanceType<T> | null | undefined => {
  if (std_is.nullish(x)) return x as null | undefined;
  return is.instance(x, N, error);
};

export default maybe;
