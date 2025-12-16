import type ErrorFunction from "#ErrorFallbackFunction";
import is from "#is";
import std_is from "@rcompat/is";
import type Newable from "@rcompat/type/Newable";

type MaybeConditions = {
  [K in Exclude<keyof typeof is, "instance">]: (x: unknown) => boolean;
} & {
  instance: (x: unknown, N: Newable, error?: ErrorFunction | string) => boolean;
};

const maybe = {} as MaybeConditions;

for (const key of Object.keys(is) as (keyof typeof is)[]) {
  if (key === "instance") continue;
  maybe[key] = (x: unknown) => std_is.nullish(x) || is[key](x);
}

maybe.instance = (x: unknown, N: Newable, error?: ErrorFunction | string) =>
  !std_is.nullish(x) && is.instance(x, N, error);

export default maybe;
