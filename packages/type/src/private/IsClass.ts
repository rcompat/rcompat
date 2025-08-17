import type Is from "#Is";
import type IsAny from "#IsAny";
import type IsNever from "#IsNever";
import type Some from "#Some";

type IsClass<T> =
  Some<[
    IsNever<T>,
    IsAny<T>,
    Is<T, Math>,
    Is<T, JSON>,
    Is<T, Atomics>,
  ]> extends true ? false :
  T extends { constructor: unknown } & object
  ? true
  : false;

export type { IsClass as default };
