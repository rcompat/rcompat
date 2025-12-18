import is from "#is";
import type { Newable } from "@rcompat/type";

type EveryConditions = {
  [K in Exclude<keyof typeof is, "instance">]: <T>(xs: T[]) => T[];
} & {
  instance: <T extends Newable>(xs: unknown[], N: T, error?: Error | string) =>
    InstanceType<T>[];
};

const every = {} as EveryConditions;

for (const key of Object.keys(is) as (keyof typeof is)[]) {
  if (key === "instance") continue;
  every[key] = <T>(xs: T[]): T[] => {
    xs.forEach(x => is[key](x));
    return xs;
  };
}

every.instance = <
  T extends Newable,
>(xs: unknown[], N: T, error?: Error | string): InstanceType<T>[] => {
  xs.forEach(x => is.instance(x, N, error));
  return xs as InstanceType<T>[];
};

export default every;
