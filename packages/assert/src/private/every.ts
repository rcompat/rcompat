import type ErrorFunction from "#ErrorFallbackFunction";
import is from "#is";
import type Newable from "@rcompat/type/Newable";

type EveryConditions = {
  [K in Exclude<keyof typeof is, "instance">]: (xs: unknown[]) => boolean;
} & {
  instance: (xs: unknown[], N: Newable, error?: ErrorFunction | string) => boolean;
};

const every = {} as EveryConditions;

for (const key of Object.keys(is) as (keyof typeof is)[]) {
  if (key === "instance") continue;
  every[key] = (xs: unknown[]) => xs.every(x => is[key](x));
}

every.instance = (xs: unknown[], N: Newable, error?: ErrorFunction | string) =>
  xs.every(x => is.instance(x, N, error));

export default every;
